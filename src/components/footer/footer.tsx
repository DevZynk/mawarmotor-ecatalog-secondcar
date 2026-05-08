'use client'

import { useSite } from '@/context/site-context'
import Link from 'next/link'
import Image from 'next/image'
import { MapPinIcon, PhoneIcon } from '@phosphor-icons/react'

export default function Footer() {
  const { siteName, logoUrl, alt, location, address, social, maps } = useSite()

  const currentYear = new Date().getFullYear()

  return (
    <footer id="about" className="w-full border-t bg-card mt-12">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-3">
              {logoUrl && (
                <Image
                  src={logoUrl}
                  alt={alt || siteName}
                  width={50}
                  height={50}
                  className="rounded-full object-cover"
                />
              )}
              <div>
                <p className="font-bold text-foreground">{siteName}</p>
                <p className="text-xs text-muted-foreground">{location}</p>
              </div>
            </div>
            {address && (
              <div className="flex gap-2 text-sm text-muted-foreground">
                <Link href={`${maps}`} target="_blank">
                  {' '}
                  <MapPinIcon size={16} className="shrink-0 mt-0.5" />
                </Link>
                <p>{address}</p>
              </div>
            )}
            {social.whatsapp && (
              <div className="flex gap-2 text-sm text-muted-foreground">
                <PhoneIcon size={16} className="shrink-0" />
                <Link
                  href={`https://wa.me/${social.whatsapp.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  {social.whatsapp}
                </Link>
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <p className="text-sm font-semibold text-foreground">Navigasi</p>
            <nav className="flex flex-col gap-2">
              {[
                { href: '/', label: 'Beranda' },
                { href: '/cars', label: 'Mobil Bekas' },
                // { href: '/rent', label: 'Sewa Mobil' },
                // { href: '/news', label: 'Berita' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Social */}
          <div className="space-y-3">
            <p className="text-sm font-semibold text-foreground">Ikuti Kami</p>
            <div className="flex flex-col gap-2">
              {social.instagram && (
                <Link
                  href={social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Instagram
                </Link>
              )}
              {social.tiktok && (
                <Link
                  href={social.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  TikTok
                </Link>
              )}
              {social.facebook && (
                <Link
                  href={social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Facebook
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t mt-8 pt-6 text-center">
          <p className="text-xs text-muted-foreground">
            © {currentYear} {siteName}. Semua hak dilindungi.
          </p>
        </div>
      </div>
    </footer>
  )
}
