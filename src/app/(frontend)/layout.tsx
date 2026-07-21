import React, { cache } from 'react'
import './styles.css'
import Navbar from '@/components/navbar/navbar'
import Footer from '@/components/footer/footer'
import WhatsAppFloat from '@/components/shared/whatsapp-float'
import { Oxanium, DM_Sans, JetBrains_Mono } from 'next/font/google'
import { SiteProvider } from '@/context/site-context'
import { getPayloadClient } from '@/lib/payload'
import { RefreshRouteOnSave } from '@/components/live-preview'
import { LenisProvider } from '@/components/provider/lenis'
import { ThemeProvider } from '@/components/provider/theme'
import { Analytics } from "@vercel/analytics/next"

const oxanium = Oxanium({
  subsets: ['latin'],
  variable: '--font-oxanium',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
})

export const revalidate = 3600 // 1 jam — site config jarang berubah

const getSiteConfig = cache(async () => {
  const payload = await getPayloadClient()
  return await payload.findGlobal({
    slug: 'site',
  })
})

const getAvailableCarsForFilters = cache(async () => {
  const payload = await getPayloadClient()
  return await payload.find({
    collection: 'cars',
    where: { 'analytics.status': { equals: 'available' } },
    limit: -1,
    depth: 1,
    select: {
      carBrand: true,
      carType: true,
    },
  })
})

export async function generateMetadata() {
  const site = await getSiteConfig()

  const logoUrl = typeof site.logo === 'object' ? site.logo?.url : null

  const ogImage = typeof site.openGraph?.ogImage === 'object' ? site.openGraph.ogImage?.url : null

  const title = site.seo?.metaTitle || site.siteName || 'Website'

  const description =
    site.seo?.metaDescription || site.shortDescription || 'Website resmi dengan layanan terbaik'

  const domain = site.advancedSEO?.canonicalUrl || site.domain || 'https://domainkamu.com'

  return {
    title: {
      default: title,
      template: `%s | ${site.siteName}`,
    },

    description,

    keywords: site.seo?.keywords?.split(',').map((k: string) => k.trim()),

    metadataBase: new URL(domain),

    alternates: {
      canonical: domain,
    },

    openGraph: {
      title: site.openGraph?.ogTitle || title,
      description: site.openGraph?.ogDescription || description,
      url: domain,
      siteName: site.siteName,
      locale: 'id_ID',
      type: 'website',
      images: [
        {
          url: ogImage || logoUrl || '/og.png',
          width: 1200,
          height: 630,
          alt: site.siteName,
        },
      ],
    },

    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage || logoUrl || '/og.png'],
    },

    robots:
      site.advancedSEO?.robots === 'noindex'
        ? { index: false, follow: false }
        : { index: true, follow: true },

    authors: [
      {
        name: 'HZ Tech',
        url: 'https://hztech.id',
      },
    ],

    creator: 'Dheo Hilman Darmawan',

    publisher: 'HZ Tech',

    applicationName: site.siteName || 'Mawar Motor E-Catalog',

    generator: 'HZ Tech CMS',

    referrer: 'origin-when-cross-origin',
    other: {
      'link:author': 'https://hztech.id',
    },

    icons: {
      icon: '/favicon.ico',
      apple: '/apple-touch-icon.png',
    },
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const site = await getSiteConfig()

  const logoUrl = typeof site.logo === 'object' ? site.logo?.url : null

  const altText = typeof site.logo === 'object' ? site.logo?.alt : null

  const social = {
    whatsapp: site.social?.whatsapp || '',
    instagram: site.social?.instagram || '',
    tiktok: site.social?.tiktok || '',
    facebook: site.social?.facebook || '',
  }

  // Prefetch available cars for filters
  const carsResult = await getAvailableCarsForFilters()
  const cars = carsResult.docs

  // Extract unique brands and types
  const brandsMap = new Map()
  const typesMap = new Map()

  for (const car of cars) {
    if (car.carBrand && typeof car.carBrand === 'object') {
      const brand = car.carBrand
      if (!brandsMap.has(brand.id)) {
        brandsMap.set(brand.id, {
          value: String(brand.id),
          label: brand.title,
        })
      }
    }

    if (car.carType && typeof car.carType === 'object') {
      const type = car.carType
      if (!typesMap.has(type.id)) {
        typesMap.set(type.id, {
          value: String(type.id),
          label: type.title,
        })
      }
    }
  }

  const brands = [
    { value: '', label: 'Semua Merek' },
    ...Array.from(brandsMap.values()).sort((a, b) => a.label.localeCompare(b.label)),
  ]
  const types = [
    { value: '', label: 'Semua Tipe' },
    ...Array.from(typesMap.values()).sort((a, b) => a.label.localeCompare(b.label)),
  ]

  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="author" href="/humans.txt" />

        <link rel="author" href="https://hztech.id" />

        <link rel="me" href="https://hztech.id" />

        <link rel="help" href="https://hztech.id" />

        <link rel="license" href="https://hztech.id" />
      </head>

      <body
        className={`${oxanium.variable} ${dmSans.variable} ${jetbrainsMono.variable} bg-background`}
      >
        {/* Website Developed by

HZ Tech
https://hztech.id

Developer:
Dheo Hilman Darmawan */}
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <SiteProvider
            value={{
              siteName: site.siteName || '',
              maps: site.maps || '',
              address: site.address || '',
              location: site.location || '',
              logoUrl: logoUrl || '',
              alt: altText || '',
              social: social,
              brands: brands,
              types: types,
            }}
          >
            <LenisProvider>
              <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                  __html: JSON.stringify({
                    '@context': 'https://schema.org',
                    '@type': 'AutoDealer',
                    name: site.siteName,
                    image: logoUrl,
                    address: {
                      '@type': 'PostalAddress',
                      streetAddress: site.address,
                      addressLocality: site.business?.city || site.location,
                      addressRegion: site.business?.region,
                      postalCode: site.business?.postalCode,
                      addressCountry: 'ID',
                    },
                    geo:
                      site.business?.latitude && site.business?.longitude
                        ? {
                            '@type': 'GeoCoordinates',
                            latitude: site.business.latitude,
                            longitude: site.business.longitude,
                          }
                        : undefined,
                    url: site.domain,
                    telephone: site.social?.whatsapp,
                    sameAs: [
                      site.social?.instagram,
                      site.social?.tiktok,
                      site.social?.facebook,
                    ].filter(Boolean),
                  }),
                }}
              />
              <RefreshRouteOnSave />
              <Navbar />
              <main className="w-full relative min-h-dvh">
                <div className="w-full mt-20 max-w-6xl mx-auto px-4">{children}</div>
              </main>
              <Footer />
              <WhatsAppFloat />
            </LenisProvider>
          </SiteProvider>
        </ThemeProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: site.siteName || 'Mawar Motor E-Catalog',
              url: site.domain,
              creator: {
                '@type': 'Organization',
                name: 'HZ Tech',
                url: 'https://hztech.id',
              },
            }),
          }}
        />
        <Analytics/>
      </body>
    </html>
  )
}
