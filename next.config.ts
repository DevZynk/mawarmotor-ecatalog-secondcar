import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['@phosphor-icons/react'],
  },
  poweredByHeader: false,
  images: {
    qualities: [75, 80],
    formats: ['image/webp'],
    localPatterns: [
      {
        pathname: '/api/media/file/**',
      },
      {
        pathname: '/api/carsgallery/file/**',
      },
    ],
  },

  async headers() {
    return [
      {
        // Aset statis Next.js (JS/CSS/fonts) — immutable 1 tahun, aman karena hash-based
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Gambar & file media dari Payload CMS via S3 — cache 24 jam + stale-while-revalidate
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=3600',
          },
        ],
      },
      {
        // File publik statis: favicon, robots, og image
        source: '/(favicon.ico|robots.txt|og.png|apple-touch-icon.png)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400',
          },
        ],
      },
    ]
  },

  webpack: (config) => {
    config.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }
    return config
  },

  turbopack: {
    root: path.resolve(dirname),
  },
}

export default withPayload(nextConfig, {
  devBundleServerPackages: false,
})
