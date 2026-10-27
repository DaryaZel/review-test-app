import { memo, useEffect, useState } from 'react'

const SUGGESTIONS_URL = 'https://jsonplaceholder.typicode.com/todos'
const PAGE_SIZE = 10

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
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    setFailed(false)

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
        if (controller.signal.aborted) return
        setSuggestions([])
        setFailed(true)
      })

    return () => controller.abort()
  }, [page])

  const handleAdd = (suggestion: Suggestion) => {
    onAdd(suggestion.title)
    setSuggestions((prev) => prev.filter((item) => item.id !== suggestion.id))
  }

  return (
    <section className="suggestions">
      <div className="filter-bar">
        <h2>Suggested tasks</h2>
        <button type="button" onClick={() => setPage((current) => current + 1)}>
          More ideas
        </button>
      </div>
      {failed && <p>Could not load suggestions. Try again.</p>}
      <ul className="task-list">
        {suggestions.map((suggestion) => (
          <li key={suggestion.id} className="task-item">
            <button
              type="button"
              className="task-title suggestion-button"
              onClick={() => handleAdd(suggestion)}
            >
              + {suggestion.title}
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
})
