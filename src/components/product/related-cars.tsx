import type { Car, Media } from '@/payload-types'
import Image from 'next/image'
import Link from 'next/link'
import { Gauge, Fuel } from 'lucide-react'
import formatRupiah from '@/lib/formatRupiah'

function getFeaturedImage(car: Car): string | null {
  const featured = car.gallery?.find((g) => g.isFeatured)
  const first = featured || car.gallery?.[0]
  if (!first) return null
  const img = first.image
  return typeof img === 'object' ? img.url || null : null
}

function getFuelLabel(f: string): string {
  const m: Record<string, string> = { bensin: 'Bensin', solar: 'Solar', listrik: 'Listrik', hybrid: 'Hybrid' }
  return m[f] || f
}

export default function RelatedCars({ cars, currentSlug }: { cars: Car[]; currentSlug: string }) {
  const related = cars.filter((c) => c.slug !== currentSlug).slice(0, 4)

  if (!related.length) return null

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">Mobil Serupa</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {related.map((car) => {
          const imageUrl = getFeaturedImage(car)
          return (
            <Link
              key={car.id}
              href={`/cars/${car.slug}`}
              className="group flex flex-col overflow-hidden rounded-xl border bg-card hover:shadow-md transition-all"
            >
              <div className="relative aspect-4/3 bg-muted overflow-hidden">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={car.title}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Gauge size={24} className="text-muted-foreground" />
                  </div>
                )}
              </div>

              <div className="p-3 space-y-1">
                <h3 className="text-xs font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                  {car.title}
                </h3>
                <div className="flex gap-1.5 text-[10px] text-muted-foreground">
                  <span className="inline-flex items-center gap-0.5">
                    <Gauge size={9} />
                    {car.carSpecification.odometer.toLocaleString('id-ID')} km
                  </span>
                  <span className="inline-flex items-center gap-0.5">
                    <Fuel size={9} />
                    {getFuelLabel(car.carSpecification.fuel)}
                  </span>
                </div>
                <p className="text-sm font-bold">{formatRupiah(car.price)}</p>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
