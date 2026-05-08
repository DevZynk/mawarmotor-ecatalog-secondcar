import { getPayload } from 'payload'
import config from '@payload-config'
import type { Metadata } from 'next'
import type { Rent } from '@/payload-types'
import Link from 'next/link'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import CardRental from '@/components/product/card-rental'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Rental Mobil | Mawar Motor',
  description: 'Sewa mobil lepas kunci atau dengan sopir dengan harga terjangkau.',
}

function getFeaturedImage(rent: Rent): string | null {
  const featured = rent.gallery?.find((g) => g.isFeatured)
  const first = featured || rent.gallery?.[0]
  if (!first) return null
  const img = first.image
  return typeof img === 'object' ? img?.url || null : null
}

export default async function RentPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const params = await searchParams
  const payload = await getPayload({ config })

  const page = Number(params.page) || 1
  const sort = params.sort || '-createdAt'

  const rentsResult = await payload.find({
    collection: 'rents',
    where: { status: { equals: 'available' } },
    sort,
    page,
    limit: 12,
    depth: 2,
  })

  const { docs: rents, totalPages, totalDocs } = rentsResult

  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Beranda</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Rental Mobil</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div>
        <h1 className="text-2xl font-bold text-foreground">Rental Mobil</h1>
        <p className="text-sm text-muted-foreground mt-1">{totalDocs} mobil tersedia untuk disewa</p>
      </div>

      {rents.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {rents.map((rent) => {
            const imageUrl = getFeaturedImage(rent)
            return (
              <CardRental
                key={rent.id}
                id={String(rent.id)}
                image={imageUrl || undefined}
                title={rent.title}
                href={`/rent/${rent.slug}`}
                pricing={rent.pricing || {}}
                passenger={rent.carSpecification?.passenger || 5}
                transmission={rent.carSpecification?.transmission || 'manual'}
                fuelType={rent.carSpecification?.fuel || 'bensin'}
                rentalType={rent.rentalType || 'lepas_kunci'}
                badge={
                  rent.status === 'available'
                    ? 'Tersedia'
                    : rent.status === 'rented'
                      ? 'Disewa'
                      : undefined
                }
              />
            )
          })}
        </div>
      ) : (
        <div className="py-16 text-center space-y-2">
          <p className="text-lg font-medium text-muted-foreground">Belum ada mobil rental yang tersedia.</p>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          {page > 1 && (
            <Link href={`/rent?${new URLSearchParams({ ...params, page: String(page - 1) }).toString()}`}>
              <Button variant="outline" size="sm">
                <ArrowLeft size={14} className="mr-2" />
                Sebelumnya
              </Button>
            </Link>
          )}

          <span className="text-sm text-muted-foreground px-3">
            Halaman {page} dari {totalPages}
          </span>

          {page < totalPages && (
            <Link href={`/rent?${new URLSearchParams({ ...params, page: String(page + 1) }).toString()}`}>
              <Button variant="outline" size="sm">
                Selanjutnya
                <ArrowRight size={14} className="ml-2" />
              </Button>
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
