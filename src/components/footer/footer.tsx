import Link from 'next/link'
import { ImageBox } from '@inoo-ch/payload-image-optimizer/frontend'
import { Icon } from '../shared/icon'
import { getPayloadClient } from '@/lib/payload'

export default async function Footer() {
  const payload = await getPayloadClient()
  const { siteName, logo, location, address, social, maps } = await payload.findGlobal({
    slug: 'site',
  })

  const logoAlt = (typeof logo === 'object' ? logo.alt : null) || (siteName as string)

  const currentYear = new Date().getFullYear()

  return (
    <footer id="about" className="w-full border-t bg-card mt-12">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-3">
              {logo && typeof logo === 'object' && (
                <div className="w-50 h-50">
                  <ImageBox
                    unoptimized
                    media={logo}
                    alt={logoAlt}
                    className="rounded-full object-cover"
                  />
                </div>
              )}
              <div>
                <p className="font-bold text-foreground">{siteName}</p>
                <p className="text-xs text-muted-foreground">{location}</p>
              </div>
            </div>
            {address && (
              <div className="flex gap-2 text-sm text-muted-foreground">
                <Link href={`${maps}`} target="_blank">
                  <Icon name="MapPinIcon" size={16} className="shrink-0 mt-0.5" />
                </Link>
                <p>{address}</p>
              </div>
            )}
            {social?.whatsapp && (
              <div className="flex gap-2 text-sm text-muted-foreground">
                <Icon name="PhoneIcon" size={16} className="shrink-0" />
                <Link
                  href={`https://wa.me/${social?.whatsapp.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  {social?.whatsapp}
                </Link>
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <p className="text-sm font-semibold text-foreground">Navigasi</p>
            <nav className="flex flex-col gap-2">
              {[
                { title: 'Beranda', icon: 'HouseIcon', href: '/' },
                { title: 'Mobil Bekas', icon: 'CarProfileIcon', href: '/cars' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                >
                  <Icon name={link.icon} size={18} /> {link.title}
                </Link>
              ))}
            </nav>
          </div>

          {/* Social */}
          <div className="space-y-3">
            <p className="text-sm font-semibold text-foreground">Ikuti Kami</p>
            <div className="flex flex-col gap-2">
              {social?.instagram && (
                <Link
                  href={social?.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                >
                  <Icon name="InstagramLogoIcon" size={18} /> Instagram
                </Link>
              )}
              {social?.tiktok && (
                <Link
                  href={social?.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                >
                  <Icon name="TiktokLogoIcon" size={18} /> TikTok
                </Link>
              )}
              {social?.facebook && (
                <Link
                  href={social?.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                >
                  <Icon name="FacebookLogoIcon" size={18} /> Facebook
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t mt-8 pt-6 text-center">
          <p className="text-xs text-muted-foreground">
            © {currentYear} {siteName}. Designed & Developed by{' '}
            <a
              href="https://hztech.id"
              target="_blank"
              rel="noopener"
              className="font-medium text-foreground hover:text-primary transition-colors underline decoration-dotted underline-offset-4"
            >
              HZ Tech
            </a>
            .
          </p>
        </div>
      </div>
    </footer>
  )
}
