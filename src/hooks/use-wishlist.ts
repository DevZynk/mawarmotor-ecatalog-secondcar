'use client'

import { useLiveQuery } from 'dexie-react-hooks'
import { db, type WishlistItem } from '@/lib/dexie'
import { useCallback } from 'react'

export function useWishlist() {
  const items = useLiveQuery(() => db.wishlist.orderBy('createdAt').reverse().toArray()) ?? []
  const count = items.length

  const isWishlisted = useCallback(
    (id: string) => items.some((item) => item.id === id),
    [items],
  )

  const toggle = useCallback(
    async (car: Omit<WishlistItem, 'createdAt'>) => {
      const existing = await db.wishlist.get(car.id)
      if (existing) {
        await db.wishlist.delete(car.id)
        return false
      } else {
        await db.wishlist.put({ ...car, createdAt: new Date() })
        return true
      }
    },
    [],
  )

  const remove = useCallback(async (id: string) => {
    await db.wishlist.delete(id)
  }, [])

  const clear = useCallback(async () => {
    await db.wishlist.clear()
  }, [])

  return { items, count, isWishlisted, toggle, remove, clear }
}
