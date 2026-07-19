import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { seoPlugin } from '@payloadcms/plugin-seo'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { importExportPlugin } from '@payloadcms/plugin-import-export'
import { Users } from './payload/collections/Users'
import { CarsGallery, Media } from './payload/collections/Media'
import { Site } from './payload/globals/site'
import { CarBrands, Cars, CarTypes } from './payload/collections/Cars'
import { Hero } from './payload/globals/hero'
import { Review } from './payload/globals/review'
import { Advantage } from './payload/globals/advantage'
import { imageOptimizer } from '@inoo-ch/payload-image-optimizer'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    theme: 'light',
    importMap: {
      baseDir: path.resolve(dirname),
    },

    components: {
      beforeNavLinks: ['/payload/components/AnalyticNavLink'],
      afterNavLinks: ['/payload/components/LogoutButton'],
      graphics: {
        Icon: '/payload/components/AdminIcon',
        Logo: '/payload/components/AdminLogo',
      },

      views: {
        dashboard: {
          Component: '/payload/components/AnalyticDashboard',
        },
      },
    },
  },
  collections: [Users, Media, Cars, CarBrands, CarTypes, CarsGallery],
  globals: [Site, Hero, Review, Advantage],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URL || '',
    },
  }),
  sharp,
  plugins: [
    imageOptimizer({
      collections: {
        media: {
          format: { format: 'webp', quality: 75 }
        },
        carsgallery: {
          format: { format: 'webp', quality: 90 }
        }
      },
      stripMetadata: true,
      clientOptimization: true,
      disabled: false

    }),
    importExportPlugin({
      collections: [{ slug: 'cars' }],
      exportLimit: 0,
      importLimit: 0,
    }),
    seoPlugin({
      collections: ['cars'],
      uploadsCollection: 'carsgallery',
      generateTitle: ({ doc }) =>
        `${doc?.carBrand}-${doc?.title}-${doc?.buildYear} | Mawar Motor` || 'Mawar Motor',

      generateDescription: ({ doc }) => doc?.description || 'Deskripsi mobil terbaik',

      generateURL: ({ doc, collectionSlug }) =>
        `${process.env.NEXT_PUBLIC_APP_URL}/${collectionSlug}/${doc?.slug}`,
    }),
  ],
})
