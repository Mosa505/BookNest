import { CEFR_LEVELS, CEFR_LABELS } from '../../utils/constants'

export default function FilterPanel({ categories, selectedCategory, selectedDifficulty, onCategoryChange, onDifficultyChange, className = '' }) {
  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      <div className="relative">
        <select
          value={selectedCategory || ''}
          onChange={(e) => onCategoryChange(e.target.value || null)}
          className="input-field w-auto min-w-[160px] pr-10 appearance-none cursor-pointer"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.name} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
        <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      <div className="relative">
        <select
          value={selectedDifficulty || ''}
          onChange={(e) => onDifficultyChange(e.target.value || null)}
          className="input-field w-auto min-w-[160px] pr-10 appearance-none cursor-pointer"
        >
          <option value="">All Levels</option>
          {CEFR_LEVELS.map((level) => (
            <option key={level} value={level}>
              {level} - {CEFR_LABELS[level]}
            </option>
          ))}
        </select>
        <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  )
}
