import type { CollectionConfig } from 'payload'
import slugify from 'slugify'

export const Rents: CollectionConfig = {
  slug: 'rents',

  labels: {
    singular: 'Unit Sewa',
    plural: 'Daftar Penyewaan',
  },
  admin: {
    useAsTitle: 'title',
    hidden: true
  },

  access: {
    read: () => true,
  },

  fields: [
    // ─────────────────────────────
    // BASIC INFO
    // ─────────────────────────────
    {
      name: 'title',
      label: 'Nama Mobil',
      type: 'text',
      required: true,
    },

    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      hooks: {
        beforeValidate: [
          async ({ value, data, req }) => {
            if (value) return value
            if (!data?.title) return value

            const baseSlug = slugify(data.title, {
              lower: true,
              strict: true,
            })

            let slug = baseSlug
            let counter = 1

            const existing = await req.payload.find({
              collection: 'rents',
              where: {
                slug: {
                  like: `${baseSlug}%`,
                },
              },
              limit: 100,
            })

            const slugs = existing.docs.map((d) => d.slug)

            while (slugs.includes(slug)) {
              slug = `${baseSlug}-${counter}`
              counter++
            }

            return slug
          },
        ],
      },
    },

    // ─────────────────────────────
    // RELATION
    // ─────────────────────────────
    {
      name: 'carBrand',
      label: 'Merek Kendaraan',
      type: 'relationship',
      relationTo: 'carBrands',
    },

    {
      name: 'carType',
      label: 'Jenis Mobil',
      type: 'relationship',
      relationTo: 'carTypes',
    },

    // ─────────────────────────────
    // RENT TYPE
    // ─────────────────────────────
    {
      name: 'rentalType',
      label: 'Tipe Sewa',
      type: 'select',
      defaultValue: 'lepas_kunci',
      options: [
        { label: 'Lepas Kunci', value: 'lepas_kunci' },
        { label: 'Dengan Sopir', value: 'with_driver' },
      ],
    },

    // ─────────────────────────────
    // STATUS (FIXED)
    // ─────────────────────────────
    {
      name: 'status',
      type: 'select',
      required: true,
      options: [
        { label: 'Tersedia', value: 'available' },
        { label: 'Sedang Disewa', value: 'rented' },
        { label: 'Sedang Servis', value: 'service' },
      ],
    },

    // ─────────────────────────────
    // PRICE SYSTEM
    // ─────────────────────────────
    {
      name: 'pricing',
      label: 'Harga Sewa',
      type: 'group',
      fields: [
        { name: 'daily', type: 'number', label: 'Harian' },
        { name: 'weekly', type: 'number', label: 'Mingguan' },
        { name: 'monthly', type: 'number', label: 'Bulanan' },
        { name: 'yearly', type: 'number', label: 'Tahunan' },
      ],
    },

    // ─────────────────────────────
    // AVAILABILITY (IMPORTANT)
    // ─────────────────────────────
    {
      name: 'availability',
      label: 'Ketersediaan',
      type: 'group',
      fields: [
        {
          name: 'nextAvailableDate',
          label: 'Tanggal Tersedia Berikutnya',
          type: 'date',
        },
        {
          name: 'estimatedDays',
          label: 'Estimasi Hari Lagi',
          type: 'number',
        },
      ],
    },

    // ─────────────────────────────
    // BOOKING SYSTEM
    // ─────────────────────────────
    {
      name: 'bookings',
      label: 'Riwayat Sewa',
      type: 'array',
      fields: [
        {
          name: 'customerName',
          label: 'Nama Pelanggan',
          type: 'text',
        },
        {
          name: 'startDate',
          label: 'Tanggal Mulai',
          type: 'date',
          required: true,
        },
        {
          name: 'endDate',
          label: 'Tanggal Selesai',
          type: 'date',
          required: true,
        },
        {
          name: 'status',
          type: 'select',
          options: [
            { label: 'Aktif', value: 'active' },
            { label: 'Selesai', value: 'completed' },
            { label: 'Dibatalkan', value: 'cancelled' },
          ],
          defaultValue: 'active',
        },
      ],
    },

    // ─────────────────────────────
    // SPECIFICATION
    // ─────────────────────────────
    {
      name: 'carSpecification',
      type: 'group',
      fields: [
        { name: 'engine', label: 'Kapasitas Mesin (CC)', type: 'number', required: true },
        { name: 'passenger', label: 'Jumlah Penumpang', type: 'number', defaultValue: 5 },
        {
          name: 'transmission',
          label: 'Transmisi',
          type: 'select',
          options: [
            { label: 'Manual', value: 'manual' },
            { label: 'Otomatis (AT)', value: 'at' },
            { label: 'CVT', value: 'cvt' },
            { label: 'DCT', value: 'dct' },
            { label: 'AMT', value: 'amt' },
          ],
          required: true,
        },
        {
          name: 'fuel',
          label: 'Bahan Bakar',
          type: 'select',
          options: [
            { label: 'Bensin', value: 'bensin' },
            { label: 'Solar', value: 'solar' },
            { label: 'Listrik', value: 'listrik' },
            { label: 'Hybrid', value: 'hybrid' },
          ],
          required: true,
        },
        { name: 'color', label: 'Warna', type: 'text' },
        { name: 'registrationYear', label: 'Tahun Registrasi', type: 'number' },
        { name: 'buildYear', label: 'Tahun Perakitan', type: 'number' },
      ],
    },

    // ─────────────────────────────
    // GALLERY
    // ─────────────────────────────
    {
      name: 'gallery',
      label: 'Galeri Foto',
      type: 'array',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'carsgallery',
        },
        {
          name: 'tag',
          label: 'Kategori',
          type: 'select',
          options: [
            { label: 'Eksterior', value: 'exterior' },
            { label: 'Interior', value: 'interior' },
            { label: 'Mesin', value: 'engine' },
          ],
        },
        {
          name: 'isFeatured',
          label: 'Tampilkan di Halaman Utama',
          type: 'checkbox',
        },
      ],
    },

    // ─────────────────────────────
    // DESCRIPTION
    // ─────────────────────────────
    {
      name: 'description',
      label: 'Deskripsi Lengkap',
      type: 'textarea',
      required: true,
    },
  ],

  // ─────────────────────────────
  // LOGIC HOOKS
  // ─────────────────────────────
  hooks: {
    beforeChange: [
      ({ data }) => {
        // validasi tahun
        if (
          data.carSpecification?.buildYear >
          data.carSpecification?.registrationYear
        ) {
          throw new Error('Tahun perakitan tidak valid')
        }

        // featured image limit
        const featuredCount =
          data?.gallery?.filter((i: any) => i.isFeatured).length || 0

        if (featuredCount > 9) {
          throw new Error('Maksimal 9 featured images')
        }

        // ─────────────────────────────
        // AUTO AVAILABILITY CALCULATION
        // ─────────────────────────────
        const activeBookings = data?.bookings?.filter(
          (b: any) => b.status === 'active'
        )

        if (data.status === 'rented' && activeBookings?.length) {
          const latest = activeBookings.reduce((max: any, b: any) =>
            new Date(b.endDate) > new Date(max.endDate) ? b : max
          )

          const endDate = new Date(latest.endDate)
          const today = new Date()

          const diffDays = Math.ceil(
            (endDate.getTime() - today.getTime()) /
              (1000 * 60 * 60 * 24)
          )

          data.availability = {
            nextAvailableDate: endDate,
            estimatedDays: diffDays > 0 ? diffDays : 0,
          }
        }

        // service mode reset availability
        if (data.status === 'service') {
          data.availability = {
            nextAvailableDate: null,
            estimatedDays: null,
          }
        }

        return data
      },
    ],
    afterDelete: [
      async ({ doc, req }) => {
        const galleryIds: string[] = []

        if (Array.isArray(doc.gallery)) {
          doc.gallery.forEach((item: any) => {
            if (item.image) {
              galleryIds.push(typeof item.image === 'object' ? item.image.id : item.image)
            }
          })
        }

        if (galleryIds.length > 0) {
          try {
            await req.payload.delete({
              collection: 'carsgallery',
              where: {
                id: {
                  in: galleryIds,
                },
              },
            })
          } catch (err) {
            console.error('Gagal menghapus gambar galeri sewa:', err)
          }
        }
      },
    ],
  },
}