import { useState } from 'react'
import Button from '../ui/Button'
import ProgressBar from '../ui/ProgressBar'
import Spinner from '../ui/Spinner'

export default function QuizComponent({ questions, onSubmit, bookTitle, submitting }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [showResult, setShowResult] = useState(false)

  const current = questions[currentIndex]
  const progress = ((currentIndex + 1) / questions.length) * 100

  function handleSelect(answer) {
    if (submitting) return
    setAnswers((prev) => ({ ...prev, [currentIndex]: answer }))
  }

  function handleNext() {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      handleSubmit()
    }
  }

  function handlePrev() {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  function handleSubmit() {
    const formattedAnswers = questions.map((q, i) => ({
      question: q.question,
      selected_answer: answers[i] || '',
      correct_answer: q.correct_answer,
      is_correct: answers[i] === q.correct_answer,
    }))

    const score = formattedAnswers.filter((a) => a.is_correct).length
    const percentage = (score / questions.length) * 100

    onSubmit(questions.length, formattedAnswers, percentage)
    setShowResult(true)
  }

  if (showResult && !submitting) return null

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold font-heading text-brand-900">
            Quiz: {bookTitle}
          </h2>
          <span className="text-sm text-brand-500">
            {currentIndex + 1} / {questions.length}
          </span>
        </div>
        <ProgressBar value={progress} max={100} showLabel />
      </div>

      <div className="bg-white rounded-xl border border-brand-200 shadow-card p-6 relative">
        {submitting && (
          <div className="absolute inset-0 bg-white/80 rounded-xl flex flex-col items-center justify-center z-10">
            <Spinner size="lg" />
            <p className="mt-3 text-sm text-brand-600 font-medium">Submitting your answers...</p>
          </div>
        )}

        <p className="text-lg font-medium text-brand-900 mb-6">{current.question}</p>

        <div className="space-y-3 mb-8">
          {current.options.map((option, idx) => {
            const isSelected = answers[currentIndex] === option
            const letter = String.fromCharCode(65 + idx)
            return (
              <button
                key={idx}
                onClick={() => handleSelect(option)}
                disabled={submitting}
                className={`w-full text-left px-4 py-3 rounded-lg border transition-all ${
                  isSelected
                    ? 'border-brand-500 bg-brand-50 text-brand-900'
                    : 'border-brand-200 hover:border-brand-300 hover:bg-brand-50 text-brand-700'
                }`}
              >
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-brand-100 text-xs font-medium text-brand-600 mr-3">
                  {letter}
                </span>
                {option}
              </button>
            )
          })}
        </div>

        <div className="flex items-center justify-between">
          <Button
            variant="secondary"
            onClick={handlePrev}
            disabled={currentIndex === 0 || submitting}
          >
            Previous
          </Button>
          <Button
            onClick={handleNext}
            disabled={!answers[currentIndex] || submitting}
            loading={submitting && currentIndex === questions.length - 1}
          >
            {currentIndex === questions.length - 1 ? 'Submit Quiz' : 'Next'}
          </Button>
        </div>
      </div>
    </div>
  )
}
