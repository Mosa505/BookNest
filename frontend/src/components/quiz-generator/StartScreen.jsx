import { useState } from 'react'
import Button from '../ui/Button'
import Textarea from '../ui/Textarea'

export default function StartScreen({ onStartQuiz, onAnalyzeLevel }) {
  const [sourceType, setSourceType] = useState('pdf')
  const [summary, setSummary] = useState('')
  const [file, setFile] = useState(null)
  const [topic, setTopic] = useState('')
  const [questionCount, setQuestionCount] = useState(5)
  const [difficulty, setDifficulty] = useState('medium')
  const [localError, setLocalError] = useState('')

  const canSubmit = sourceType === 'pdf'
    ? Boolean(file || summary.trim())
    : topic.trim().length > 0

  const submitLabel = sourceType === 'pdf' ? 'Analyze Language Level' : 'Generate Quiz'

  function handleSourceType(nextType) {
    setSourceType(nextType)
    setLocalError('')
  }

  function onFileChange(event) {
    const selected = event.target.files?.[0]
    setLocalError('')
    if (!selected) {
      setFile(null)
      return
    }
    if (selected.type !== 'application/pdf') {
      setLocalError('Please upload a PDF file only.')
      setFile(null)
      event.target.value = ''
      return
    }
    setFile(selected)
  }

  function submit() {
    if (!canSubmit) {
      setLocalError(sourceType === 'pdf' ? 'Upload a PDF or add a summary.' : 'Please enter a topic first.')
      return
    }
    const payload = { sourceType, summary, pdfFile: file, topic, questionCount: Number(questionCount), difficulty }
    if (sourceType === 'pdf') {
      onAnalyzeLevel(payload)
    } else {
      onStartQuiz(payload)
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      <div className="bg-white rounded-xl border border-brand-200 shadow-card p-8">
        <h2 className="text-xl font-bold font-heading text-brand-900 text-center">Build Questions From PDF Or Topic</h2>
        <p className="text-brand-500 text-center mt-1 mb-6">Choose a source, then generate CEFR-aware MCQs.</p>

        <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto mb-6">
          <button
            type="button"
            onClick={() => handleSourceType('pdf')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              sourceType === 'pdf'
                ? 'bg-brand-500 text-white shadow-sm'
                : 'bg-brand-50 text-brand-700 border border-brand-200 hover:bg-brand-100'
            }`}
          >
            PDF / Summary
          </button>
          <button
            type="button"
            onClick={() => handleSourceType('topic')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              sourceType === 'topic'
                ? 'bg-brand-500 text-white shadow-sm'
                : 'bg-brand-50 text-brand-700 border border-brand-200 hover:bg-brand-100'
            }`}
          >
            Topic
          </button>
        </div>

        {sourceType === 'pdf' ? (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-brand-700 mb-1">Book PDF (optional)</label>
              <input
                type="file"
                accept="application/pdf"
                onChange={onFileChange}
                className="block w-full text-sm text-brand-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-brand-700 mb-1">Book Summary (optional)</label>
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                rows={5}
                placeholder="Paste the book summary here..."
                className="w-full rounded-lg border border-brand-200 px-3 py-2 text-sm text-brand-900 placeholder-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-y"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-brand-700 mb-1">Quiz Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full rounded-lg border border-brand-200 px-3 py-2 text-sm text-brand-900 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="easy">Easy (More basic questions)</option>
                <option value="medium">Medium (Balanced questions)</option>
                <option value="hard">Hard (Advanced questions)</option>
              </select>
            </div>
          </>
        ) : (
          <div className="mb-4">
            <label className="block text-sm font-medium text-brand-700 mb-1">Topic</label>
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              type="text"
              placeholder="Examples: computer science, fitness, world history"
              className="w-full rounded-lg border border-brand-200 px-3 py-2 text-sm text-brand-900 placeholder-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        )}

        <div className="mb-6">
          <label className="block text-sm font-medium text-brand-700 mb-1">Number of questions</label>
          <input
            value={questionCount}
            onChange={(e) => setQuestionCount(e.target.value)}
            type="number"
            min={3}
            max={15}
            className="w-full rounded-lg border border-brand-200 px-3 py-2 text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        {localError && <p className="text-sm text-red-600 mb-4">{localError}</p>}

        <Button onClick={submit} disabled={!canSubmit} className="w-full">
          {submitLabel}
        </Button>
      </div>
    </div>
  )
}
