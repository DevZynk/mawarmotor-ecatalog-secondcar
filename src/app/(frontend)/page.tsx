import { draftMode } from 'next/headers'
import { cache } from 'react'

export const revalidate = 3600 // 1 jam — homepage jarang berubah (ISR)

import HeroSection from '@/components/home/hero-section'
import { TypeSection, BrandSection } from '@/components/home/category-section'
import FeaturedCars from '@/components/home/featured-cars'
import AdvantagesSection from '@/components/home/advantages-section'
import TestimonialSection from '@/components/home/testimonial-section'
import CtaSection from '@/components/home/cta-section'
import { getPayloadClient } from '@/lib/payload'

// Cache the available cars query
const getAvailableCars = cache(async (draft: boolean) => {
  const payload = await getPayloadClient()
  return await payload.find({
    draft,
    collection: 'cars',
    where: { 'analytics.status': { equals: 'available' } },
    sort: '-createdAt',
    limit: -1,
    depth: 2,
  })
})

export default async function HomePage() {
  const { isEnabled } = await draftMode()
  
  const carsResult = await getAvailableCars(isEnabled)
  const cars = carsResult.docs
  const totalCars = carsResult.totalDocs

  // Extract unique brands and types dynamically in memory
  const brandsMap = new Map()
  const typesMap = new Map()

  for (const car of cars) {
    if (car.carBrand && typeof car.carBrand === 'object') {
      const brand = car.carBrand
      if (!brandsMap.has(brand.id)) {
        brandsMap.set(brand.id, {
          id: brand.id,
          title: brand.title,
          icon: brand.icon,
          count: 1,
        })
      } else {
        brandsMap.get(brand.id).count++
      }
    }

    if (car.carType && typeof car.carType === 'object') {
      const type = car.carType
      if (!typesMap.has(type.id)) {
        typesMap.set(type.id, {
          id: type.id,
          title: type.title,
          icon: type.icon,
          count: 1,
        })
      } else {
        typesMap.get(type.id).count++
      }
    }
  }

  // Sort by count descending
  const brands = Array.from(brandsMap.values()).sort((a, b) => b.count - a.count)
  const types = Array.from(typesMap.values()).sort((a, b) => b.count - a.count)

  // Only take first 8 cars for the featured section
  const featuredCars = cars.slice(0, 8)

  return (
    <div className="space-y-10 py-4">
      {/* Hero — contains the only H1 */}
      <HeroSection totalCars={totalCars} />

      {/* Category Browse */}
      <TypeSection types={types} />
      <BrandSection brands={brands} />

      {/* Featured Cars */}
      <FeaturedCars cars={featuredCars} />

      {/* Dealer Advantages */}
      <AdvantagesSection />

      {/* Testimonials */}
      <TestimonialSection />

      {/* CTA */}
      <CtaSection />

      {/* Structured Data: ItemList */}
      {featuredCars.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'ItemList',
              name: 'Mobil Pilihan',
              numberOfItems: featuredCars.length,
              itemListElement: featuredCars.map((car, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                name: car.title,
                url: `/cars/${car.slug}`,
              })),
            }),
          }}
        />
      )}
    </div>
  )
}
