import Image from 'next/image'
import { MediaItem } from '../types'
import { cn } from '@/lib/utils'
import { Play } from 'lucide-react'

export function GridCell({
  item,
  index,
  onClick,
}: {
  item: MediaItem
  index?: number
  onClick: () => void
}) {
  const isFeatured = index === 0

  return (
    <div
      onClick={onClick}
      className={cn(
        'relative overflow-hidden rounded-lg cursor-pointer bg-muted group',
        isFeatured ? 'md:col-span-2 aspect-4/3' : 'aspect-4/3',
      )}
    >
      <Image
        src={item.thumb}
        alt={item.alt}
        fill
        sizes="(max-width: 768px) 50vw, 33vw"
        className="object-cover transition group-hover:scale-105"
        loading="lazy"
      />

      {item.type === 'video' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-black/50 rounded-full p-2">
            <Play className="text-white w-4 h-4" />
          </div>
        </div>
      )}

      {item.category !== 'all' && (
        <div className="absolute bottom-2 left-2">
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/50 text-white backdrop-blur-sm capitalize">
            {item.category}
          </span>
        </div>
      )}
    </div>
  )
}