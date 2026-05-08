'use client'

import { Button } from '@/components/ui/button'
import { useSite } from '@/context/site-context'
import { WhatsappLogo, CalendarCheck, CurrencyDollar } from '@phosphor-icons/react'
import formatRupiah from '@/lib/formatRupiah'
import Link from 'next/link'

interface StickyCTAProps {
  carName: string
  price: number
  mode?: 'car' | 'rent'
}

export default function StickyCTA({ carName, price, mode = 'car' }: StickyCTAProps) {
  const { social, siteName } = useSite()

  const waNumber = social.whatsapp?.replace(/\D/g, '') || ''

  const links = {
    ask: `https://wa.me/${waNumber}?text=${encodeURIComponent(
      `Halo ${siteName}, saya tertarik dengan ${carName} (${formatRupiah(price)}). Apakah masih tersedia?`,
    )}`,
    credit: `https://wa.me/${waNumber}?text=${encodeURIComponent(
      `Halo ${siteName}, saya ingin mengajukan kredit untuk ${carName}. Bisa dibantu?`,
    )}`,
    testDrive: `https://wa.me/${waNumber}?text=${encodeURIComponent(
      `Halo ${siteName}, saya ingin booking test drive ${carName}. Kapan bisa jadwal?`,
    )}`,
    bookingRent: `https://wa.me/${waNumber}?text=${encodeURIComponent(
      `Halo ${siteName}, saya ingin booking rental ${carName}. Boleh minta info ketersediaan?`,
    )}`,
  }

  if (!waNumber) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur border-t shadow-lg md:hidden">
      <div className="flex items-center gap-2 p-3 max-w-6xl mx-auto">
        {mode === 'car' ? (
          <>
            <Link href={links.ask} target="_blank" rel="noopener noreferrer" className="flex-1">
              <Button size="sm" className="w-full text-xs font-semibold">
                <WhatsappLogo size={14} weight="fill" />
                WhatsApp
              </Button>
            </Link>

            <Link href={links.credit} target="_blank" rel="noopener noreferrer" className="flex-1">
              <Button size="sm" variant="outline" className="w-full text-xs font-semibold">
                <CurrencyDollar size={14} weight="bold" />
                Kredit
              </Button>
            </Link>

            <Link href={links.testDrive} target="_blank" rel="noopener noreferrer" className="flex-1">
              <Button size="sm" variant="outline" className="w-full text-xs font-semibold">
                <CalendarCheck size={14} weight="bold" />
                Test Drive
              </Button>
            </Link>
          </>
        ) : (
          <>
            <Link href={links.ask} target="_blank" rel="noopener noreferrer" className="flex-1">
              <Button size="sm" variant="outline" className="w-full text-xs font-semibold">
                <WhatsappLogo size={14} weight="bold" />
                Tanya Admin
              </Button>
            </Link>
            <Link href={links.bookingRent} target="_blank" rel="noopener noreferrer" className="flex-1">
              <Button size="sm" className="w-full text-xs font-semibold">
                <CalendarCheck size={14} weight="fill" />
                Booking
              </Button>
            </Link>
          </>
        )}
      </div>
    </div>
  )
}
