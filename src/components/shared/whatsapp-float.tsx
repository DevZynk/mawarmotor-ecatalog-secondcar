'use client'

import { useSite } from '@/context/site-context'
import { WhatsappLogo } from '@phosphor-icons/react'
import { motion } from 'motion/react'
import { usePathname } from 'next/navigation'

interface WhatsAppFloatProps {

  message?: string
}

export default function WhatsAppFloat({ message }: WhatsAppFloatProps) {
const params = usePathname()
  const { social, siteName } = useSite()
  const isCarPage = params.startsWith('/cars')
  if (!social.whatsapp) return null

  const defaultMsg = `Halo ${siteName}, saya tertarik dengan mobil yang tersedia. Bisa dibantu?`
  const waLink = `https://wa.me/${social.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(message || defaultMsg)}`

  return (
    <motion.a
      href={waLink}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: 'spring', stiffness: 200 }}
      className={`${isCarPage ? 'hidden' : 'fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-green-500 hover:bg-green-600 text-white px-4 py-3 shadow-lg shadow-green-500/25 transition-colors group'}`}
      aria-label="Hubungi kami via WhatsApp"
    >
      <WhatsappLogo size={24} weight="fill" />
      <span className="text-sm font-medium hidden sm:inline group-hover:inline transition-all">
        Chat WhatsApp
      </span>
    </motion.a>
  )
}
