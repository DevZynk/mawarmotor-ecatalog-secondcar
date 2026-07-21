'use client'

import { useWishlist } from '@/hooks/use-wishlist'
import { ImageBox } from '@inoo-ch/payload-image-optimizer/frontend'
import Link from 'next/link'
import { Heart, Trash, ArrowRight, Info } from '@phosphor-icons/react'
import formatRupiah from '@/lib/formatRupiah'
import { Button } from '@/components/ui/button'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

export default function WishlistClient() {
  const { items, count, remove, clear } = useWishlist()

  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Beranda</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Wishlist</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold">Wishlist Anda</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {count > 0 ? `${count} mobil disimpan` : 'Belum ada mobil yang disimpan'}
          </p>
        </div>
        {count > 0 && (
          <Button variant="destructive" size="sm" onClick={clear} className="text-xs">
            <Trash className="mr-2" size={16} />
            Hapus Semua
          </Button>
        )}
      </div>

      {count === 0 ? (
        <div className="text-center py-24 bg-muted/30 rounded-2xl border border-dashed flex flex-col items-center justify-center">
          <Heart size={48} className="mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-lg font-semibold mb-2">Wishlist Masih Kosong</h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-sm">
            Anda belum menyimpan mobil apapun ke dalam wishlist. Silakan cari mobil impian Anda.
          </p>
          <Link href="/cars">
            <Button>
              Cari Mobil
              <ArrowRight className="ml-2" size={16} />
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {items.map((car) => (
            <div
              key={car.id}
              className="group flex flex-col overflow-hidden rounded-xl border bg-background shadow-sm hover:shadow-md transition-all"
            >
              {/* 4/3 */}
              <Link
                href={`/cars/${car.slug}`}
                className="relative w-full aspect-4/3 rounded-t-xl overflow-hidden block"
              >
                {car.image ? (
                  <ImageBox
                    unoptimized
                    media={car.image}
                    alt={car.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <Heart size={40} className="text-muted-foreground opacity-50" />
                  </div>
                )}
                <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    remove(car.id)
                  }}
                  className="absolute top-2 right-2 h-8 w-8 rounded-full bg-background/80 backdrop-blur-md flex items-center justify-center text-destructive hover:bg-destructive hover:text-white transition-colors"
                  aria-label="Hapus dari wishlist"
                >
                  <Trash size={16} weight="bold" />
                </button>
              </Link>

              <div className="p-4 flex flex-col flex-1">
                <Link href={`/cars/${car.slug}`}>
                  <h3 className="text-sm font-bold text-foreground line-clamp-2 hover:text-primary transition">
                    {car.title}
                  </h3>
                </Link>
                <div className="mt-auto pt-3">
                  <p className="text-base font-bold text-primary">{formatRupiah(car.price)}</p>
                </div>
              </div>
              <div className="p-4 pt-0">
                <Link href={`/cars/${car.slug}`} className="w-full">
                  <Button variant="outline" className="w-full h-8 text-xs">
                    <Info size={14} className="mr-1.5" />
                    Lihat Detail
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
