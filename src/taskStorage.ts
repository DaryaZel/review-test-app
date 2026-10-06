import type { Task } from './types'

export const STORAGE_KEY = 'review-test-app:tasks'
// Tasks were saved under this key before. It is read as a fallback and left
// in place so older versions of the app still find their data.
export const LEGACY_STORAGE_KEY = 'tasks'

function toCreatedAt(value: unknown): number {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string') {
    const parsed = Date.parse(value)
    if (!Number.isNaN(parsed)) return parsed
  }
  return 0
}

// Fills in missing or older-format fields so saved tasks are kept rather than
// dropped. Only entries without a usable title are skipped.
function normalizeTask(value: unknown): Task | null {
  if (typeof value !== 'object' || value === null) return null
  const task = value as Record<string, unknown>
  if (typeof task.title !== 'string' || !task.title.trim()) return null

  return {
    id:
      typeof task.id === 'string' || typeof task.id === 'number'
        ? String(task.id)
        : crypto.randomUUID(),
    title: task.title,
    completed: task.completed === true,
    createdAt: toCreatedAt(task.createdAt),
  }
}

export function loadTasks(): Task[] {
  try {
    const raw =
      localStorage.getItem(STORAGE_KEY) ??
      localStorage.getItem(LEGACY_STORAGE_KEY)
    const parsed: unknown = raw ? JSON.parse(raw) : []
    if (!Array.isArray(parsed)) return []
    return parsed
      .map(normalizeTask)
      .filter((task): task is Task => task !== null)
  } catch {
    return []
  }
}

export function saveTasks(tasks: Task[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
}
