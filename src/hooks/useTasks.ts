import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { loadTasks, saveTasks } from '../taskStorage'
import type { Filter, Task } from '../types'

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(loadTasks)
  const [filter, setFilter] = useState<Filter>('all')
  const loadedTasks = useRef(tasks)

  useEffect(() => {
    // Leave the stored data untouched until the user changes something.
    if (tasks === loadedTasks.current) return
    saveTasks(tasks)
  }, [tasks])

  const addTask = useCallback((title: string) => {
    const trimmed = title.trim()
    if (!trimmed) return

    const task: Task = {
      id: crypto.randomUUID(),
      title: trimmed,
      completed: false,
      createdAt: Date.now(),
    }
    setTasks((prev) => [task, ...prev])
  }, [])

  const toggleTask = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    )
  }, [])

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id))
  }, [])

  const filteredTasks = useMemo(() => {
    switch (filter) {
      case 'active':
        return tasks.filter((task) => !task.completed)
      case 'completed':
        return tasks.filter((task) => task.completed)
      default:
        return tasks
    }
  }, [tasks, filter])

  const activeCount = useMemo(
    () => tasks.filter((task) => !task.completed).length,
    [tasks],
  )

  return {
    tasks,
    filteredTasks,
    filter,
    setFilter,
    addTask,
    toggleTask,
    deleteTask,
    activeCount,
  }
}
