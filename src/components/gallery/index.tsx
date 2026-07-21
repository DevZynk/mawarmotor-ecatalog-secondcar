'use client'

import { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import { ImageBox } from '@inoo-ch/payload-image-optimizer/frontend'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Expand, X, Play, Camera } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { GalleryProps, MediaCategory } from './types'
import { CAT_CONFIG } from './constants'

// ── Main Gallery Component ───────────────────────────────

export default function MediaGallery({ items, title = 'Gallery', initialCount = 8 }: GalleryProps) {
  const [cat, setCat] = useState<'all' | MediaCategory>('all')
  const [activeIndex, setActiveIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [showAll, setShowAll] = useState(false)
  const thumbRef = useRef<HTMLDivElement>(null)

  // Filter items
  const filtered = useMemo(() => {
    return items.filter((i) => cat === 'all' || i.category === cat)
  }, [items, cat])

  const visible = showAll ? filtered : filtered.slice(0, initialCount)
  const activeItem = filtered[activeIndex] || filtered[0]

  const navigatePrev = useCallback(() => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : filtered.length - 1))
  }, [filtered.length])

  const navigateNext = useCallback(() => {
    setActiveIndex((prev) => (prev < filtered.length - 1 ? prev + 1 : 0))
  }, [filtered.length])

  // Scroll active thumbnail into view
  useEffect(() => {
    if (thumbRef.current) {
      const activeThumb = thumbRef.current.children[activeIndex] as HTMLElement
      if (activeThumb) {
        activeThumb.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center',
        })
      }
    }
  }, [activeIndex])

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (lightboxOpen) {
        if (e.key === 'ArrowLeft') navigatePrev()
        if (e.key === 'ArrowRight') navigateNext()
        if (e.key === 'Escape') setLightboxOpen(false)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [lightboxOpen, navigatePrev, navigateNext])

  if (items.length === 0) {
    return (
      <Card className="p-8 text-center">
        <Camera className="w-8 h-8 mx-auto text-muted-foreground/40 mb-2" />
        <p className="text-sm text-muted-foreground">Belum ada foto tersedia</p>
      </Card>
    )
  }

  // Count by category for badges
  const photoCount = items.filter((i) => i.type === 'photo').length
  const videoCount = items.filter((i) => i.type === 'video').length

  return (
    <>
      <Card className="w-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-2">
          <div>
            <h2 className="text-xl font-bold text-foreground">{title}</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {photoCount} foto{videoCount > 0 ? ` · ${videoCount} video` : ''}
            </p>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-1.5 px-5 pb-3 overflow-x-auto">
          {Object.entries(CAT_CONFIG).map(([key, config]) => {
            const count =
              key === 'all' ? items.length : items.filter((i) => i.category === key).length
            return (
              <button
                key={key}
                onClick={() => {
                  setCat(key as 'all' | MediaCategory)
                  setActiveIndex(0)
                }}
                className={cn(
                  'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap',
                  cat === key
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground',
                )}
              >
                {config.label}
                <span
                  className={cn(
                    'text-[10px] px-1.5 py-0.5 rounded-full',
                    cat === key
                      ? 'bg-primary-foreground/20 text-primary-foreground'
                      : 'bg-background/60 text-muted-foreground',
                  )}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        {/* Main Image Viewer */}
        {activeItem && (
          <div className="relative group mx-5 rounded-xl overflow-hidden bg-black">
            <div className="relative w-full aspect-video">
              {activeItem.type === 'photo' ? (
                <ImageBox
                  unoptimized
                  media={activeItem.src}
                  alt={activeItem.alt}
                  fill
                  sizes="100vw"
                  className="object-cover"
                  priority={activeIndex === 0}
                />
              ) : (
                <video
                  src={activeItem.src}
                  controls
                  className="w-full h-full object-contain"
                  poster={activeItem.thumb}
                />
              )}

              {/* Navigation arrows */}
              {filtered.length > 1 && (
                <>
                  <button
                    onClick={navigatePrev}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                    aria-label="Foto sebelumnya"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={navigateNext}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                    aria-label="Foto selanjutnya"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Expand button */}
              <button
                onClick={() => setLightboxOpen(true)}
                className="absolute top-3 right-3 p-2 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                aria-label="Perbesar gambar"
              >
                <Expand className="w-4 h-4" />
              </button>

              {/* Counter */}
              <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-black/60 text-white text-xs font-medium">
                {activeIndex + 1} / {filtered.length}
              </div>

              {/* Category badge */}
              {activeItem.category !== 'all' && (
                <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-black/60 text-white text-xs font-medium capitalize">
                  {activeItem.category}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Thumbnail Strip */}
        <div
          ref={thumbRef}
          className="flex gap-2 px-5 py-4 overflow-x-auto scrollbar-thin"
          role="tablist"
          aria-label="Thumbnail gallery"
        >
          {visible.map((item, i) => (
            <button
              key={item.id}
              onClick={() => setActiveIndex(i)}
              role="tab"
              aria-selected={activeIndex === i}
              className={cn(
                'relative shrink-0 aspect-video w-16 md:w-20 rounded-lg overflow-hidden transition-all ring-offset-2',
                activeIndex === i
                  ? 'ring-2 ring-primary opacity-100'
                  : 'opacity-60 hover:opacity-90 ring-1 ring-border',
              )}
            >
              <ImageBox
                unoptimized
                media={item.thumb}
                alt={item.alt}
                fill
                sizes="80px"
                className="object-cover"
                loading="lazy"
              />
              {item.type === 'video' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <Play className="w-3 h-3 text-white" />
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Show more */}
        {!showAll && filtered.length > initialCount && (
          <div className="px-5 pb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAll(true)}
              className="w-full text-xs"
            >
              Lihat Semua ({filtered.length - initialCount} lainnya)
            </Button>
          </div>
        )}
      </Card>

      {/* Lightbox */}
      {lightboxOpen && activeItem && (
        <div
          className="fixed inset-0 z-100 bg-black/95 flex items-center justify-center"
          onClick={() => setLightboxOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Galeri foto layar penuh"
        >
          <div
            className="relative max-w-[90vw] max-h-[90vh] w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition"
              aria-label="Tutup"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Navigation */}
            {filtered.length > 1 && (
              <>
                <button
                  onClick={navigatePrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition"
                  aria-label="Sebelumnya"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={navigateNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition"
                  aria-label="Selanjutnya"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Content */}
            {activeItem.type === 'photo' ? (
              <ImageBox
                unoptimized
                media={activeItem.src}
                alt={activeItem.alt}
                width={1280}
                height={720}
                className="max-w-full rounded-md max-h-[85vh] object-cover aspect-video"
                priority
              />
            ) : (
              <video src={activeItem.src} controls autoPlay className="max-w-full max-h-[85vh]" />
            )}

            {/* Counter & Caption */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
              <p className="text-white/80 text-sm">
                {activeIndex + 1} / {filtered.length}
              </p>
              {activeItem.alt && <p className="text-white/60 text-xs">{activeItem.alt}</p>}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
