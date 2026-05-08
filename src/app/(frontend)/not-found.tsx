import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <div className="bg-muted p-6 rounded-full mb-6">
        <AlertCircle className="w-16 h-16 text-muted-foreground" />
      </div>
      <h1 className="text-7xl md:text-9xl font-black text-primary mb-4 tracking-tighter">404</h1>
      <h2 className="text-2xl md:text-3xl font-bold mb-4">Halaman Tidak Ditemukan</h2>
      <p className="text-muted-foreground mb-8 max-w-md text-lg">
        Maaf, halaman yang Anda cari tidak ada, telah dihapus, atau namanya diubah.
      </p>
      <div className="flex gap-4">
        <Link href="/">
          <Button size="lg" className="rounded-full px-8 font-semibold">
            Kembali ke Beranda
          </Button>
        </Link>
        <Link href="/cars">
          <Button size="lg" variant="outline" className="rounded-full px-8 font-semibold">
            Lihat Mobil
          </Button>
        </Link>
      </div>
    </div>
  )
}
