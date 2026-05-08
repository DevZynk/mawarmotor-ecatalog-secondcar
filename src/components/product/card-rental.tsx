import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import formatRupiah from '@/lib/formatRupiah'
import { ArrowRight, Users, PersonSimpleWalk, Key } from '@phosphor-icons/react/dist/ssr'
import Image from 'next/image'
import Link from 'next/link'

interface CardRentalProps {
  id: string
  image?: string
  title: string
  href: string
  pricing: {
    daily?: number | null
    weekly?: number | null
    monthly?: number | null
    yearly?: number | null
  }
  passenger: number
  transmission: string
  fuelType: string
  rentalType: string
  badge?: string
}

export default function CardRental({
  id,
  image,
  title,
  href,
  pricing,
  passenger,
  transmission,
  fuelType,
  rentalType,
  badge,
}: CardRentalProps) {

  const getLowestPrice = () => {
    if (pricing.daily) return { price: pricing.daily, label: 'hari' }
    if (pricing.weekly) return { price: pricing.weekly, label: 'minggu' }
    if (pricing.monthly) return { price: pricing.monthly, label: 'bulan' }
    if (pricing.yearly) return { price: pricing.yearly, label: 'tahun' }
    return null
  }

  const lowestPrice = getLowestPrice()

  const getRentalTypeLabel = () => {
    if (rentalType === 'lepas_kunci') return { label: 'Lepas Kunci', icon: Key }
    if (rentalType === 'with_driver') return { label: 'Dengan Sopir', icon: PersonSimpleWalk }
    return { label: rentalType, icon: Key }
  }

  const TypeInfo = getRentalTypeLabel()
  const TypeIcon = TypeInfo.icon

  return (
    <Card className="group pt-0 flex flex-col overflow-hidden rounded-xl border bg-background shadow-sm hover:shadow-md transition-all">
      
      {/* IMAGE */}
      <CardHeader className="relative p-0">
        <Link href={href}>
          <div className="relative w-full aspect-video rounded-xl overflow-hidden">
            {image ? (
              <Image
                src={image}
                alt={title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <span className="text-muted-foreground text-xs">No Image</span>
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
      </CardHeader>

      <CardContent className="flex flex-col flex-1 pl-6 space-y-3 pt-4">
        
        <Link href={href}>
          <h3 className="text-base font-bold text-foreground line-clamp-2 hover:text-primary transition">
            {title}
          </h3>
        </Link>

        <div className="flex flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-1.5 bg-muted px-3 py-1 rounded-full text-muted-foreground">
            <TypeIcon size={14} />
            {TypeInfo.label}
          </div>
          <div className="flex items-center gap-1.5 bg-muted px-3 py-1 rounded-full text-muted-foreground">
            <Users size={14} />
            {passenger} Penumpang
          </div>
          <div className="flex items-center gap-1.5 bg-muted px-3 py-1 rounded-full text-muted-foreground capitalize">
            {transmission}
          </div>
        </div>

        <div className="mt-auto space-y-1 pt-2">
          {lowestPrice ? (
            <p className="text-lg font-bold text-foreground">
              {formatRupiah(lowestPrice.price)}
              <span className="text-xs font-normal text-muted-foreground"> /{lowestPrice.label}</span>
            </p>
          ) : (
            <p className="text-lg font-bold text-foreground">Harga belum tersedia</p>
          )}
        </div>
      </CardContent>

      {/* FOOTER */}
      <CardFooter>
        <Link
          href={href}
          className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-primary text-primary-foreground text-sm font-medium py-2.5 hover:opacity-90 transition"
        >
          Lihat Detail Sewa
          <ArrowRight size={15} />
        </Link>
      </CardFooter>
      
    </Card>
  )
}
