import type { Car, Media } from '@/payload-types'
import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import formatRupiah from '@/lib/formatRupiah'
import { Gauge, Fuel, ArrowRight } from 'lucide-react'
import _ from 'lodash'

function getFeaturedImage(car: Car): string | null {
  const featured = car.gallery?.find((g) => g.isFeatured)
  const first = featured || car.gallery?.[0]
  if (!first) return null
  const img = first.image
  return typeof img === 'object' ? img.url || null : null
}

export default function FeaturedCars({ cars }: { cars: Car[] }) {
  if (!cars.length) return null

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Mobil Pilihan</h2>
          <p className="text-sm text-muted-foreground mt-1">Rekomendasi terbaik untuk Anda</p>
        </div>
        <Link
          href="/cars"
          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          Lihat Semua <ArrowRight size={14} />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cars.map((car) => {
          const imageUrl = getFeaturedImage(car)
          const brandName =
            typeof car.carBrand === 'object' && car.carBrand ? car.carBrand.title : null

          return (
            <Link
              key={car.id}
              href={`/cars/${car.slug}`}
              className="group flex flex-col overflow-hidden rounded-xl border bg-card shadow-sm hover:shadow-md transition-all"
            >
              {/* Image */}
              <div className="relative aspect-4/3 bg-muted overflow-hidden">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={`${car.title} - Dealer mobil bekas`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Gauge size={32} className="text-muted-foreground" />
                  </div>
                )}

                <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent" />

                {car.status === 'available' && (
                  <Badge className="absolute top-2 left-2 text-[10px]">Tersedia</Badge>
                )}
                {car.status === 'booked' && (
                  <Badge variant="secondary" className="absolute top-2 left-2 text-[10px]">
                    Dipesan
                  </Badge>
                )}
              </div>

              {/* Content */}
              <div className="flex flex-col flex-1 p-4 gap-2">
                {brandName && (
                  <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                    {brandName}
                  </span>
                )}
                <h3 className="text-sm font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                  {_.startCase(car.title)}
                </h3>

                <div className="flex gap-2 text-[10px] mt-auto">
                  <span className="inline-flex items-center gap-1 bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
                    <Gauge size={10} />
                    {car.carSpecification.odometer.toLocaleString('id-ID')} km
                  </span>
                  <span className="inline-flex items-center gap-1 bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
                    <Fuel size={10} />
                    {_.capitalize(car.carSpecification.fuel)}
                  </span>
                </div>

                <p className="text-base font-bold text-foreground mt-1">
                  {formatRupiah(car.price)}
                </p>

                {car.financing?.downPaymentMin > 0 && (
                  <p className="text-[11px] text-muted-foreground">
                    DP mulai{' '}
                    <span className="font-medium text-foreground">
                      {formatRupiah(car.financing.downPaymentMin)}
                    </span>
                  </p>
                )}
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
