import { Dexie, type EntityTable } from 'dexie'

// ── Types ────────────────────────────────────────────────

export interface WishlistItem {
  id: string
  title: string
  slug: string
  image: string | null
  price: number
  createdAt: Date
}

export interface CompareItem {
  id: string
  title: string
  slug: string
  image: string | null
  price: number
  createdAt: Date
}

// ── Database ─────────────────────────────────────────────

const db = new Dexie('MawarMotorDB') as Dexie & {
  wishlist: EntityTable<WishlistItem, 'id'>
  compare: EntityTable<CompareItem, 'id'>
}

db.version(2).stores({
  wishlist: 'id, createdAt',
  compare: 'id, createdAt',
})

export { db }
