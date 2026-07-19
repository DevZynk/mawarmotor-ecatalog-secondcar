import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import type { Car, Media } from '@/payload-types'
import Link from 'next/link'
import { getPayloadClient } from '@/lib/payload'
import { cache } from 'react'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import CarCarousel from '@/components/product/car-carousel'
import Specification from '@/components/product/specification'
import CarFeature from '@/components/product/car-feature'
import FinanceCard from '@/components/product/card-finance'
import CarFaq from '@/components/product/car-faq'
import { generateFaqItems } from '@/lib/faq'
import RelatedCars from '@/components/product/related-cars'
import StickyCTA from '@/components/product/sticky-cta'
import formatRupiah from '@/lib/formatRupiah'
import MediaGallery from '@/components/gallery'
import type { MediaItem } from '@/components/gallery/types'
// ── Helpers ──────────────────────────────────────────────

function getTransLabel(t: string) {
  const m: Record<string, string> = {
    manual: 'Manual',
    at: 'AT',
    cvt: 'CVT',
    dct: 'DCT',
    amt: 'AMT',
  }
  return m[t] || t
}

function getFuelLabel(f: string) {
  const m: Record<string, string> = {
    bensin: 'Bensin',
    solar: 'Solar',
    listrik: 'Listrik',
    hybrid: 'Hybrid',
  }
  return m[f] || f
}

function getImageUrl(img: number | Media): string | null {
  return typeof img === 'object' ? img.url || null : null
}

function getStatusBadge(status: Car['analytics']['status']) {
  switch (status) {
    case 'available':
      return <Badge className="text-xs">Tersedia</Badge>
    case 'booked':
      return (
        <Badge variant="secondary" className="text-xs">
          Dipesan
        </Badge>
      )
    case 'sold':
      return (
        <Badge variant="destructive" className="text-xs">
          Terjual
        </Badge>
      )
  }
}

/**
 * Build MediaItem[] from Payload gallery array
 */
function buildGalleryItems(car: Car): MediaItem[] {
  if (!car.gallery?.length) return []

  return car.gallery
    .map((g, i) => {
      const img = g.image
      if (typeof img !== 'object' || !img) return null

      const url = img.url || ''
      if (!url) return null

      const mimeType = img.mimeType || ''
      const isVideo = mimeType.startsWith('video/')

      return {
        id: g.id || `gallery-${i}`,
        type: isVideo ? 'video' : 'photo',
        category: (g.tag || 'all') as MediaItem['category'],
        src: img.sizes?.gallery?.url || img.url || '',
        thumb: img.sizes?.thumbnail?.url || img.url || '',
        alt: img.alt || `${car.title} - Foto ${i + 1}`,
        width: img.width || undefined,
        height: img.height || undefined,
      } satisfies MediaItem
    })
    .filter(Boolean) as MediaItem[]
}

// ── Data fetching ────────────────────────────────────────

const getCar = cache(async (slug: string) => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'cars',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
  })
  return docs[0] || null
})

const getRelatedCars = cache(async (car: Car) => {
  const payload = await getPayloadClient()
  const brandId = typeof car.carBrand === 'object' ? car.carBrand?.id : car.carBrand
  const typeId = typeof car.carType === 'object' ? car.carType?.id : car.carType

  const { docs } = await payload.find({
    collection: 'cars',
    where: {
      'analytics.status': { equals: 'available' },
      id: { not_equals: car.id },
      or: [
        ...(brandId ? [{ carBrand: { equals: brandId } }] : []),
        ...(typeId ? [{ carType: { equals: typeId } }] : []),
      ],
    },
    limit: 4,
    depth: 1,
  })
  return docs
})

// ── Static params (SSG) ─────────────────────────────────

export async function generateStaticParams() {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({ collection: 'cars', limit: 200 })
  return docs.map((car) => ({ slug: car.slug }))
}

// ── Metadata ─────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const car = await getCar(slug)
  if (!car) return {}

  const imageUrl = car.gallery?.[0]?.image ? getImageUrl(car.gallery[0].image) : null

  const titleText = `${car.title} - Harga ${formatRupiah(car.price)}`

  return {
    title: titleText,
    description: car.description?.slice(0, 160),
    openGraph: {
      title: car.title,
      description: car.description,
      ...(imageUrl ? { images: [{ url: imageUrl, alt: car.title }] } : {}),
    },
    alternates: {
      canonical: `/cars/${car.slug}`,
    },
  }
}

// ── Page ─────────────────────────────────────────────────

export default async function CarDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const car = await getCar(slug)
  if (!car) notFound()

  const related = await getRelatedCars(car)
  const spec = car.carSpecification
  const brandName = typeof car.carBrand === 'object' ? car.carBrand?.title : null
  const typeName = typeof car.carType === 'object' ? car.carType?.title : null
  const faqItems = generateFaqItems(car)

  // Build gallery media items for carousel (featured only)
  const carouselMedia = (car.gallery || [])
    .filter((g) => g.isSlideshow)
    .map((g) => {
      const img = g.image
      const url = typeof img === 'object' ? img.sizes?.gallery?.url || img.url || '' : ''
      const alt = typeof img === 'object' ? img.alt || car.title : car.title
      return { type: 'image' as const, url, alt }
    })

  // Build full gallery items for MediaGallery
  const galleryItems = buildGalleryItems(car)

  // Build leasing data for finance card
  const leasingData = (car.financing?.leasing || []).map((l) => ({
    provider: l.provider,
    downPaymentMin: car.financing.downPaymentMin,
    tenorOption: l.tenorMonths.map((t) => Number(t)),
    interestRate: l.interestRate,
  }))

  const features = (car.features || []).map((f) => f.feature).filter(Boolean) as string[]

  // JSON-LD Structured Data
  const carSchema = {
    '@context': 'https://schema.org',
    '@type': 'Car',
    name: car.title,
    description: car.description,
    brand: brandName ? { '@type': 'Brand', name: brandName } : undefined,
    vehicleEngine: {
      '@type': 'EngineSpecification',
      engineDisplacement: {
        '@type': 'QuantitativeValue',
        value: spec.engine,
        unitCode: 'CMQ',
      },
    },
    fuelType: getFuelLabel(spec.fuel),
    vehicleTransmission: getTransLabel(spec.transmission),
    mileageFromOdometer: {
      '@type': 'QuantitativeValue',
      value: spec.odometer,
      unitCode: 'KMT',
    },
    color: spec.color,
    vehicleSeatingCapacity: spec.passenger,
    modelDate: String(spec.buildYear),
    offers: {
      '@type': 'Offer',
      price: car.price,
      priceCurrency: 'IDR',
      availability:
        car.analytics.status === 'available'
          ? 'https://schema.org/InStock'
          : car.analytics.status === 'booked'
            ? 'https://schema.org/PreOrder'
            : 'https://schema.org/SoldOut',
      itemCondition: 'https://schema.org/UsedCondition',
    },
    image: carouselMedia.map((m) => m.url).filter(Boolean),
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Beranda', item: '/' },
      { '@type': 'ListItem', position: 2, name: 'Mobil Bekas', item: '/cars' },
      { '@type': 'ListItem', position: 3, name: car.title },
    ],
  }

  const payload = await getPayloadClient()
  const site = await payload.findGlobal({
    slug: 'site',
  })

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(carSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <article className="space-y-6 pb-20 md:pb-6">
        {/* Breadcrumb */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Beranda</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/cars">Mobil Bekas</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{car.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* ── Main Content ── */}
          <div className="w-full lg:w-2/3 flex flex-col gap-6">
            {/* Hero Card */}
            <Card className="pt-0 w-full overflow-hidden">
              {/* Carousel */}
              {carouselMedia.length > 0 && (
                <div className="relative w-full">
                  <CarCarousel media={carouselMedia} />
                </div>
              )}

              {/* Car Info */}
              <div className="p-5 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      {getStatusBadge(car.analytics.status)}
                      {brandName && (
                        <Badge variant="outline" className="text-[10px]">
                          {brandName}
                        </Badge>
                      )}
                      {typeName && (
                        <Badge variant="outline" className="text-[10px]">
                          {typeName}
                        </Badge>
                      )}
                    </div>
                    <h1 className="text-xl md:text-2xl font-bold text-foreground">{car.title}</h1>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-2xl font-bold text-primary">{formatRupiah(car.price)}</p>
                  {car.financing?.downPaymentMin > 0 && (
                    <p className="text-sm text-muted-foreground">
                      DP mulai{' '}
                      <span className="font-medium text-foreground">
                        {formatRupiah(car.financing.downPaymentMin)}
                      </span>
                      {' · '}
                      <Link href="#finance" className="text-primary hover:underline">
                        Cek Simulasi Kredit
                      </Link>
                    </p>
                  )}
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed">{car.description}</p>

                {/* Desktop CTA */}
                <div className="hidden md:flex gap-3">
                  <Link
                    href={`https://wa.me/${site.social?.whatsapp?.replace(/\D/g, '')}?text=${encodeURIComponent(
                      `Halo ${site.siteName}, saya tertarik dengan mobil ${car.title} (${process.env.NEXT_PUBLIC_APP_URL}/cars/${car.slug}).

Saya ingin menanyakan:
• Apakah unit ini masih tersedia?
• Bisa dibantu simulasi kredit / cash price?
• Detail DP dan cicilan per bulan?

Mohon informasinya ya, terima kasih`,
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1"
                  >
                    <Button className="w-full font-semibold">Hubungi via WhatsApp</Button>
                  </Link>
                  <Link href="#finance" className="flex-1">
                    <Button variant="outline" className="w-full font-semibold">
                      Simulasi Kredit
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>

            {/* Full Gallery */}
            {galleryItems.length > 0 && (
              <MediaGallery items={galleryItems} title={`Galeri ${car.title}`} initialCount={8} />
            )}

            {/* Specifications */}
            <Card className="p-5">
              <h2 className="text-lg font-semibold mb-3">Spesifikasi Kendaraan</h2>
              <Specification
                items={[
                  { title: 'Kapasitas Mesin', data: String(spec.engine) },
                  { title: 'Jumlah Penumpang', data: String(spec.passenger) },
                  { title: 'Transmisi', data: getTransLabel(spec.transmission) },
                  { title: 'Bahan Bakar', data: getFuelLabel(spec.fuel) },
                  { title: 'Warna', data: spec.color },
                  { title: 'Odometer', data: `${spec.odometer.toLocaleString('id-ID')}` },
                ]}
              />
              <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                <div className="flex justify-between border-b px-3 py-2">
                  <span className="text-muted-foreground">Tahun Perakitan</span>
                  <span className="font-medium">{spec.buildYear}</span>
                </div>
                <div className="flex justify-between border-b px-3 py-2">
                  <span className="text-muted-foreground">Tahun Registrasi</span>
                  <span className="font-medium">{spec.registrationYear}</span>
                </div>
              </div>
            </Card>

            {/* Features */}
            {features.length > 0 && <CarFeature features={features} />}

            {/* Finance */}
            {leasingData.length > 0 && (
              <div id="finance">
                <FinanceCard carName={car.title} carPrice={car.price} leasing={leasingData} />
              </div>
            )}

            {/* FAQ */}
            <Card className="p-5">
              <CarFaq faqs={faqItems} />
            </Card>

            {/* Related */}
            {related.length > 0 && (
              <Card className="p-5">
                <RelatedCars cars={related} currentSlug={car.slug || ''} />
              </Card>
            )}
          </div>

          {/* ── Sidebar ── */}
          <aside className="w-full lg:w-1/3 space-y-4">
            {/* Quick Info Card */}
            <Card className="p-5 space-y-4 sticky top-24 hidden md:block">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Ringkasan
              </h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Harga</span>
                  <span className="font-bold text-primary">{formatRupiah(car.price)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Kondisi</span>
                  <span className="font-medium">Bekas</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">KM</span>
                  <span className="font-medium">{spec.odometer.toLocaleString('id-ID')} km</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Transmisi</span>
                  <span className="font-medium">{getTransLabel(spec.transmission)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">BBM</span>
                  <span className="font-medium">{getFuelLabel(spec.fuel)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tahun</span>
                  <span className="font-medium">{spec.buildYear}</span>
                </div>
              </div>

              <div className="border-t pt-4 space-y-2">
                <Link
                  href={`https://wa.me/${site.social?.whatsapp?.replace(/\D/g, '')}?text=${encodeURIComponent(
                    `Halo ${site.siteName}, saya tertarik dengan mobil ${car.title} (${process.env.NEXT_PUBLIC_APP_URL}/cars/${car.slug}).

Saya ingin menanyakan:
• Apakah unit ini masih tersedia?
• Bisa dibantu simulasi kredit / cash price?
• Detail DP dan cicilan per bulan?

Mohon informasinya ya, terima kasih`,
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="w-full font-semibold">Hubungi WhatsApp</Button>
                </Link>
                <Link href="#finance">
                  <Button variant="outline" className="w-full font-semibold">
                    Simulasi Kredit
                  </Button>
                </Link>
              </div>

              {/* Internal links for SEO */}
              <div className="border-t pt-3 text-xs space-y-1">
                <Link href="/cars" className="block text-primary hover:underline">
                  ← Lihat Semua Mobil
                </Link>
              </div>
            </Card>
          </aside>
        </div>

        {/* Mobile Sticky CTA */}
        <StickyCTA carName={car.title} price={car.price} />
      </article>
    </>
  )
}
