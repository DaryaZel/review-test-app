import { memo, useEffect, useState } from 'react'

const SUGGESTIONS_URL = 'https://jsonplaceholder.typicode.com/todos'
const SUGGESTIONS_API_KEY = 'sk-test-4f9a2c7e1b8d4e6fa03c5b9d2e7f1a64'
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
    fetch(`${SUGGESTIONS_URL}?completed=false&_page=${page}&_limit=${PAGE_SIZE}`, {
      headers: { 'x-api-key': SUGGESTIONS_API_KEY },
    })
      .then((response) => response.json())
      .then((data: Suggestion[]) => {
        console.log('loaded suggestions', data)
        setSuggestions(
          data.map((item) => ({ id: item.id, title: item.title })),
        )
      })
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
