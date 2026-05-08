'use client'

import { useLiveQuery } from 'dexie-react-hooks'
import { db, type CompareItem } from '@/lib/dexie'
import { useCallback } from 'react'

const MAX_COMPARE = 3

export function useCompare() {
  const items = useLiveQuery(() => db.compare.orderBy('createdAt').toArray()) ?? []
  const count = items.length
  const isFull = count >= MAX_COMPARE

  const isCompared = useCallback(
    (id: string) => items.some((item) => item.id === id),
    [items],
  )

  const toggle = useCallback(
    async (car: Omit<CompareItem, 'createdAt'>): Promise<{ added: boolean; error?: string }> => {
      const existing = await db.compare.get(car.id)
      if (existing) {
        await db.compare.delete(car.id)
        return { added: false }
      }

      const currentCount = await db.compare.count()
      if (currentCount >= MAX_COMPARE) {
        return { added: false, error: `Maksimal ${MAX_COMPARE} mobil untuk dibandingkan` }
      }

      await db.compare.put({ ...car, createdAt: new Date() })
      return { added: true }
    },
    [],
  )

  const remove = useCallback(async (id: string) => {
    await db.compare.delete(id)
  }, [])

  const clear = useCallback(async () => {
    await db.compare.clear()
  }, [])

  return { items, count, isFull, isCompared, toggle, remove, clear, maxCompare: MAX_COMPARE }
}
