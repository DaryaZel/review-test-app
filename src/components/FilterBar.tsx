import type { Filter } from '../types'

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
]

interface FilterBarProps {
  filter: Filter
  activeCount: number
  onChange: (filter: Filter) => void
}

export function FilterBar({ filter, activeCount, onChange }: FilterBarProps) {
  return (
    <div className="filter-bar">
      <span className="task-count">
        {activeCount} {activeCount === 1 ? 'task' : 'tasks'} left
      </span>
      <div className="filters" role="group" aria-label="Filter tasks">
        {FILTERS.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            className={filter === value ? 'active' : undefined}
            aria-pressed={filter === value}
            onClick={() => onChange(value)}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}
