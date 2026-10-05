import { useState, type FormEvent } from 'react'

interface TaskFormProps {
  onAdd: (title: string) => void
}

export function TaskForm({ onAdd }: TaskFormProps) {
  const [title, setTitle] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!title.trim()) return
    onAdd(title)
    setTitle('')
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <label htmlFor="new-task" className="visually-hidden">
        New task
      </label>
      <input
        id="new-task"
        type="text"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="What needs to be done?"
        autoComplete="off"
      />
      <button type="submit" disabled={!title.trim()}>
        Add
      </button>
    </form>
  )
}
