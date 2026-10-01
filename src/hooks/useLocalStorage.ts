import { useState } from 'react'

/** Небольшой хук: значение в state + синхронизация с localStorage. */
export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw ? (JSON.parse(raw) as T) : initial
    } catch {
      return initial
    }
  })

  const set = (next: T) => {
    setValue(next)
    try {
      localStorage.setItem(key, JSON.stringify(next))
    } catch {
      // приватный режим / переполнение — не критично для работы UI
    }
  }

  return [value, set] as const
}
