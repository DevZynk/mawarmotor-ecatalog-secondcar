'use client'

import { Button } from '@/components/ui/button'
import { useSite } from '@/context/site-context'
import { WhatsappLogoIcon, CalendarCheckIcon } from '@phosphor-icons/react'
import Link from 'next/link'

export default function CtaSection() {
  const { social, siteName } = useSite()

  const waLink = social.whatsapp
    ? `https://wa.me/${social.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`Halo ${siteName}, saya ingin booking test drive. Bisa dibantu?`)}`
    : '#'

  const waCredit = social.whatsapp
    ? `https://wa.me/${social.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`Halo ${siteName}, saya ingin konsultasi kredit mobil. Bisa dibantu?`)}`
    : '#'

  return (
    <section className="rounded-xl border bg-linear-to-r from-card via-card to-primary/5 p-6 md:p-10">
      <div className="max-w-xl mx-auto text-center space-y-4">
        <h2 className="text-xl md:text-2xl font-bold text-foreground">
          Siap Menemukan Mobil Impian Anda?
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Hubungi kami sekarang untuk konsultasi gratis, test drive, atau pengajuan kredit. Tim kami
          siap membantu Anda mendapatkan mobil terbaik.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link href={waLink} target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="font-semibold w-full">
              <WhatsappLogoIcon size={18} weight="fill" />
              Booking Test Drive
            </Button>
          </Link>

          <Link href={waCredit} target="_blank" rel="noopener noreferrer">
            <Button size="lg" variant="outline" className="font-semibold w-full">
              <CalendarCheckIcon size={18} weight="fill" />
              Konsultasi Kredit
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
