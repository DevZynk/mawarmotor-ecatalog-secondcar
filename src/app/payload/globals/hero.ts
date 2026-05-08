import type { GlobalConfig } from 'payload'
import breakpoint from '../breakpoints'
import { isAdmin } from '../access'
export const Hero: GlobalConfig = {
  slug: 'hero',
  admin: {
    group: 'Beranda',
    description: 'Bagian hero di halaman utama',
    livePreview: {
      url:'/#heroSection',
      breakpoints: [...breakpoint],
    },
  },
  access: {
    read: isAdmin,
    update: isAdmin,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Judul',
    },
    {
      name: 'subTitle',
      type: 'text',
      required: true,
      label: 'Sub Judul',
    },
    {
      name: 'whatsappMessage',
      type: 'text',
      required: true,
      label: 'Pesan WhatsApp',
      admin: {
        description: 'Pesan default untuk tombol WhatsApp',
      },
    },

    {
      name: 'advantages',
      type: 'array',
      label: 'Keuntungan',
      required: true,
      minRows: 3,
      maxRows: 3,
      admin: {
        description: '3 item keuntungan',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          label: 'Judul',
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
