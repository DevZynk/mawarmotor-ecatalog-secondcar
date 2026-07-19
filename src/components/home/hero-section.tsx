import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { getPayloadClient } from '@/lib/payload'
import { Icon } from '../shared/icon'
import { ImageBox } from '@inoo-ch/payload-image-optimizer/frontend'
import bgCard from '../../../public/bgcard.png'

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

  const backgroundImage = hero.backgroundImage
  const hasCmsImage = backgroundImage && typeof backgroundImage === 'object'

  return (
    <section
      id="heroSection"
      className="relative overflow-hidden rounded-2xl bg-linear-to-br from-primary/50 via-primary to-primary/70 text-primary-foreground"
    >
      {hasCmsImage ? (
        <ImageBox
          media={backgroundImage}
          alt="Hero Background"
          fill
          sizes="100vw"
          className="object-cover opacity-50 mix-blend-overlay pointer-events-none select-none"
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={bgCard.src}
          alt="Hero Background"
          className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-overlay pointer-events-none select-none"
        />
      )}

      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-200 rounded-full bg-white/2" />
      </div>

      <div className="relative px-6 py-12 md:px-12 md:py-20">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-secondary text-secondary-foreground aria-expanded:text-secondary-foreground p-2 text-xs font-medium mb-6">
            <Icon name="CarIcon" size={14} weight="fill" />
            <span>{totalCars}+ Mobil Tersedia</span>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight">
            {hero.title}
          </h1>

          <p className="mt-4 text-base md:text-lg text-secondary-foregro leading-relaxed max-w-xl">
            {hero.subTitle}
          </p>

          <div className="flex flex-wrap gap-3 mt-8">
            <Link href="/cars">
              <Button
                size="lg"
                variant="secondary"
              >
                <Icon name="CarProfileIcon" size={18} weight="bold" />
                Lihat Koleksi Mobil
              </Button>
            </Link>

            <Link href={waLink} target="_blank" rel="noopener noreferrer">
              <Button
                size="lg"
                variant="secondary"
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
              className="flex items-center gap-2.5 rounded-xl  px-4 py-3
               bg-secondary text-secondary-foreground aria-expanded:bg-secondary aria-expanded:text-secondary-foreground"
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
