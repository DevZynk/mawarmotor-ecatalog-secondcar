import { cn } from '@/lib/utils'
import type { MediaType } from '../types'

const labels: Record<MediaType, string> = {
  photo: 'Foto',
  video: 'Video',
}

export function TypeBadge({ type }: { type: MediaType }) {
  return (
    <span
      className={cn(
        'text-[10px] px-2 py-0.5 rounded-full font-medium',
        type === 'video'
          ? 'bg-red-500/80 text-white'
          : 'bg-black/50 text-white backdrop-blur-sm',
      )}
    >
      {labels[type]}
    </span>
  )
}
