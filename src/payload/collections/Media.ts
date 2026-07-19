import type { CollectionConfig } from 'payload'
import { isAdmin, isManagerOrAbove } from '../access'

export const Media: CollectionConfig = {
  labels: {
    singular: 'Media',
    plural: 'Media',
  },

  admin: {
    group: 'Media',
    hidden: () => !isAdmin,
  },
  slug: 'media',
  access: {
    read: () => true,
    create: isManagerOrAbove,
    update: isManagerOrAbove,
    delete: isManagerOrAbove,
  },
  fields: [
    {
      name: 'alt',
      label: 'Deskripsi Gambar (Alt)',
      type: 'text',
      hooks: {
        beforeChange: [
          ({ value, req, data }) => {
            if (!value) {
              return req?.file?.name?.split('.')[0] || data?.filename?.split('.')[0] || 'Media'
            }
            return value
          },
        ],
      },
    },
  ],
  upload: {
    staticDir: 'media',
    imageSizes: [
      {
        name: 'thumbnail',
        width: 160,
        height: undefined,
        position: 'center',
      },
      {
        name: 'card',
        width: 640,
        height: undefined,
        position: 'center',
      },
      {
        name: 'large',
        width: 1600,
        height: undefined,
      },
    ],
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*', 'video/*'],
  },
}

export const CarsGallery: CollectionConfig = {
  labels: {
    singular: 'Galeri Mobil',
    plural: 'Galeri Mobil',
  },
  slug: 'carsgallery',
  admin: {
    group: 'Media',
  },
  access: {
    read: () => true,
    create: isManagerOrAbove,
    update: isManagerOrAbove,
    delete: isManagerOrAbove,
  },
  fields: [
    {
      name: 'camera',
      type: 'ui',
      admin: {
        components: {
          Field: '/payload/components/CameraUploadField',
        },
      },
    },
    {
      name: 'alt',
      label: 'Deskripsi Gambar (Alt)',
      type: 'text',
      hooks: {
        beforeChange: [
          ({ value, req, data }) => {
            if (!value) {
              return (
                req?.file?.name?.split('.')[0] || data?.filename?.split('.')[0] || 'Galeri Mobil'
              )
            }
            return value
          },
        ],
      },
    },
  ],
  upload: {
    staticDir: 'cars-gallery',

    imageSizes: [
      {
        name: 'thumbnail',
        width: 320,
        height: 240,
        fit: 'cover',
      },
      {
        name: 'card',
        width: 800,
        height: 600,
        fit: 'cover',
      },
      {
        name: 'gallery',
        width: 1280,
        height: 720,
        fit: 'inside',
      },
    ],
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*', 'video/*'],
  },
}
