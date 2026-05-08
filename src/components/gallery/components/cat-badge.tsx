import { cn } from '@/lib/utils'
import type { MediaCategory } from '../types'

const catLabels: Record<string, string> = {
  exterior: 'Exterior',
  interior: 'Interior',
  engine: 'Mesin',
}

export function CatBadge({ category }: { category: MediaCategory }) {
  if (category === 'all') return null

  return (
    <span
      className={cn(
        'text-[10px] px-2 py-0.5 rounded-full font-medium capitalize',
        'bg-black/50 text-white backdrop-blur-sm',
      )}
    >
      {catLabels[category] || category}
    </span>
  )
}
