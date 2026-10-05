import { memo } from 'react'
import type { Task } from '../types'

interface TaskItemProps {
  task: Task
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

export const TaskItem = memo(function TaskItem({
  task,
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
        {task.title}
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
