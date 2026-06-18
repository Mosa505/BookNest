import { useState } from 'react'
import { readerService } from '../../services/reader.service'
import { useToast } from '../../hooks/useToast'
import Button from '../../components/ui/Button'
import StartScreen from '../../components/quiz-generator/StartScreen'
import Quiz from '../../components/quiz-generator/Quiz'
import Loader from '../../components/quiz-generator/Loader'

export default function QuizGeneratorPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [questions, setQuestions] = useState([])
  const [cefrLevel, setCefrLevel] = useState('')
  const [analyzedSource, setAnalyzedSource] = useState(null)
  const { error: toastError } = useToast()

  async function generateQuiz({ sourceType, summary, pdfFile, topic, questionCount, difficulty, cefrLevel: passedCefrLevel }) {
    setLoading(true)
    setError('')
    setQuestions([])
    if (sourceType === 'topic') setCefrLevel('')

    const formData = new FormData()
    formData.append('sourceType', sourceType || 'pdf')
    if (summary?.trim()) formData.append('summary', summary.trim())
    if (pdfFile) formData.append('pdf', pdfFile)
    if (topic?.trim()) formData.append('topic', topic.trim())
    formData.append('questionCount', String(questionCount || 5))
    if (difficulty) formData.append('difficulty', difficulty)
    if (passedCefrLevel) formData.append('cefrLevel', passedCefrLevel)

    try {
      const data = await readerService.generateQuiz(formData)
      setQuestions(data.questions || [])
      setCefrLevel(data.cefrLevel || '')
    } catch (err) {
      const message = err?.response?.data?.error || err?.message || 'Failed to generate quiz.'
      if (message.includes('Failed to fetch') || message.includes('Network Error')) {
        setError('Cannot reach API server. Make sure the backend server is running.')
      } else {
        setError(message)
      }
    } finally {
      setLoading(false)
    }
  }

  async function analyzeLevel({ summary, pdfFile, questionCount, difficulty }) {
    setLoading(true)
    setError('')
    setQuestions([])
    setCefrLevel('')
    setAnalyzedSource(null)

    try {
      const data = await readerService.classifyLevel(pdfFile, summary)
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
          cefrLevel: data.cefrLevel || '',
        },
      })
    } catch (err) {
      const message = err?.response?.data?.error || err?.message || 'Failed to classify level.'
      if (message.includes('Failed to fetch') || message.includes('Network Error')) {
        setError('Cannot reach API server. Make sure the backend server is running.')
      } else {
        setError(message)
      }
    } finally {
      setLoading(false)
    }
  }

  function generateQuizFromAnalyzedSource(selectedDifficulty) {
    if (!analyzedSource) return
    generateQuiz({
      ...analyzedSource,
      difficulty: selectedDifficulty || 'medium',
      cefrLevel: analyzedSource.cefrLevel || cefrLevel,
    })
  }

  function clearAnalysis() {
    setAnalyzedSource(null)
    setCefrLevel('')
    setError('')
  }

  function resetQuiz() {
    setQuestions([])
    setCefrLevel('')
    setError('')
    setAnalyzedSource(null)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-heading text-brand-900">Quiz Generator</h1>
        <p className="text-brand-500 mt-1">Create CEFR-aligned quizzes from PDF books, summaries, or topics.</p>
      </div>

      {!loading && !questions.length && !analyzedSource && (
        <StartScreen onStartQuiz={generateQuiz} onAnalyzeLevel={analyzeLevel} />
      )}

      {loading && <Loader />}

      {error && (
        <div className="max-w-xl mx-auto">
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-4">{error}</p>
        </div>
      )}

      {analyzedSource && !questions.length && (
        <div className="max-w-xl mx-auto">
          <div className="bg-white rounded-xl border border-brand-200 shadow-card p-8">
            <h2 className="text-xl font-bold font-heading text-brand-900">Language Classification Result</h2>
            <p className="text-brand-500 mt-1">Source: {analyzedSource.documentName}</p>
            <p className="text-4xl font-bold text-brand-500 my-4 tracking-wider">{cefrLevel}</p>
            <p className="text-sm font-medium text-brand-700 mt-4">Ready for database save:</p>
            <pre className="mt-2 p-4 bg-brand-50 border border-brand-200 rounded-lg text-xs text-brand-700 overflow-x-auto">
              {JSON.stringify(analyzedSource.classificationRecord, null, 2)}
            </pre>
            <label className="block text-sm font-semibold text-brand-700 mt-6 mb-2 text-center">
              Choose Quiz Difficulty ({cefrLevel}):
            </label>
            <select
              value={analyzedSource.difficulty}
              onChange={(e) => setAnalyzedSource({ ...analyzedSource, difficulty: e.target.value })}
              className="w-full rounded-lg border-2 border-amber-300 px-3 py-2 text-sm font-semibold text-brand-900 bg-gradient-to-b from-amber-50 to-amber-100/50 focus:outline-none focus:ring-2 focus:ring-amber-400 mb-6"
            >
              <option value="easy">Easy - Basic concepts from {cefrLevel} material</option>
              <option value="medium">Medium - Balanced concepts from {cefrLevel} material</option>
              <option value="hard">Hard - Advanced concepts from {cefrLevel} material</option>
            </select>
            <div className="grid grid-cols-2 gap-3">
              <Button onClick={() => generateQuizFromAnalyzedSource(analyzedSource.difficulty)}>
                Generate Quiz From This Source
              </Button>
              <Button variant="secondary" onClick={clearAnalysis}>
                Analyze Another File
              </Button>
            </div>
          </div>
        </div>
      )}

      {questions.length > 0 && (
        <Quiz questions={questions} onRestart={resetQuiz} onExit={resetQuiz} />
      )}
    </div>
  )
}
