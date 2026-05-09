import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import type { Rent, Media } from '@/payload-types'
import Link from 'next/link'

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
import StickyCTA from '@/components/product/sticky-cta'
import formatRupiah from '@/lib/formatRupiah'
import MediaGallery from '@/components/gallery'
import type { MediaItem } from '@/components/gallery/types'
import { Calendar, Key, PersonSimpleWalk } from '@phosphor-icons/react/dist/ssr'
import { getPayloadClient } from '@/lib/payload'

// ── Helpers ──────────────────────────────────────────────

function getTransLabel(t: string) {
  const m: Record<string, string> = { manual: 'Manual', at: 'AT', cvt: 'CVT', dct: 'DCT', amt: 'AMT' }
  return m[t] || t
}

function getFuelLabel(f: string) {
  const m: Record<string, string> = { bensin: 'Bensin', solar: 'Solar', listrik: 'Listrik', hybrid: 'Hybrid' }
  return m[f] || f
}

function getImageUrl(img: number | Media): string | null {
  return typeof img === 'object' ? img.url || null : null
}

function getStatusBadge(status: Rent['status']) {
  switch (status) {
    case 'available':
      return <Badge className="text-xs">Tersedia</Badge>
    case 'rented':
      return <Badge variant="secondary" className="text-xs">Sedang Disewa</Badge>
    case 'service':
      return <Badge variant="destructive" className="text-xs">Sedang Servis</Badge>
  }
}

function getRentalTypeLabel(type: string | null | undefined) {
  if (type === 'with_driver') return { label: 'Dengan Sopir', icon: PersonSimpleWalk }
  return { label: 'Lepas Kunci', icon: Key }
}

function buildGalleryItems(car: Rent): MediaItem[] {
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
        src: url,
        thumb: img?.sizes?.gallery?.url || url,
        alt: img.alt || `${car.title} - Foto ${i + 1}`,
        width: img.width || undefined,
        height: img.height || undefined,
      } satisfies MediaItem
    })
    .filter(Boolean) as MediaItem[]
}

// ── Data fetching ────────────────────────────────────────

async function getRent(slug: string) {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'rents',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
  })
  return docs[0] || null
}

// ── Static params (SSG) ─────────────────────────────────

export async function generateStaticParams() {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({ collection: 'rents', limit: 200 })
  return docs.map((rent) => ({ slug: rent.slug }))
}

// ── Metadata ─────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const rent = await getRent(slug)
  if (!rent) return {}

  const imageUrl = rent.gallery?.[0]?.image
    ? getImageUrl(rent.gallery[0].image)
    : null

  const titleText = `Sewa ${rent.title} - ${rent.rentalType === 'with_driver' ? 'Dengan Sopir' : 'Lepas Kunci'}`

  return {
    title: titleText,
    description: rent.description?.slice(0, 160),
    openGraph: {
      title: rent.title,
      description: rent.description,
      ...(imageUrl ? { images: [{ url: imageUrl, alt: rent.title }] } : {}),
    },
    alternates: {
      canonical: `/rent/${rent.slug}`,
    },
  }
}

// ── Page ─────────────────────────────────────────────────

export default async function RentDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const rent = await getRent(slug)
  if (!rent) notFound()

  const spec = rent.carSpecification
  const brandName = typeof rent.carBrand === 'object' ? rent.carBrand?.title : null
  const typeName = typeof rent.carType === 'object' ? rent.carType?.title : null
  
  const rType = getRentalTypeLabel(rent.rentalType)
  const TypeIcon = rType.icon

  // Build gallery media items for carousel (featured only)
  const carouselMedia = (rent.gallery || [])
    .filter((g) => g.isFeatured)
    .map((g) => {
      const img = g.image
      if (!img || typeof img !== 'object') return null

      const url = img.sizes?.gallery?.url || ''
      const alt = img.alt || rent.title
      return { type: 'image' as const, url, alt }
    })
    .filter((m): m is { type: 'image'; url: string; alt: string } => m !== null)

  // Build full gallery items for MediaGallery
  const galleryItems = buildGalleryItems(rent)

  // JSON-LD Structured Data
  const rentSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: rent.title,
    description: rent.description,
    brand: brandName ? { '@type': 'Brand', name: brandName } : undefined,
    offers: {
      '@type': 'Offer',
      price: rent.pricing?.daily || rent.pricing?.monthly || 0,
      priceCurrency: 'IDR',
      availability:
        rent.status === 'available'
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
    },
    image: carouselMedia.map((m) => m.url).filter(Boolean),
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Beranda', item: '/' },
      { '@type': 'ListItem', position: 2, name: 'Rental Mobil', item: '/rent' },
      { '@type': 'ListItem', position: 3, name: rent.title },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(rentSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <article className="space-y-6 pb-20 md:pb-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Beranda</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/rent">Rental Mobil</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{rent.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* ── Main Content ── */}
          <div className="w-full lg:w-2/3 flex flex-col gap-6">
            <Card className="pt-0 w-full overflow-hidden">
              {carouselMedia.length > 0 && (
                <div className="relative w-full">
                  <CarCarousel media={carouselMedia} />
                </div>
              )}

              <div className="p-5 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      {getStatusBadge(rent.status)}
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
                      <Badge variant="secondary" className="text-[10px] flex items-center gap-1">
                        <TypeIcon size={12} />
                        {rType.label}
                      </Badge>
                    </div>
                    <h1 className="text-xl md:text-2xl font-bold text-foreground">{rent.title}</h1>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Tarif Sewa</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {rent.pricing?.daily && (
                      <div className="bg-muted p-3 rounded-lg border">
                        <p className="text-xs text-muted-foreground mb-1">Harian</p>
                        <p className="font-bold text-primary">{formatRupiah(rent.pricing.daily)}</p>
                      </div>
                    )}
                    {rent.pricing?.weekly && (
                      <div className="bg-muted p-3 rounded-lg border">
                        <p className="text-xs text-muted-foreground mb-1">Mingguan</p>
                        <p className="font-bold text-primary">{formatRupiah(rent.pricing.weekly)}</p>
                      </div>
                    )}
                    {rent.pricing?.monthly && (
                      <div className="bg-muted p-3 rounded-lg border">
                        <p className="text-xs text-muted-foreground mb-1">Bulanan</p>
                        <p className="font-bold text-primary">{formatRupiah(rent.pricing.monthly)}</p>
                      </div>
                    )}
                    {rent.pricing?.yearly && (
                      <div className="bg-muted p-3 rounded-lg border">
                        <p className="text-xs text-muted-foreground mb-1">Tahunan</p>
                        <p className="font-bold text-primary">{formatRupiah(rent.pricing.yearly)}</p>
                      </div>
                    )}
                  </div>
                </div>

                {rent.status === 'rented' && rent.availability?.nextAvailableDate && (
                  <div className="flex items-center gap-2 bg-secondary/20 text-secondary-foreground p-3 rounded-lg border">
                    <Calendar size={20} className="text-primary" />
                    <div>
                      <p className="text-sm font-medium">Tersedia kembali pada {new Date(rent.availability.nextAvailableDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                      <p className="text-xs text-muted-foreground">({rent.availability.estimatedDays} hari lagi)</p>
                    </div>
                  </div>
                )}

                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line border-t pt-4">{rent.description}</p>

                <div className="hidden md:flex gap-3 pt-2">
                  <Link
                    href={`https://wa.me/?text=${encodeURIComponent(`Halo, saya tertarik menyewa mobil ${rent.title} (${rType.label}). Apakah masih tersedia?`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1"
                  >
                    <Button className="w-full font-semibold">
                      Hubungi via WhatsApp
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>

            {galleryItems.length > 0 && (
              <MediaGallery
                items={galleryItems}
                title={`Galeri ${rent.title}`}
                initialCount={8}
              />
            )}

            <Card className="p-5">
              <h2 className="text-lg font-semibold mb-3">Spesifikasi Kendaraan</h2>
              {spec && (
                <>
                  <Specification
                    items={[
                      { title: 'Kapasitas Mesin', data: String(spec.engine) },
                      { title: 'Jumlah Penumpang', data: String(spec.passenger) },
                      { title: 'Transmisi', data: getTransLabel(spec.transmission) },
                      { title: 'Bahan Bakar', data: getFuelLabel(spec.fuel) },
                      { title: 'Warna', data: spec.color || '-' },
                    ]}
                  />
                  <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                    <div className="flex justify-between border-b px-3 py-2">
                      <span className="text-muted-foreground">Tahun Perakitan</span>
                      <span className="font-medium">{spec.buildYear || '-'}</span>
                    </div>
                    <div className="flex justify-between border-b px-3 py-2">
                      <span className="text-muted-foreground">Tahun Registrasi</span>
                      <span className="font-medium">{spec.registrationYear || '-'}</span>
                    </div>
                  </div>
                </>
              )}
            </Card>
          </div>

          {/* ── Sidebar ── */}
          <aside className="w-full lg:w-1/3 space-y-4">
            <Card className="p-5 space-y-4 sticky top-24">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Ringkasan Sewa
              </h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tipe Sewa</span>
                  <span className="font-medium">{rType.label}</span>
                </div>
                {spec && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Penumpang</span>
                      <span className="font-medium">{spec.passenger} Orang</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Transmisi</span>
                      <span className="font-medium">{getTransLabel(spec.transmission)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">BBM</span>
                      <span className="font-medium">{getFuelLabel(spec.fuel)}</span>
                    </div>
                  </>
                )}
              </div>

              <div className="border-t pt-4 space-y-2">
                <Link
                    href={`https://wa.me/?text=${encodeURIComponent(`Halo, saya tertarik menyewa mobil ${rent.title} (${rType.label}). Apakah masih tersedia?`)}`}
                    target="_blank" 
                    rel="noopener noreferrer"
                >
                  <Button className="w-full font-semibold">
                    Booking via WhatsApp
                  </Button>
                </Link>
              </div>

              <div className="border-t pt-3 text-xs space-y-1">
                <Link href="/rent" className="block text-primary hover:underline">
                  ← Lihat Semua Mobil Rental
                </Link>
              </div>
            </Card>
          </aside>
        </div>

        <StickyCTA 
            carName={`Sewa ${rent.title}`} 
            price={rent.pricing?.daily || rent.pricing?.monthly || 0} 
            mode="rent" 
        />
      </article>
    </>
  )
}
