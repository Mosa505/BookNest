export default function Loader() {
  return (
    <div className="flex flex-col items-center justify-center py-16" role="status" aria-live="polite">
      <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-500 rounded-full animate-spin" />
      <p className="mt-4 text-brand-600 text-sm">Analyzing source and generating quiz...</p>
    </div>
  )
}
