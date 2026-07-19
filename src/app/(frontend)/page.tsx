import { draftMode } from 'next/headers'

import HeroSection from '@/components/home/hero-section'
import { TypeSection, BrandSection } from '@/components/home/category-section'
import FeaturedCars from '@/components/home/featured-cars'
import AdvantagesSection from '@/components/home/advantages-section'
import TestimonialSection from '@/components/home/testimonial-section'
import CtaSection from '@/components/home/cta-section'
import { getPayloadClient } from '@/lib/payload'

export default async function HomePage() {
  const { isEnabled } = await draftMode()
  const payload = await getPayloadClient()
  const carsResult = await payload.find({
    draft: isEnabled,
    collection: 'cars',
    where: { 'analytics.status': { equals: 'available' } },
    sort: '-createdAt',
    limit: 8,
    depth: 1,
  })

  const totalCars = carsResult.totalDocs

  return (
    <div className="space-y-10 py-4">
      {/* Hero — contains the only H1 */}
      <HeroSection totalCars={totalCars} />

      {/* Category Browse */}
      <TypeSection />
      <BrandSection />

      {/* Featured Cars */}
      <FeaturedCars cars={carsResult.docs} />

      {/* Dealer Advantages */}
      <AdvantagesSection />

      {/* Testimonials */}
      <TestimonialSection />

      {/* CTA */}
      <CtaSection />

      {/* Structured Data: ItemList */}
      {carsResult.docs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'ItemList',
              name: 'Mobil Pilihan',
              numberOfItems: carsResult.docs.length,
              itemListElement: carsResult.docs.map((car, i) => ({
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
