'use client'

import { useWishlist } from '@/hooks/use-wishlist'
import { Heart } from 'lucide-react'

type CarWishlistProps = {
  id: string
  title: string
  slug: string
  image: string | null
  price: number
}

export default function CarWishlist({ id, title, slug, image, price }: CarWishlistProps) {
  const { isWishlisted, toggle } = useWishlist()
  const liked = isWishlisted(id)

  const handleToggle = () => {
    toggle({ id, title, slug, image, price })
  }

  return (
    <button
      onClick={handleToggle}
      className={`
        p-2 rounded-full backdrop-blur border transition-all duration-200
        ${
          liked
            ? 'bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20'
            : 'bg-background/80 text-muted-foreground hover:text-primary hover:border-primary/50 border-border'
        }
      `}
      aria-label={liked ? `Hapus ${title} dari wishlist` : `Tambah ${title} ke wishlist`}
    >
      <Heart size={16} fill={liked ? 'currentColor' : 'none'} />
    </button>
  )
}
