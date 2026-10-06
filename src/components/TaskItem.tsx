import { memo } from 'react'
import type { Task } from '../types'

interface TaskItemProps {
  task: Task
  query?: string
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

function highlightMatches(text: string, query: string) {
  const terms = query.split(/\s+/).filter(Boolean)
  if (terms.length === 0) return text

  const escaped = terms.map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  const parts = text.split(new RegExp(`(${escaped.join('|')})`, 'gi'))
  return parts.map((part, index) =>
    index % 2 === 1 ? <mark key={index}>{part}</mark> : part,
  )
}

export const TaskItem = memo(function TaskItem({
  task,
  query = '',
  onToggle,
  onDelete,
}: TaskItemProps) {
  const checkboxId = `task-${task.id}`

  return (
    <li className={`task-item${task.completed ? ' completed' : ''}`}>
      <input
        id={checkboxId}
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task.id)}
      />
      <label htmlFor={checkboxId} className="task-title">
        {highlightMatches(task.title, query)}
      </label>
      <button
        type="button"
        className="delete-button"
        onClick={() => onDelete(task.id)}
        aria-label={`Delete "${task.title}"`}
      >
        ×
      </button>
    </li>
  )
})
