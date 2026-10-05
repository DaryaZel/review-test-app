import { FilterBar } from './components/FilterBar'
import { TaskForm } from './components/TaskForm'
import { TaskList } from './components/TaskList'
import { useTasks } from './hooks/useTasks'

function App() {
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
      <FilterBar filter={filter} activeCount={activeCount} onChange={setFilter} />
      <TaskList tasks={filteredTasks} onToggle={toggleTask} onDelete={deleteTask} />
    </main>
  )
}

export default App
