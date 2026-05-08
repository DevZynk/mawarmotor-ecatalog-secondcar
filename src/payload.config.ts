import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { seoPlugin } from '@payloadcms/plugin-seo'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { importExportPlugin } from '@payloadcms/plugin-import-export'
import { Users } from './app/payload/collections/Users'
import { CarsGallery, Media } from './app/payload/collections/Media'
import { Site } from './app/payload/globals/site'
import { CarBrands, Cars, CarTypes } from './app/payload/collections/Cars'
import { Hero } from './app/payload/globals/hero'
import { Review } from './app/payload/globals/review'
import { Advantage } from './app/payload/globals/advantage'
import { Rents } from './app/payload/collections/Rent'

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
      beforeNavLinks: ['/app/payload/components/AnalyticNavLink'],
      views: {
        dashboard: {
          Component: '/app/payload/components/AnalyticDashboard',
        },
      },
    },
  },
  collections: [Users, Media, Cars, CarBrands, CarTypes, CarsGallery, Rents],
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
    importExportPlugin({
      collections: [{ slug: 'cars' }],
      exportLimit: 0,
      importLimit: 0,
    }),
    seoPlugin({
      collections: ['cars'],
      uploadsCollection: 'media',
      generateTitle: ({ doc }) => doc?.title || 'Default Title',

      generateDescription: ({ doc }) => doc?.plainText || 'Deskripsi mobil terbaik',

      generateURL: ({ doc, collectionSlug }) =>
        `${process.env.NEXT_PUBLIC_APP_URL}/${collectionSlug}/${doc?.slug}`,
    }),
  ],
})
