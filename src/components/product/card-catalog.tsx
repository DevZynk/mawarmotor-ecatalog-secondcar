import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import formatRupiah from '@/lib/formatRupiah'
import { Fuel, Gauge, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import CarWishlist from './car-wishlist'

interface CardCatalogProps {
  id: string
  image?: string
  title?: string
  href?: string
  price?: number
  dp?: number
  installment?: number
  odometer: number
  fuelType: string
  badge?: string
  isWishlisted?: boolean
}

export default function CardCatalog({
  id,
  image,
  title,
  href = '/',
  price,
  dp,
  installment,
  odometer,
  fuelType,
  badge,
  isWishlisted = false,
}: CardCatalogProps) {

  return (
    <Card className="group pt-0 flex flex-col overflow-hidden rounded-xl border bg-background shadow-sm hover:shadow-md transition-all">
      
      {/* IMAGE */}
      <CardHeader className="relative p-0">
        <Link href={href}>
          <div className="relative w-full aspect-video rounded-xl overflow-hidden">
            {image ? (
              <Image
                src={image}
                alt={title || 'Mobil'}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <Gauge size={40} className="text-muted-foreground" />
              </div>
            )}

            <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
          </div>
        </Link>

        {/* badge */}
        {badge && (
          <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">
            {badge}
          </span>
        )}

        {/* Action buttons: wishlist & compare */}
        <div className="absolute top-3 right-3">
          <CarWishlist
            id={id}
            title={title || ''}
            slug={href?.replace('/cars/', '') || ''}
            image={image || null}
            price={price || 0}
          />
        </div>
      </CardHeader>

      <CardContent className="flex flex-col flex-1 pl-6 space-y-2">
        
        <Link href={href}>
          <h3 className="text-base  font-bold text-foreground line-clamp-2 hover:text-primary transition">
            {title}
          </h3>
        </Link>

        <div className="flex gap-2 text-xs">
          <div className="flex items-center gap-1 bg-muted px-3 py-1 rounded-full text-muted-foreground">
            <Gauge size={12} />
            {odometer} km
          </div>
          <div className="flex items-center gap-1 bg-muted px-3 py-1 rounded-full text-muted-foreground">
            <Fuel size={12} />
            {fuelType}
          </div>
        </div>

        <div className="mt-auto space-y-1">
          <p className="text-lg font-bold text-foreground">
            {formatRupiah(price)}
          </p>

          <p className="text-xs text-muted-foreground">
            DP{' '}
            <span className="font-medium text-foreground">
              {formatRupiah(dp)}
            </span>
            {' • '}
            <span className="font-medium text-foreground">
              {formatRupiah(installment)}
            </span>{' '}
            /bulan
          </p>
        </div>
      </CardContent>

      {/* FOOTER */}
      <CardFooter>
        <Link
          href={href}
          className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-primary text-primary-foreground text-sm font-medium py-2.5 hover:opacity-90 transition"
        >
          Lihat Detail
          <ArrowRight size={15} />
        </Link>
      </CardFooter>
      
    </Card>
  )
}