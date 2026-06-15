export default function Loader() {
    return (
        <div className="loader-wrap" role="status" aria-live="polite" aria-label="Loading">
            <div className="loader" />
            <p>Analyzing source and generating quiz...</p>
        </div>
    )
}
