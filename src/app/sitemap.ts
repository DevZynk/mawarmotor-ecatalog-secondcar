import { MetadataRoute } from 'next'
import { getPayloadClient } from '@/lib/payload'

export const revalidate = 86400 // 24 jam — sitemap cukup di-regenerasi sekali sehari

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayloadClient()

  // Fetch site config to get domain
  const site = await payload.findGlobal({
    slug: 'site',
  })

  const baseUrl = site.advancedSEO?.canonicalUrl || site.domain || 'https://mawarmotorbanjarmasin.com'

  // Fetch all available cars
  const carsResult = await payload.find({
    collection: 'cars',
    where: {
      'analytics.status': { equals: 'available' },
    },
    limit: -1,
    select: {
      slug: true,
      updatedAt: true,
    },
  })

  const carUrls = carsResult.docs.map((car) => ({
    url: `${baseUrl}/cars/${car.slug}`,
    lastModified: new Date(car.updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/cars`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    ...carUrls,
  ]
}
