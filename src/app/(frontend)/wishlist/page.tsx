import { Metadata } from 'next'
import WishlistClient from './client'

export const metadata: Metadata = {
  title: 'Wishlist Mobil Bekas | Mawar Motor',
  description: 'Daftar mobil bekas favorit yang Anda simpan di Mawar Motor.',
  alternates: {
    canonical: '/wishlist',
  },
}

export default function WishlistPage() {
  return <WishlistClient />
}
