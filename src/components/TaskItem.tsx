import { memo } from 'react'
import type { Task } from '../types'

interface TaskItemProps {
  task: Task
  query?: string
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

function highlightMatches(text: string, query: string) {
  if (!query) return text
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return text.replace(new RegExp(`(${escaped})`, 'gi'), '<mark>$1</mark>')
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
      <label
        htmlFor={checkboxId}
        className="task-title"
        dangerouslySetInnerHTML={{ __html: highlightMatches(task.title, query) }}
      />
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
