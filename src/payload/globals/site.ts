import type { GlobalConfig } from 'payload'
import { isAdmin } from '../access'
export const Site: GlobalConfig = {
  slug: 'site',
  admin: {
    group: 'Pengaturan',
  },

  access: {
    read: isAdmin,
    update: isAdmin,
  },
  fields: [
    {
      name: 'siteName',
      label: 'Nama Situs/Dealer',
      type: 'text',
      required: true,
    },
    {
      name: 'domain',
      label: 'Domain Website (URL)',
      type: 'text',
      required: true,
    },
    {
      name: 'logo',
      label: 'Logo Website',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'location',
      label: 'Kota Lokasi',
      type: 'text',
      required: true,
    },
    {
      name: 'address',
      label: 'Alamat Lengkap',
      type: 'textarea',
      required: true,
    },
    {
      name: 'maps',
      label: 'Link Google Maps Embed/URL',
      type: 'text',
      required: true,
    },

    // 🔹 SOCIAL
    {
      name: 'social',
      label: 'Akun Media Sosial',
      type: 'group',
      fields: [
        { name: 'whatsapp', type: 'text', label: 'Nomor WhatsApp', required: true },
        { name: 'instagram', type: 'text', label: 'Link Instagram', required: true },
        { name: 'tiktok', type: 'text', label: 'Link TikTok', required: true },
        { name: 'facebook', type: 'text', label: 'Link Facebook', required: true },
      ],
    },

    // 🔹 DESCRIPTION
    {
      name: 'shortDescription',
      label: 'Deskripsi Singkat (Footer)',
      type: 'textarea',
      required: true,
    },

    // 🔥 SEO BASIC
    {
      name: 'seo',
      type: 'group',
      fields: [
        {
          name: 'metaTitle',
          type: 'text',
          label: 'Meta Title',
        },
        {
          name: 'metaDescription',
          type: 'textarea',
          label: 'Meta Description',
        },
        {
          name: 'keywords',
          type: 'text',
          label: 'Keywords (pisah dengan koma)',
        },
      ],
    },

    // 🔥 OPEN GRAPH
    {
      name: 'openGraph',
      type: 'group',
      fields: [
        {
          name: 'ogTitle',
          type: 'text',
        },
        {
          name: 'ogDescription',
          type: 'textarea',
        },
        {
          name: 'ogImage',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },

    // 🔥 LOCAL SEO (PENTING BANGET)
    {
      name: 'business',
      label: 'Informasi Bisnis (Local SEO)',
      type: 'group',
      fields: [
        {
          name: 'city',
          label: 'Kota',
          type: 'text',
        },
        {
          name: 'region',
          label: 'Provinsi/Wilayah',
          type: 'text',
        },
        {
          name: 'postalCode',
          label: 'Kode Pos',
          type: 'text',
        },
        {
          name: 'latitude',
          label: 'Garis Lintang (Latitude)',
          type: 'text',
        },
        {
          name: 'longitude',
          label: 'Garis Bujur (Longitude)',
          type: 'text',
        },
      ],
    },

    // 🔥 ADVANCED SEO
    {
      name: 'advancedSEO',
      type: 'group',
      fields: [
        {
          name: 'canonicalUrl',
          type: 'text',
        },
        {
          name: 'robots',
          type: 'select',
          options: [
            { label: 'Index, Follow', value: 'index,follow' },
            { label: 'No Index', value: 'noindex' },
          ],
        },
      ],
    },
  ],
}
