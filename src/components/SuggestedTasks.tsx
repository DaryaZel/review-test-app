import { memo, useEffect, useState } from 'react'

const SUGGESTIONS_URL = 'https://jsonplaceholder.typicode.com/todos'
const PAGE_SIZE = 5

interface Suggestion {
  id: number
  title: string
}

interface SuggestedTasksProps {
  onAdd: (title: string) => void
}

export const SuggestedTasks = memo(function SuggestedTasks({
  onAdd,
}: SuggestedTasksProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [page, setPage] = useState(1)

  useEffect(() => {
    const controller = new AbortController()

    fetch(`${SUGGESTIONS_URL}?completed=false&_page=${page}&_limit=${PAGE_SIZE}`, {
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        return response.json()
      })
      .then((data: Suggestion[]) => {
        setSuggestions(
          data.map((item) => ({ id: item.id, title: item.title })),
        )
      })
      .catch(() => {
        if (!controller.signal.aborted) setSuggestions([])
      })

    return () => controller.abort()
  }, [page])

  const handleAdd = (index: number) => {
    onAdd(suggestions[index].title)
    setSuggestions((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <section className="suggestions">
      <div className="filter-bar">
        <h2>Suggested tasks</h2>
        <button type="button" onClick={() => setPage((current) => current + 1)}>
          More ideas
        </button>
      </div>
      <ul className="task-list">
        {suggestions.map((suggestion, index) => (
          <li key={suggestion.id} className="task-item">
            <div className="task-title" onClick={() => handleAdd(index)}>
              + {suggestion.title}
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
})
