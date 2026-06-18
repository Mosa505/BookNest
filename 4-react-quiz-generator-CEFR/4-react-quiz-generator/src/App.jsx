import { useState } from 'react'
import StartScreen from './components/StartScreen'
import Quiz from './components/Quiz'
import Loader from './components/Loader'

export default function App() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [questions, setQuestions] = useState([])
    const [cefrLevel, setCefrLevel] = useState('')
    const [analyzedSource, setAnalyzedSource] = useState(null)

    const generateQuiz = async ({ sourceType, summary, pdfFile, topic, questionCount, difficulty, cefrLevel: passedCefrLevel }) => {
        setLoading(true)
        setError('')
        setQuestions([])

        if (sourceType === 'topic') {
            setCefrLevel('')
        }

        const formData = new FormData()
        formData.append('sourceType', sourceType || 'pdf')

        if (summary?.trim()) {
            formData.append('summary', summary.trim())
        }

        if (pdfFile) {
            formData.append('pdf', pdfFile)
        }

        if (topic?.trim()) {
            formData.append('topic', topic.trim())
        }

        formData.append('questionCount', String(questionCount || 5))
        if (difficulty) {
            formData.append('difficulty', difficulty)
        }
        if (passedCefrLevel) {
            formData.append('cefrLevel', passedCefrLevel)
        }

        try {
            const response = await fetch('/api/generate-quiz', {
                method: 'POST',
                body: formData
            })

            const data = await response.json().catch(() => ({}))

            if (!response.ok) {
                throw new Error(data?.error || 'Failed to generate quiz.')
            }

            setQuestions(data.questions || [])
            setCefrLevel(data.cefrLevel || '')
        } catch (requestError) {
            const message = requestError?.message || String(requestError)
            if (message.includes('Failed to fetch')) {
                setError('Cannot reach API server. Start both frontend and backend using "npm run dev:full" and make sure port 8787 is available.')
            } else {
                setError(message)
            }
        } finally {
            setLoading(false)
        }
    }

    const analyzeLevel = async ({ summary, pdfFile, questionCount, difficulty }) => {
        setLoading(true)
        setError('')
        setQuestions([])
        setCefrLevel('')
        setAnalyzedSource(null)

        const formData = new FormData()

        if (summary?.trim()) {
            formData.append('summary', summary.trim())
        }

        if (pdfFile) {
            formData.append('pdf', pdfFile)
        }

        try {
            const response = await fetch('/api/classify-level', {
                method: 'POST',
                body: formData
            })

            const data = await response.json().catch(() => ({}))

            if (!response.ok) {
                throw new Error(data?.error || 'Failed to classify level.')
            }

            setCefrLevel(data.cefrLevel || '')
            setAnalyzedSource({
                sourceType: 'pdf',
                summary: summary || '',
                pdfFile: pdfFile || null,
                topic: '',
                questionCount: Number(questionCount || 5),
                difficulty: difficulty || 'medium',
                cefrLevel: data.cefrLevel || '',
                documentName: data.documentName || pdfFile?.name || 'summary-input',
                classificationRecord: data.classificationRecord || {
                    documentName: data.documentName || pdfFile?.name || 'summary-input',
                    cefrLevel: data.cefrLevel || ''
                }
            })
        } catch (requestError) {
            const message = requestError?.message || String(requestError)
            if (message.includes('Failed to fetch')) {
                setError('Cannot reach API server. Start both frontend and backend using "npm run dev:full" and make sure port 8787 is available.')
            } else {
                setError(message)
            }
        } finally {
            setLoading(false)
        }
    }

    const generateQuizFromAnalyzedSource = (selectedDifficulty) => {
        if (!analyzedSource) {
            return
        }

        const classifiedLevel = analyzedSource.cefrLevel || cefrLevel

        generateQuiz({
            ...analyzedSource,
            difficulty: selectedDifficulty || 'medium',
            cefrLevel: classifiedLevel
        })
    }

    const clearAnalysis = () => {
        setAnalyzedSource(null)
        setCefrLevel('')
        setError('')
    }

    const resetQuiz = () => {
        setQuestions([])
        setCefrLevel('')
        setError('')
        setAnalyzedSource(null)
    }

    return (
        <div id="app">
            <header>
                <div className="container">
                    <h1>Book Q&A MCQ Platform (React)</h1>
                    <p>Create CEFR-aligned quizzes from PDF books or summaries.</p>
                </div>
            </header>

            <main>
                {!loading && !questions.length && !analyzedSource ? (
                    <StartScreen onStartQuiz={generateQuiz} onAnalyzeLevel={analyzeLevel} />
                ) : null}

                {loading ? <Loader /> : null}

                {error ? <p className="error container">{error}</p> : null}

                {analyzedSource && !questions.length ? (
                    <section className="container cefr-box">
                        <h2>Language Classification Result</h2>
                        <p className="source-name">Source: {analyzedSource.documentName}</p>
                        <p className="level-only">{cefrLevel}</p>
                        <p className="record-title">Ready for database save:</p>
                        <pre className="record-json">{JSON.stringify(analyzedSource.classificationRecord, null, 2)}</pre>
                        <label htmlFor="difficulty-select" className="difficulty-label">Choose Quiz Difficulty ({cefrLevel}):</label>
                        <select
                            id="difficulty-select"
                            value={analyzedSource.difficulty}
                            onChange={(e) => setAnalyzedSource({ ...analyzedSource, difficulty: e.target.value })}
                            className="difficulty-select"
                        >
                            <option value="easy">Easy - Basic concepts from {cefrLevel} material</option>
                            <option value="medium">Medium - Balanced concepts from {cefrLevel} material</option>
                            <option value="hard">Hard - Advanced concepts from {cefrLevel} material</option>
                        </select>
                        <div className="action-row">
                            <button onClick={() => generateQuizFromAnalyzedSource(analyzedSource.difficulty)}>Generate Quiz From This Source</button>
                            <button className="secondary-btn" onClick={clearAnalysis}>Analyze Another File</button>
                        </div>
                    </section>
                ) : null}

                {questions.length ? <Quiz questions={questions} onRestart={resetQuiz} onExit={resetQuiz} /> : null}
            </main>
        </div>
    )
}
