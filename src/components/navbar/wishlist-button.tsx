'use client'

import { useWishlist } from '@/hooks/use-wishlist'
import { HeartIcon, TrashIcon } from '@phosphor-icons/react'
import { ImageBox } from '@inoo-ch/payload-image-optimizer/frontend'
import Link from 'next/link'
import formatRupiah from '@/lib/formatRupiah'
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '../ui/button'

export default function WishlistButton() {
  const { items, count, remove, clear } = useWishlist()

  return (
    <Popover>
      <PopoverTrigger asChild aria-label={`Wishlist (${count} mobil)`}>
        <Button className="relative" variant="ghost" size={"icon-lg"}>
          <HeartIcon size={18} />
          {count > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 rounded-full bg-primary text-primary-foreground text-[9px] font-bold flex items-center justify-center px-1">
              {count}
            </span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent side="bottom" align="end" className="w-80 mt-5">
        <PopoverHeader>
          <div className="flex items-center justify-between">
            <PopoverTitle className="text-sm font-semibold">Wishlist ({count})</PopoverTitle>
            {count > 0 && (
              <button
                onClick={clear}
                className="text-xs text-muted-foreground hover:text-destructive transition"
              >
                Hapus Semua
              </button>
            )}
          </div>
          <PopoverDescription className="text-xs">Mobil yang Anda simpan</PopoverDescription>
        </PopoverHeader>

        {count === 0 ? (
          <div className="py-6 text-center text-sm text-muted-foreground">
            <HeartIcon size={24} className="mx-auto mb-2 opacity-40" />
            <p>Belum ada mobil disimpan</p>
          </div>
        ) : (
          <div className="space-y-1 max-h-60 overflow-y-auto">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-2.5 rounded-lg p-2 hover:bg-muted/50 transition group"
              >
                {/* Thumbnail */}
                <Link href={`/cars/${item.slug}`} className="shrink-0">
                  <div className="relative w-24 h-16 p-2 border rounded-sm bg-muted overflow-hidden">
                    {item.image ? (
                      <ImageBox
                        media={item.image}
                        alt={item.title}
                        fill
                        sizes="70px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <HeartIcon size={12} />
                      </div>
                    )}
                  </div>
                </Link>

                {/* Info */}
                <Link href={`/cars/${item.slug}`} className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{item.title}</p>
                  <p className="text-[10px] font-semibold text-primary">
                    {formatRupiah(item.price)}
                  </p>
                </Link>

                {/* Remove */}
                <button
                  onClick={() => remove(item.id)}
                  className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive transition"
                  aria-label={`Hapus ${item.title} dari wishlist`}
                >
                  <TrashIcon size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        {count > 0 && (
          <div className="pt-2 border-t">
            <Link
              href="/wishlist"
              className="block text-center text-xs text-primary hover:underline py-1"
            >
              Lihat Semua Wishlist
            </Link>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
