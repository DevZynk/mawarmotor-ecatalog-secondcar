import type { MediaCategory } from './types'

export const CAT_CONFIG: Record<'all' | MediaCategory, { label: string }> = {
  all: { label: 'Semua' },
  exterior: { label: 'Exterior' },
  interior: { label: 'Interior' },
  engine: { label: 'Mesin' },
}