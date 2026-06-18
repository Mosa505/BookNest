import { useState, useEffect, useMemo } from 'react'
import Button from '../ui/Button'

export default function Quiz({ questions, onRestart, onExit }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState([])
  const [submittedQuestions, setSubmittedQuestions] = useState([])
  const [quizSubmitted, setQuizSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [attempts, setAttempts] = useState([])

  const currentQuestion = questions[currentIndex] || null
  const isFirstQuestion = currentIndex === 0
  const isLastQuestion = currentIndex === questions.length - 1
  const currentSelectedOption = selectedAnswers[currentIndex] || ''
  const currentSubmitted = Boolean(submittedQuestions[currentIndex])
  const allAnswered = useMemo(
    () => questions.length > 0 && selectedAnswers.filter(Boolean).length === questions.length,
    [questions, selectedAnswers],
  )

  useEffect(() => {
    setCurrentIndex(0)
    setSelectedAnswers([])
    setSubmittedQuestions([])
    setQuizSubmitted(false)
    setScore(0)
    setAttempts([])
  }, [questions])

  function selectOption(option) {
    if (quizSubmitted || currentSubmitted) return
    const next = [...selectedAnswers]
    next[currentIndex] = option
    setSelectedAnswers(next)
  }

  function submitQuestion() {
    if (!currentSelectedOption || currentSubmitted || quizSubmitted) return
    const next = [...submittedQuestions]
    next[currentIndex] = true
    setSubmittedQuestions(next)
  }

  function moveBack() {
    if (isFirstQuestion) return
    setCurrentIndex((prev) => prev - 1)
  }

  function moveNext() {
    if (isLastQuestion || !currentSelectedOption) return
    setCurrentIndex((prev) => prev + 1)
  }

  function submitAll() {
    if (!allAnswered || quizSubmitted) return
    const nextAttempts = questions.map((question, index) => {
      const selected = selectedAnswers[index] || ''
      const correct = question.correct_answer
      return {
        question: question.question,
        selected,
        correct,
        explanation: question.explanation,
        isCorrect: selected === correct,
      }
    })
    setAttempts(nextAttempts)
    setScore(nextAttempts.filter((a) => a.isCorrect).length)
    setQuizSubmitted(true)
  }

  if (!questions.length) return null

  if (quizSubmitted) {
    return (
      <div className="max-w-xl mx-auto">
        <div className="bg-white rounded-xl border border-brand-200 shadow-card p-8 text-center">
          <h2 className="text-2xl font-bold font-heading text-brand-900">Quiz Finished</h2>
          <p className="text-lg text-brand-600 mt-2">
            You scored <strong className="text-brand-500 text-2xl">{score} / {questions.length}</strong>
          </p>

          <ul className="mt-6 space-y-4 text-left">
            {attempts.map((attempt, idx) => (
              <li
                key={idx}
                className={`p-4 rounded-lg border-2 ${
                  attempt.isCorrect ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'
                }`}
              >
                <p className="font-medium text-brand-900 mb-2">
                  Q{idx + 1}: {attempt.question}
                </p>
                <p className="text-sm text-brand-600">Your answer: {attempt.selected}</p>
                {!attempt.isCorrect && (
                  <p className="text-sm text-green-700 font-medium mt-1">
                    Correct answer: {attempt.correct}
                  </p>
                )}
                <p className="text-sm text-amber-800 bg-amber-50 border-l-4 border-amber-400 pl-3 py-1 mt-2 rounded">
                  {attempt.explanation}
                </p>
              </li>
            ))}
          </ul>

          <Button onClick={onRestart} className="mt-6">
            Create Another Quiz
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto">
      <div className="bg-white rounded-xl border border-brand-200 shadow-card p-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold font-heading text-brand-900">
            Question {currentIndex + 1} / {questions.length}
          </h2>
          <button
            onClick={onExit}
            className="px-3 py-1.5 text-xs font-medium text-white bg-red-500 hover:bg-red-600 rounded-md transition-colors"
          >
            Exit
          </button>
        </div>

        <div className="w-full h-2 bg-brand-100 rounded-full mb-6 overflow-hidden">
          <div
            className="h-full bg-brand-500 rounded-full transition-all"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>

        {currentQuestion && (
          <>
            <h3 className="text-xl font-medium text-brand-900 mb-6">{currentQuestion.question}</h3>

            <div className="space-y-3 mb-6">
              {currentQuestion.options.map((option, optIdx) => {
                let optionStyle = 'border-brand-200 hover:border-brand-300 hover:bg-brand-50'
                if (currentSubmitted) {
                  if (option === currentQuestion.correct_answer) {
                    optionStyle = 'border-green-400 bg-green-50'
                  } else if (option === currentSelectedOption && option !== currentQuestion.correct_answer) {
                    optionStyle = 'border-red-400 bg-red-50'
                  }
                } else if (option === currentSelectedOption) {
                  optionStyle = 'border-brand-500 bg-brand-50'
                }
                return (
                  <button
                    key={optIdx}
                    onClick={() => selectOption(option)}
                    disabled={quizSubmitted || currentSubmitted}
                    className={`w-full text-left px-4 py-3 rounded-lg border transition-all ${optionStyle}`}
                  >
                    {option}
                  </button>
                )
              })}
            </div>

            {currentSubmitted && (
              <div className="bg-amber-50 border-l-4 border-amber-400 rounded-lg p-4 mb-6">
                <h4 className="text-sm font-semibold text-amber-800 mb-1">Explanation</h4>
                <p className="text-sm text-amber-900">{currentQuestion.explanation}</p>
              </div>
            )}
          </>
        )}

        <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
          <Button variant="secondary" disabled={isFirstQuestion} onClick={moveBack}>
            Back
          </Button>
          <Button disabled={!currentSelectedOption || currentSubmitted} onClick={submitQuestion}>
            Submit
          </Button>
          <Button variant="secondary" disabled={!currentSelectedOption || isLastQuestion} onClick={moveNext}>
            Next
          </Button>
        </div>

        <Button
          onClick={submitAll}
          disabled={!allAnswered}
          className="w-full mt-3 max-w-md mx-auto block"
        >
          Submit All Answers
        </Button>
      </div>
    </div>
  )
}
