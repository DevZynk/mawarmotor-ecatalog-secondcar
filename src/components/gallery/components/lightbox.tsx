'use client'

import { Dialog, DialogContent } from '@/components/ui/dialog'
import { ImageBox } from '@inoo-ch/payload-image-optimizer/frontend'
import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { MediaItem } from '../types'

export function Lightbox({
  items,
  index,
  open,
  onClose,
}: {
  items: MediaItem[]
  index: number
  open: boolean
  onClose: () => void
}) {
  const [prevIndex, setPrevIndex] = useState(index)
  const [cur, setCur] = useState(index)

  if (index !== prevIndex) {
    setPrevIndex(index)
    setCur(index)
  }

  // Keyboard navigation
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') setCur((p) => (p > 0 ? p - 1 : items.length - 1))
      if (e.key === 'ArrowRight') setCur((p) => (p < items.length - 1 ? p + 1 : 0))
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, items.length])

  const item = items[cur]
  if (!item) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[90vw] max-w-[90vw] h-[90vh] p-0 bg-black border-none">
        <div className="relative w-full h-full flex items-center justify-center">
          {item.type === 'photo' ? (
            <ImageBox
              media={item.src}
              alt={item.alt}
              width={item.width || 1200}
              height={item.height || 800}
              className="max-w-full max-h-full object-contain"
            />
          ) : (
            <video src={item.src} controls autoPlay className="max-w-full max-h-full" />
          )}

          {/* Navigation */}
          {items.length > 1 && (
            <>
              <button
                onClick={() => setCur((p) => (p > 0 ? p - 1 : items.length - 1))}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition"
                aria-label="Sebelumnya"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setCur((p) => (p < items.length - 1 ? p + 1 : 0))}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition"
                aria-label="Selanjutnya"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/60 text-white text-xs">
            {cur + 1} / {items.length}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}