import type { GlobalConfig } from 'payload'
import breakpoint from '../breakpoints'
import { isAdmin } from '../access'

export const Review: GlobalConfig = {
  slug: 'review',
  admin: {
    group: 'Beranda',
    description: 'Bagian review di halaman utama',
    livePreview: {
      url: '/#reviewSectio',
      breakpoints: [...breakpoint],
    },
  },
  access: {
    read: isAdmin,
    update: isAdmin,
  },
  fields: [
    { name: 'title', type: 'text', required: true, label: 'Judul' },
    { name: 'subTitle', type: 'text', required: true, label: 'Sub Judul' },
    {
      name: 'reviews',
      type: 'array',
      label: 'Review Customer',
      required: true,
      minRows: 5,
      maxRows: 30,
      admin: {
        description: 'Minimal 5 dan maksimal 30 review',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          label: 'Nama Customer',
        },
        {
          name: 'product',
          type: 'text',
          required: true,
          label: 'Produk (Mobil)',
        },
        {
          name: 'rating',
          type: 'select',
          required: true,
          label: 'Rating',
          options: [
            { label: '⭐', value: '1' },
            { label: '⭐⭐', value: '2' },
            { label: '⭐⭐⭐', value: '3' },
            { label: '⭐⭐⭐⭐', value: '4' },
            { label: '⭐⭐⭐⭐⭐', value: '5' },
          ],
        },

        {
          name: 'testimoni',
          type: 'textarea',
          required: true,
          label: 'Testimoni',
        },
        {
          name: 'avatar',
          type: 'upload',
          relationTo: 'media',
          required: false,
          label: 'Avatar',
        },
      ],
    },
  ],
}
