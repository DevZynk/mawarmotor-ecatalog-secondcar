'use client'

import { ImageBox } from '@inoo-ch/payload-image-optimizer/frontend'
import Link from 'next/link'
import { useRef, useEffect, useState } from 'react'
import type { CarType, CarBrand } from '@/payload-types'
import _ from 'lodash'
import { Card } from '../ui/card'

function getImageUrl(icon: CarType['icon'] | CarBrand['icon']): string | null {
  if (typeof icon === 'object' && icon !== null) return icon.url || null
  return null
}

// ─── Lazy Image dengan IntersectionObserver ───────────────────────────────────
function LazyIcon({ imgUrl, title, size }: { imgUrl: string | null; title: string; size: number }) {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: '200px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`relative w-${size} h-${size} rounded-full bg-muted flex items-center justify-center overflow-hidden`}
    >
      {visible && imgUrl ? (
        <ImageBox
          unoptimized
          media={imgUrl}
          alt={title}
          width={40}
          height={40}
          className="object-contain p-1"
        />
      ) : (
        <span className={`${size <= 10 ? 'text-sm' : 'text-lg'} font-bold text-muted-foreground`}>
          {title?.[0]}
        </span>
      )}
    </div>
  )
}

// ─── Scroll Container — 2 baris, horizontal scroll ───────────────────────────
function HorizontalGrid({
  children,
  cols,
  itemWidth,
}: {
  children: React.ReactNode
  cols: number // jumlah kolom per "group" (= jumlah item per baris)
  itemWidth: number // px lebar satu item
}) {
  const scrollRef = useRef<HTMLDivElement>(null)

  // Grid CSS: 2 baris, auto-fill horizontal lalu wrap ke baris berikut
  // grid-auto-flow: column → isi kolom dulu (kiri→kanan), max 2 baris
  return (
    <div className="relative">
      <div
        ref={scrollRef}
        className="overflow-x-auto scroll-smooth"
        style={{ scrollbarWidth: 'thin' }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateRows: `repeat(${cols}, auto)`,
            gridAutoFlow: 'column',
            gridAutoColumns: `${itemWidth}px`,
            gap: '12px',
          }}
        >
          {children}
        </div>
      </div>
      {/* fade kanan */}
      <div className="pointer-events-none absolute right-0 top-0 h-full w-15 bg-linear-to-l from-background to-transparent" />
    </div>
  )
}

// ─── TypeSection ──────────────────────────────────────────────────────────────
export function TypeSection({ types }: { types: CarType[] }) {
  if (!types || !types.length) return null
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-foreground">Cari Berdasarkan Tipe</h2>
        <p className="text-sm text-muted-foreground mt-1">Pilih tipe mobil sesuai kebutuhan Anda</p>
      </div>

      <HorizontalGrid cols={1} itemWidth={120}>
        {types.map((type) => (
          <Card key={type.id}>
            <Link
              href={`/cars?type=${type.title}`}
              className="group flex flex-col items-center gap-2 p-3 transition-all"
              style={{ width: 120 }}
            >
              <LazyIcon imgUrl={getImageUrl(type.icon)} title={type.title || ''} size={10} />
              <h5 className="text-xs font-medium text-center text-foreground group-hover:text-primary transition-colors wrap-break-word overflow-hidden">
                {_.startCase(type.title!)}
              </h5>
            </Link>
          </Card>
        ))}
      </HorizontalGrid>
    </section>
  )
}

// ─── BrandSection ─────────────────────────────────────────────────────────────
export function BrandSection({ brands }: { brands: CarBrand[] }) {
  if (!brands || !brands.length) return null
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-foreground">Cari Berdasarkan Merek</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Brand favorit dengan koleksi terlengkap
        </p>
      </div>

      <HorizontalGrid cols={1} itemWidth={120}>
        {brands.map((brand) => (
          <Card key={brand.id}>
            <Link
              href={`/cars?brand=${brand.title}`}
              className="group flex flex-col items-center gap-2 p-3 transition-all"
              style={{ width: 120 }}
            >
              <LazyIcon imgUrl={getImageUrl(brand.icon)} title={brand.title || ''} size={10} />
              <h5 className="text-xs font-medium text-center text-foreground group-hover:text-primary transition-colors wrap-break-word overflow-hidden">
                {brand.title}
              </h5>
            </Link>
          </Card>
        ))}
      </HorizontalGrid>
    </section>
  )
}
