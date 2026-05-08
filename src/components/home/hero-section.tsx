import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { getPayloadClient } from '@/lib/payload'
import { Icon } from '../shared/icon'

export default async function HeroSection({ totalCars }: { totalCars: number }) {
  const payload = await getPayloadClient()
  const hero = await payload.findGlobal({
    slug: 'hero',
  })
  const site = await payload.findGlobal({
    slug: 'site',
  })
  const waLink = site.social?.whatsapp
    ? `https://wa.me/${site.social?.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(hero.whatsappMessage)}`
    : '#'

  return (
    <section
      id="heroSection"
      className="relative overflow-hidden rounded-2xl bg-linear-to-br from-primary/95 via-primary to-primary/80 text-primary-foreground"
    >
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-white/2" />
      </div>

      <div className="relative px-6 py-12 md:px-12 md:py-20">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur px-4 py-1.5 text-xs font-medium mb-6">
            <Icon name="CarIcon" size={14} weight="fill" />
            <span>{totalCars}+ Mobil Tersedia</span>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight">
            {hero.title}
          </h1>

          <p className="mt-4 text-base md:text-lg text-primary-foreground/80 leading-relaxed max-w-xl">
            {hero.subTitle}
          </p>

          <div className="flex flex-wrap gap-3 mt-8">
            <Link href="/cars">
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-white/90 font-semibold shadow-lg shadow-black/10"
              >
                <Icon name="CarProfileIcon" size={18} weight="bold" />
                Lihat Koleksi Mobil
              </Button>
            </Link>

            <Link href={waLink} target="_blank" rel="noopener noreferrer">
              <Button
                size="lg"
                variant="outline"
                className="bg-white text-primary hover:bg-white/90 font-semibold shadow-lg shadow-black/10"
              >
                <Icon name="WhatsappLogoIcon" size={18} weight="fill" />
                Hubungi WhatsApp
              </Button>
            </Link>
          </div>
        </div>

        {/* Trust badges */}
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl">
          {[
            ...(hero.advantages?.map((item) => ({
              icon: item.icon,
              text: item.title,
            })) ?? []),
            { icon: 'CarProfileIcon', text: `${totalCars}+ Unit Siap Jual` },
          ].map((item) => (
            <div
              key={item.text}
              className="flex items-center gap-2.5 rounded-xl bg-white/10 backdrop-blur px-4 py-3"
            >
              <Icon name={item.icon} size={20} weight="fill" className="shrink-0" />
              <span className="text-sm font-medium">{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
