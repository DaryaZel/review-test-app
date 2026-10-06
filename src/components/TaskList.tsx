import type { Task } from '../types'
import { TaskItem } from './TaskItem'

interface TaskListProps {
  tasks: Task[]
  query: string
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

export function TaskList({ tasks, query, onToggle, onDelete }: TaskListProps) {
  const searchTerms = query.trim().toLowerCase().split(/\s+/).filter(Boolean)

  const visibleTasks = tasks
    .filter((task) => {
      const title = task.title.toLowerCase()
      return searchTerms.every((term) => title.includes(term))
    })
    .sort(
      (a, b) =>
        Number(a.completed) - Number(b.completed) || b.createdAt - a.createdAt,
    )

  if (visibleTasks.length === 0) {
    return (
      <p className="empty-state">
        {searchTerms.length > 0
          ? `No tasks match "${query.trim()}".`
          : 'No tasks to show.'}
      </p>
    )
  }

  return (
    <ul className="task-list">
      {visibleTasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          query={query.trim()}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </ul>
  )
}
