import type { GlobalConfig } from 'payload'
import breakpoint from '../breakpoints'
import { isAdmin } from '../access'

export const Advantage: GlobalConfig = {
  slug: 'advantage',
  admin: {
    group: 'Beranda',
    description: 'Bagian advantages di halaman utama',
    livePreview: {
      url: '/#advantageSection',
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
      name: 'advantages',
      type: 'array',
      label: 'Daftar Keunggulan',
      required: true,
      minRows: 3,
      maxRows: 9,
      admin: {
        description: 'Minimal 3 dan maksimal 9 keunggulan',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          label: 'Judul',
        },
        {
          name: 'desc',
          type: 'text',
          required: true,
          label: 'Deskripsi',
        },
        {
          name: 'icon',
          type: 'text',
          required: true,
          label: 'Icon',
          admin: {
            description: `
            Cara memilih icon:
            1. Buka https://phosphoricons.com
            2. Pilih tab "React"
            3. Cari icon yang diinginkan
            4. Copy nama icon (tanpa kata "Icon")

            Contoh:
            <AddressBookTabsIcon /> → isi: AddressBookTabs
            <CarIcon /> → isi: Car
            <HeartIcon /> → isi: Heart
            `,
          },
        },
      ],
    },
  ],
}
