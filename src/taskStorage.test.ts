import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  LEGACY_STORAGE_KEY,
  STORAGE_KEY,
  loadTasks,
  saveTasks,
} from './taskStorage'
import type { Task } from './types'

function createStorage(): Storage {
  const items = new Map<string, string>()
  return {
    get length() {
      return items.size
    },
    clear: () => items.clear(),
    getItem: (key) => items.get(key) ?? null,
    key: (index) => [...items.keys()][index] ?? null,
    removeItem: (key) => {
      items.delete(key)
    },
    setItem: (key, value) => {
      items.set(key, String(value))
    },
  }
}

const task: Task = {
  id: '1',
  title: 'Buy milk',
  completed: false,
  createdAt: 1700000000000,
}

beforeEach(() => {
  vi.stubGlobal('localStorage', createStorage())
})

describe('loadTasks', () => {
  it('returns an empty list when nothing is stored', () => {
    expect(loadTasks()).toEqual([])
  })

  it('loads tasks from the current key', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([task]))
    expect(loadTasks()).toEqual([task])
  })

  it('falls back to the legacy key', () => {
    localStorage.setItem(LEGACY_STORAGE_KEY, JSON.stringify([task]))
    expect(loadTasks()).toEqual([task])
  })

  it('prefers the current key over the legacy key', () => {
    const newer = { ...task, title: 'Newer' }
    localStorage.setItem(LEGACY_STORAGE_KEY, JSON.stringify([task]))
    localStorage.setItem(STORAGE_KEY, JSON.stringify([newer]))
    expect(loadTasks()).toEqual([newer])
  })

  it('fills in missing or older-format fields', () => {
    localStorage.setItem(
      LEGACY_STORAGE_KEY,
      JSON.stringify([
        { id: 7, title: 'Numeric id', createdAt: '2024-01-01T00:00:00.000Z' },
        { title: 'No id or date', completed: 'yes' },
      ]),
    )

    const [first, second] = loadTasks()
    expect(first).toEqual({
      id: '7',
      title: 'Numeric id',
      completed: false,
      createdAt: Date.parse('2024-01-01T00:00:00.000Z'),
    })
    expect(second).toMatchObject({
      title: 'No id or date',
      completed: false,
      createdAt: 0,
    })
    expect(typeof second.id).toBe('string')
  })

  it('skips entries without a usable title', () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([null, 'text', { id: '2' }, { title: '  ' }, task]),
    )
    expect(loadTasks()).toEqual([task])
  })

  it('returns an empty list for malformed JSON or a non-array value', () => {
    localStorage.setItem(STORAGE_KEY, '{not json')
    expect(loadTasks()).toEqual([])

    localStorage.setItem(STORAGE_KEY, JSON.stringify({ tasks: [task] }))
    expect(loadTasks()).toEqual([])
  })
})

describe('saveTasks', () => {
  it('writes to the current key and keeps the legacy key', () => {
    localStorage.setItem(LEGACY_STORAGE_KEY, JSON.stringify([task]))
    saveTasks([])

    expect(localStorage.getItem(STORAGE_KEY)).toBe('[]')
    expect(localStorage.getItem(LEGACY_STORAGE_KEY)).toBe(JSON.stringify([task]))
  })
})
