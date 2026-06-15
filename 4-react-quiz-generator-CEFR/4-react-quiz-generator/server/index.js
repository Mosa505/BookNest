import express from 'express'
import cors from 'cors'
import multer from 'multer'
import dotenv from 'dotenv'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({
    path: path.resolve(__dirname, '../.env'),
    override: true
})

const app = express()
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 20 * 1024 * 1024
    }
})

const PORT = process.env.PORT || 8787
const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash'

const VALID_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']
const VALID_DIFFICULTIES = ['easy', 'medium', 'hard']

const QUIZ_SCHEMA = {
    type: 'object',
    properties: {
        cefr_level: {
            type: 'string',
            enum: VALID_LEVELS
        },
        questions: {
            type: 'array',
            minItems: 5,
            maxItems: 5,
            items: {
                type: 'object',
                properties: {
                    question: { type: 'string' },
                    options: {
                        type: 'array',
                        minItems: 4,
                        maxItems: 4,
                        items: { type: 'string' }
                    },
                    correct_answer: { type: 'string' },
                    explanation: { type: 'string' }
                },
                required: ['question', 'options', 'correct_answer', 'explanation']
            }
        }
    },
    required: ['cefr_level', 'questions']
}

const LEVEL_SCHEMA = {
    type: 'object',
    properties: {
        cefr_level: {
            type: 'string',
            enum: VALID_LEVELS
        }
    },
    required: ['cefr_level']
}

app.use(cors())
app.use(express.json({ limit: '1mb' }))

const parseCefrLevel = (rawLevel) => {
    const level = String(rawLevel || '').toUpperCase().trim()
    if (!VALID_LEVELS.includes(level)) {
        throw new Error('Gemini returned an invalid CEFR level.')
    }
    return level
}

const normalizeDifficulty = (rawDifficulty) => {
    const difficulty = String(rawDifficulty || 'medium').toLowerCase().trim()
    return VALID_DIFFICULTIES.includes(difficulty) ? difficulty : 'medium'
}

const getDifficultyInstruction = (difficulty) => {
    if (difficulty === 'easy') {
        return 'Use easier wording and direct questions while staying faithful to the source.'
    }

    if (difficulty === 'hard') {
        return 'Use more challenging wording and deeper conceptual distractors while staying faithful to the source.'
    }

    return 'Use balanced wording and moderate complexity while staying faithful to the source.'
}

const buildQuizPrompt = ({ sourceType, summary, topic, questionCount, difficulty, cefrLevel }) => {
    const sourceInstructions =
        sourceType === 'topic'
            ? [
                'Source type: Topic-based generation.',
                `Topic: ${topic?.trim() || '(none)'}`,
                'Create questions from this topic using generally accepted foundational knowledge.'
            ]
            : [
                'Source type: Book content.',
                'Use the provided PDF and/or summary as the only primary source.',
                `Source summary (if provided): ${summary?.trim() ? summary.trim() : '(none)'}`,
                `The source has already been classified as CEFR ${cefrLevel}. Keep all questions aligned with CEFR ${cefrLevel}.`
            ]

    return [
        'You are a quiz authoring assistant.',
        'Generate high-quality multiple-choice questions with one correct option each.',
        `Return exactly ${questionCount} questions.`,
        getDifficultyInstruction(difficulty),
        'Explanations must be concise and useful (1 sentence).',
        'Each options array must include the correct answer text exactly once.',
        ...sourceInstructions
    ].join('\n')
}

const buildLevelPrompt = ({ summary }) => {
    return [
        'You are a CEFR language-level classifier.',
        'Analyze the provided book content and return only the CEFR level.',
        'Use one of: A1, A2, B1, B2, C1, C2.',
        'Consider vocabulary range, sentence complexity, and abstractness.',
        `Source summary (if provided): ${summary?.trim() ? summary.trim() : '(none)'}`
    ].join('\n')
}

const validateQuestionShape = (questions) => {
    if (!Array.isArray(questions)) {
        return false
    }

    return questions.every((q) => {
        if (!q || typeof q !== 'object') {
            return false
        }

        if (!q.question || !Array.isArray(q.options) || !q.correct_answer || !q.explanation) {
            return false
        }

        if (q.options.length !== 4) {
            return false
        }

        return q.options.includes(q.correct_answer)
    })
}

const requestGemini = async ({ schema, parts, temperature }) => {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`

    const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            contents: [
                {
                    role: 'user',
                    parts
                }
            ],
            generationConfig: {
                responseMimeType: 'application/json',
                responseSchema: schema,
                temperature
            }
        })
    })

    if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Gemini request failed: ${response.status} ${errorText}`)
    }

    const payload = await response.json()
    const text = payload?.candidates?.[0]?.content?.parts?.[0]?.text

    if (!text) {
        throw new Error('Gemini returned an empty response.')
    }

    try {
        return JSON.parse(text)
    } catch {
        throw new Error('Gemini returned invalid JSON.')
    }
}

const classifyLevelFromGemini = async ({ summary, pdfFile }) => {
    const parts = [
        {
            text: buildLevelPrompt({ summary })
        }
    ]

    if (pdfFile) {
        parts.push({
            inline_data: {
                mime_type: 'application/pdf',
                data: pdfFile.buffer.toString('base64')
            }
        })
    }

    const data = await requestGemini({
        schema: LEVEL_SCHEMA,
        parts,
        temperature: 0.2
    })

    return {
        cefrLevel: parseCefrLevel(data.cefr_level)
    }
}

const generateQuizFromGemini = async ({ sourceType, summary, topic, pdfFile, questionCount, difficulty, cefrLevel }) => {
    const parts = [
        {
            text: buildQuizPrompt({ sourceType, summary, topic, questionCount, difficulty, cefrLevel })
        }
    ]

    if (pdfFile) {
        parts.push({
            inline_data: {
                mime_type: 'application/pdf',
                data: pdfFile.buffer.toString('base64')
            }
        })
    }

    const data = await requestGemini({
        schema: QUIZ_SCHEMA,
        parts,
        temperature: 0.5
    })

    const detectedLevel = parseCefrLevel(data.cefr_level)

    if (!validateQuestionShape(data.questions)) {
        throw new Error('Gemini returned invalid questions data.')
    }

    return {
        cefrLevel: sourceType === 'pdf' && cefrLevel ? cefrLevel : detectedLevel,
        questions: data.questions
    }
}

app.get('/api/health', (_req, res) => {
    res.json({ ok: true })
})

app.post('/api/classify-level', upload.single('pdf'), async (req, res) => {
    if (!GEMINI_API_KEY) {
        return res.status(500).json({
            error: 'Server is missing GEMINI_API_KEY in environment variables.'
        })
    }

    const summary = String(req.body?.summary || '')
    const pdfFile = req.file

    if (pdfFile && pdfFile.mimetype !== 'application/pdf') {
        return res.status(400).json({ error: 'Uploaded file must be a PDF.' })
    }

    if (!summary.trim() && !pdfFile) {
        return res.status(400).json({ error: 'Please provide either a PDF file or a text summary for classification.' })
    }

    try {
        const result = await classifyLevelFromGemini({ summary, pdfFile })

        return res.json({
            cefrLevel: result.cefrLevel,
            documentName: pdfFile?.originalname || 'summary-input',
            classificationRecord: {
                documentName: pdfFile?.originalname || 'summary-input',
                cefrLevel: result.cefrLevel
            }
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: error?.message || 'Failed to classify CEFR level.' })
    }
})

app.post('/api/generate-quiz', upload.single('pdf'), async (req, res) => {
    if (!GEMINI_API_KEY) {
        return res.status(500).json({
            error: 'Server is missing GEMINI_API_KEY in environment variables.'
        })
    }

    const sourceType = String(req.body?.sourceType || 'pdf').trim().toLowerCase()
    const summary = String(req.body?.summary || '')
    const topic = String(req.body?.topic || '')
    const questionCount = Math.min(Math.max(Number(req.body?.questionCount || 5), 3), 15)
    const difficulty = normalizeDifficulty(req.body?.difficulty)
    const cefrLevel = String(req.body?.cefrLevel || '').trim().toUpperCase()
    const pdfFile = req.file

    if (!['pdf', 'topic'].includes(sourceType)) {
        return res.status(400).json({ error: 'Invalid sourceType. Use "pdf" or "topic".' })
    }

    if (pdfFile && pdfFile.mimetype !== 'application/pdf') {
        return res.status(400).json({ error: 'Uploaded file must be a PDF.' })
    }

    if (sourceType === 'pdf' && !summary.trim() && !pdfFile) {
        return res.status(400).json({ error: 'Please provide either a PDF file or a text summary.' })
    }

    if (sourceType === 'pdf' && !VALID_LEVELS.includes(cefrLevel)) {
        return res.status(400).json({ error: 'Missing or invalid CEFR level for PDF quiz generation.' })
    }

    if (sourceType === 'topic' && !topic.trim()) {
        return res.status(400).json({ error: 'Please provide a topic.' })
    }

    try {
        const result = await generateQuizFromGemini({
            sourceType,
            summary,
            topic,
            pdfFile,
            questionCount,
            difficulty,
            cefrLevel
        })

        return res.json(result)
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: error?.message || 'Failed to generate quiz.' })
    }
})

app.listen(PORT, () => {
    console.log(`Quiz API server running on http://localhost:${PORT}`)
})
