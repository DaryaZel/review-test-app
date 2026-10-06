import { useState } from 'react'
import { FilterBar } from './components/FilterBar'
import { SuggestedTasks } from './components/SuggestedTasks'
import { TaskForm } from './components/TaskForm'
import { TaskList } from './components/TaskList'
import { useTasks } from './hooks/useTasks'

function App() {
  const [query, setQuery] = useState('')
  const {
    filteredTasks,
    filter,
    setFilter,
    addTask,
    toggleTask,
    deleteTask,
    activeCount,
  } = useTasks()

  return (
    <main className="app">
      <h1>Tasks</h1>
      <TaskForm onAdd={addTask} />
      <input
        type="search"
        className="search-input"
        placeholder="Search tasks..."
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <FilterBar filter={filter} activeCount={activeCount} onChange={setFilter} />
      <TaskList
        tasks={filteredTasks}
        query={query}
        onToggle={toggleTask}
        onDelete={deleteTask}
      />
      <SuggestedTasks onAdd={(title) => addTask(title)} />
    </main>
  )
}

export default App
