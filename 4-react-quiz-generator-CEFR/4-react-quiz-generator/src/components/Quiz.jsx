import { useEffect, useMemo, useState } from 'react'

export default function Quiz({ questions, onRestart, onExit }) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [selectedAnswers, setSelectedAnswers] = useState([])
    const [submittedQuestions, setSubmittedQuestions] = useState([])
    const [quizSubmitted, setQuizSubmitted] = useState(false)
    const [score, setScore] = useState(0)
    const [attempts, setAttempts] = useState([])

    const currentQuestion = questions[currentQuestionIndex] || null
    const isFirstQuestion = currentQuestionIndex === 0
    const isLastQuestion = currentQuestionIndex === questions.length - 1
    const currentSelectedOption = selectedAnswers[currentQuestionIndex] || ''
    const currentSubmitted = Boolean(submittedQuestions[currentQuestionIndex])
    const allAnswered = useMemo(
        () => questions.length > 0 && selectedAnswers.filter(Boolean).length === questions.length,
        [questions, selectedAnswers]
    )

    useEffect(() => {
        setCurrentQuestionIndex(0)
        setSelectedAnswers([])
        setSubmittedQuestions([])
        setQuizSubmitted(false)
        setScore(0)
        setAttempts([])
    }, [questions])

    const selectOption = (option) => {
        if (quizSubmitted || currentSubmitted) {
            return
        }

        const next = [...selectedAnswers]
        next[currentQuestionIndex] = option
        setSelectedAnswers(next)
    }

    const submitQuestion = () => {
        if (!currentSelectedOption || currentSubmitted || quizSubmitted) {
            return
        }

        const next = [...submittedQuestions]
        next[currentQuestionIndex] = true
        setSubmittedQuestions(next)
    }

    const moveBack = () => {
        if (isFirstQuestion) {
            return
        }
        setCurrentQuestionIndex((prev) => prev - 1)
    }

    const moveNext = () => {
        if (isLastQuestion || !currentSelectedOption) {
            return
        }
        setCurrentQuestionIndex((prev) => prev + 1)
    }

    const submitAll = () => {
        if (!allAnswered || quizSubmitted) {
            return
        }

        const nextAttempts = questions.map((question, index) => {
            const selected = selectedAnswers[index] || ''
            const correct = question.correct_answer
            const isCorrect = selected === correct
            return {
                question: question.question,
                selected,
                correct,
                explanation: question.explanation,
                isCorrect
            }
        })

        setAttempts(nextAttempts)
        setScore(nextAttempts.filter((attempt) => attempt.isCorrect).length)
        setQuizSubmitted(true)
    }

    if (!questions.length) {
        return null
    }

    return (
        <section className="quiz container">
            {!quizSubmitted ? (
                <div className="quiz-card">
                    <div className="header">
                        <h2>Question {currentQuestionIndex + 1} / {questions.length}</h2>
                        <button className="exit-btn" onClick={onExit} title="Exit and return to start">X Exit</button>
                    </div>

                    <progress value={currentQuestionIndex + 1} max={questions.length} />

                    {currentQuestion ? (
                        <>
                            <div className="question">
                                <h3>{currentQuestion.question}</h3>
                            </div>

                            <div className="answers">
                                {currentQuestion.options.map((option, optionIndex) => (
                                    <button
                                        key={`${currentQuestionIndex}-${optionIndex}`}
                                        className={`answer ${currentSelectedOption === option ? 'active' : ''
                                            } ${currentSubmitted && option === currentQuestion.correct_answer ? 'correct' : ''
                                            } ${currentSubmitted && option === currentSelectedOption && option !== currentQuestion.correct_answer
                                                ? 'incorrect'
                                                : ''
                                            }`}
                                        disabled={quizSubmitted || currentSubmitted}
                                        onClick={() => selectOption(option)}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>

                            {currentSubmitted ? (
                                <div className="explanation-panel">
                                    <h4>Explanation</h4>
                                    <p>{currentQuestion.explanation}</p>
                                </div>
                            ) : null}
                        </>
                    ) : null}

                    <div className="actions-row">
                        <button className="secondary-btn" disabled={isFirstQuestion} onClick={moveBack}>Back</button>
                        <button disabled={!currentSelectedOption || currentSubmitted} onClick={submitQuestion}>Submit Question</button>
                        <button disabled={!currentSelectedOption || isLastQuestion} onClick={moveNext}>Next</button>
                    </div>

                    <button className="submit-all-btn" disabled={!allAnswered} onClick={submitAll}>Submit All Answers</button>
                </div>
            ) : (
                <div className="result-screen">
                    <h2>Quiz Finished</h2>
                    <p className="score-display">You scored <strong>{score} / {questions.length}</strong></p>

                    <ul>
                        {attempts.map((attempt, index) => (
                            <li key={index} className={attempt.isCorrect ? 'correct' : 'incorrect'}>
                                <b>Q{index + 1}: {attempt.question}</b>
                                <p>Your answer: {attempt.selected}</p>
                                <p className="correct-answer"><strong>Correct answer: {attempt.correct}</strong></p>
                                <p className="explanation-box"><strong>{attempt.explanation}</strong></p>
                            </li>
                        ))}
                    </ul>

                    <button onClick={onRestart}>Create Another Quiz</button>
                </div>
            )}
        </section>
    )
}
