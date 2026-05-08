import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  labels: {
    singular: 'Media',
    plural: 'Media',
  },
  admin: {
    group: 'Media',
    hidden: true,
  },
  slug: 'media',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      label: 'Deskripsi Gambar (Alt)',
      type: 'text',
      required: true,
    },
  ],
  upload: true,
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
  },
  fields: [
    {
      name: 'alt',
      label: 'Deskripsi Gambar (Alt)',
      type: 'text',
      required: true,
    },
  ],
  upload: true,
}
