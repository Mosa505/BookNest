import { useMemo, useState } from 'react'

export default function StartScreen({ onStartQuiz, onAnalyzeLevel }) {
    const [sourceType, setSourceType] = useState('pdf')
    const [summary, setSummary] = useState('')
    const [file, setFile] = useState(null)
    const [topic, setTopic] = useState('')
    const [questionCount, setQuestionCount] = useState(5)
    const [difficulty, setDifficulty] = useState('medium')
    const [localError, setLocalError] = useState('')

    const canSubmit = useMemo(() => {
        if (sourceType === 'pdf') {
            return Boolean(file || summary.trim())
        }
        return topic.trim().length > 0
    }, [file, sourceType, summary, topic])

    const submitLabel = sourceType === 'pdf' ? 'Analyze Language Level' : 'Generate Quiz'

    const handleSourceType = (nextType) => {
        setSourceType(nextType)
        setLocalError('')
    }

    const onFileChange = (event) => {
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

    const submit = () => {
        if (!canSubmit) {
            setLocalError(sourceType === 'pdf' ? 'Upload a PDF or add a summary.' : 'Please enter a topic first.')
            return
        }

        const payload = {
            sourceType,
            summary,
            pdfFile: file,
            topic,
            questionCount: Number(questionCount),
            difficulty
        }

        if (sourceType === 'pdf') {
            onAnalyzeLevel(payload)
            return
        }

        onStartQuiz(payload)
    }

    return (
        <section className="start-screen container">
            <h2>Build Questions From PDF Or Topic</h2>
            <p className="subtitle">Choose a source, then generate CEFR-aware MCQs.</p>

            <div className="source-switch" role="group" aria-label="Choose quiz source">
                <button
                    type="button"
                    className={`source-btn ${sourceType === 'pdf' ? 'active' : ''}`}
                    onClick={() => handleSourceType('pdf')}
                >
                    PDF / Summary
                </button>
                <button
                    type="button"
                    className={`source-btn ${sourceType === 'topic' ? 'active' : ''}`}
                    onClick={() => handleSourceType('topic')}
                >
                    Topic
                </button>
            </div>

            {sourceType === 'pdf' ? (
                <>
                    <label htmlFor="pdf-input">Book PDF (optional)</label>
                    <input id="pdf-input" type="file" accept="application/pdf" onChange={onFileChange} />

                    <label htmlFor="summary-input">Book Summary (optional)</label>
                    <textarea
                        id="summary-input"
                        value={summary}
                        onChange={(e) => setSummary(e.target.value)}
                        rows={6}
                        placeholder="Paste the book summary here..."
                    />

                    <label htmlFor="difficulty-input">Quiz Difficulty</label>
                    <select id="difficulty-input" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                        <option value="easy">Easy (More basic questions)</option>
                        <option value="medium">Medium (Balanced questions)</option>
                        <option value="hard">Hard (Advanced questions)</option>
                    </select>
                </>
            ) : (
                <>
                    <label htmlFor="topic-input">Topic</label>
                    <input
                        id="topic-input"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        type="text"
                        placeholder="Examples: computer science, fitness, world history"
                    />
                </>
            )}

            <label htmlFor="count-input">Number of questions</label>
            <input
                id="count-input"
                value={questionCount}
                onChange={(e) => setQuestionCount(e.target.value)}
                type="number"
                min={3}
                max={15}
            />

            {localError ? <p className="error">{localError}</p> : null}
            <button onClick={submit} disabled={!canSubmit}>{submitLabel}</button>
        </section>
    )
}
