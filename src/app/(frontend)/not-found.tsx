/* eslint-disable @next/next/no-html-link-for-pages */
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
        <a
          href="/"
          className="inline-flex items-center justify-center h-11 rounded-full px-8 font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Kembali ke Beranda
        </a>
        <a
          href="/cars"
          className="inline-flex items-center justify-center h-11 rounded-full px-8 font-semibold border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          Lihat Mobil
        </a>
      </div>
    </div>
  )
}
