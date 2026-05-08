'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ServerCrash } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <div className="bg-destructive/10 p-6 rounded-full mb-6">
        <ServerCrash className="w-16 h-16 text-destructive" />
      </div>
      <h1 className="text-7xl md:text-9xl font-black text-destructive mb-4 tracking-tighter">500</h1>
      <h2 className="text-2xl md:text-3xl font-bold mb-4">Terjadi Kesalahan Server</h2>
      <p className="text-muted-foreground mb-8 max-w-md text-lg">
        Maaf, ada masalah di server kami. Tim teknis kami telah diberitahu dan sedang memperbaikinya.
      </p>
      <div className="flex gap-4">
        <Button size="lg" className="rounded-full px-8 font-semibold" onClick={() => reset()}>
          Coba Lagi
        </Button>
        <Button size="lg" variant="outline" className="rounded-full px-8 font-semibold" onClick={() => window.location.href = '/'}>
          Kembali ke Beranda
        </Button>
      </div>
    </div>
  )
}
