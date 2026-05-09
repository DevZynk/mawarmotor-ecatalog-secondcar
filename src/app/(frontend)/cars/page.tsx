import type { Metadata } from 'next'
import type { Car, Media } from '@/payload-types'
import Link from 'next/link'
import { Suspense } from 'react'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import CardCatalog from '@/components/product/card-catalog'
import CarFilters from '@/components/cars/car-filters'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import _ from 'lodash'
import { getPayloadClient } from '@/lib/payload'

export const metadata: Metadata = {
  title: 'Mobil Bekas Berkualitas',
  description:
    'Jual beli mobil bekas terpercaya. Harga terbaik, kredit mudah, garansi mesin. Tersedia berbagai merek dan tipe.',
  alternates: {
    canonical: '/cars',
  },
}

// ── Helpers ──────────────────────────────────────────────

function getFeaturedImage(car: Car): string | null {
  return typeof car.cardthumbnail === 'object' ? car.cardthumbnail?.sizes?.card?.url || null : null
}

// ── Page ─────────────────────────────────────────────────

export default async function CarsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const params = await searchParams
  const payload = await getPayloadClient()

  // Build where clause
  const where = {
    and: _.compact([
      { 'analytics.status': { equals: 'available' } },
      params.search && { title: { like: params.search } },
      params.brand && { 'carBrand.title': { equals: params.brand } },
      params.type && { 'carType.title': { equals: params.type } },
      params.fuel && { 'carSpecification.fuel': { equals: params.fuel } },
      params.transmission && {
        'carSpecification.transmission': { equals: params.transmission },
      },
      params.minPrice && { price: { greater_than_equal: params.minPrice } },
      params.maxPrice && { price: { less_than_equal: params.maxPrice } },
    ]) as any,
  }

  if (params.search) {
    where.and.push({ title: { like: params.search } })
  }
  if (params.brand) {
    where.and.push({ 'carBrand.title': { equals: params.brand } })
  }
  if (params.type) {
    where.and.push({ 'carType.title': { equals: params.type } })
  }
  if (params.fuel) {
    where.and.push({ 'carSpecification.fuel': { equals: params.fuel } })
  }
  if (params.transmission) {
    where.and.push({ 'carSpecification.transmission': { equals: params.transmission } })
  }

  if (params.minPrice || params.maxPrice) {
    if (params.minPrice) {
      where.and.push({ price: { greater_than_equal: params.minPrice } })
    }
    if (params.maxPrice) {
      where.and.push({ price: { less_than_equal: params.maxPrice } })
    }
  }

  const page = Number(params.page) || 1
  const sort = params.sort || '-createdAt'

  // Fetch data
  const carsResult = await payload.find({
    collection: 'cars',
    where,
    sort,
    page,
    limit: 12,
    depth: 2,
  })

  const { docs: cars, totalPages, totalDocs } = carsResult

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Beranda</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Mobil Bekas</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Mobil Bekas Berkualitas</h1>
        <p className="text-sm text-muted-foreground mt-1">{totalDocs} mobil ditemukan</p>
      </div>

      {/* Filters */}
      <Suspense fallback={null}>
        <CarFilters />
      </Suspense>

      {/* Grid */}
      {cars.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cars.map((car) => {
            const imageUrl = getFeaturedImage(car)
            const lowestLeasing = car.financing?.leasing?.[0]
            const dp = car.financing?.downPaymentMin || 0
            const installment =
              lowestLeasing && dp
                ? Math.round(
                    ((car.price - dp) *
                      (1 +
                        (lowestLeasing.interestRate / 100) *
                          (Number(lowestLeasing.tenorMonths[0]) / 12))) /
                      Number(lowestLeasing.tenorMonths[0]),
                  )
                : undefined

            return (
              <CardCatalog
                key={car.id}
                id={String(car.id)}
                image={imageUrl || undefined}
                title={car.title}
                href={`/cars/${car.slug}`}
                price={car.price}
                dp={dp}
                installment={installment}
                odometer={car.carSpecification.odometer}
                fuelType={_.startCase(car.carSpecification.fuel)}
                badge={
                  car.analytics.status === 'available'
                    ? 'Tersedia'
                    : car.analytics.status === 'booked'
                      ? 'Dipesan'
                      : undefined
                }
              />
            )
          })}
        </div>
      ) : (
        <div className="py-16 text-center space-y-2">
          <p className="text-lg font-medium text-muted-foreground">Tidak ada mobil ditemukan</p>
          <p className="text-sm text-muted-foreground">
            Coba ubah filter atau{' '}
            <Link href="/cars" className="text-primary hover:underline">
              lihat semua mobil
            </Link>
          </p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          {page > 1 && (
            <Link
              href={`/cars?${new URLSearchParams({ ...params, page: String(page - 1) }).toString()}`}
            >
              <Button variant="outline" size="sm">
                <ArrowLeft size={14} />
                Sebelumnya
              </Button>
            </Link>
          )}

          <span className="text-sm text-muted-foreground px-3">
            Halaman {page} dari {totalPages}
          </span>

          {page < totalPages && (
            <Link
              href={`/cars?${new URLSearchParams({ ...params, page: String(page + 1) }).toString()}`}
            >
              <Button variant="outline" size="sm">
                Selanjutnya
                <ArrowRight size={14} />
              </Button>
            </Link>
          )}
        </div>
      )}

      {/* SEO: Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'Daftar Mobil Bekas',
            numberOfItems: totalDocs,
            itemListElement: cars.map((car, i) => ({
              '@type': 'ListItem',
              position: (page - 1) * 12 + i + 1,
              name: car.title,
              url: `/cars/${car.slug}`,
            })),
          }),
        }}
      />
    </div>
  )
}
