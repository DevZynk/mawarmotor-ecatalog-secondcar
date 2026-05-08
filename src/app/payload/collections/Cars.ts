import type { CollectionConfig } from 'payload'
import slugify from 'slugify'
import breakpoint from '../breakpoints'
import { isManagerOrAbove } from '../access'

export const Cars: CollectionConfig = {
  slug: 'cars',

  labels: {
    singular: 'Mobil Bekas',
    plural: 'Mobil Bekas',
  },
  admin: {
    useAsTitle: 'title',
    group: 'Konten',
    livePreview: {
      url: ({ data }) => `/cars/${data?.slug || ''}`,
      breakpoints: [...breakpoint],
    },
  },
  access: {
    read: () => true,
    create: isManagerOrAbove,
    update: isManagerOrAbove,
    delete: isManagerOrAbove,
  },

  fields: [
    {
      name: 'title',
      label: 'Nama Mobil',
      type: 'text',
      required: true,
    },
    {
      name: 'plateNumber',
      label: 'Nomor Polisi',
      type: 'text',
      required: true,
    },
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
    {
      name: 'carSpecification',
      type: 'group',
      fields: [
        {
          name: 'engine',
          label: 'Kapasitas Mesin (CC)',
          type: 'number',
          required: true,
        },
        {
          name: 'passenger',
          label: 'Jumlah Penumpang (Orang)',
          type: 'number',
          defaultValue: 5,
          required: true,
        },
        {
          name: 'transmission',
          label: 'Jenis Transmisi',
          type: 'select',
          required: true,
          defaultValue: 'manual',
          options: [
            { label: 'Manual', value: 'manual' },
            { label: 'Automatic (AT)', value: 'at' },
            { label: 'CVT (Automatic)', value: 'cvt' },
            { label: 'DCT (Automatic)', value: 'dct' },
            { label: 'AMT (Automatic)', value: 'amt' },
          ],
        },
        {
          name: 'fuel',
          label: 'Jenis Bahan Bakar',
          type: 'select',
          required: true,
          defaultValue: 'bensin',
          options: [
            { label: 'Bensin', value: 'bensin' },
            { label: 'Solar', value: 'solar' },
            { label: 'Listrik', value: 'listrik' },
            { label: 'Hybrid', value: 'hybrid' },
          ],
        },
        {
          name: 'color',
          label: 'Warna Kendaraan',
          type: 'text',
          required: true,
        },
        {
          name: 'odometer',
          label: 'Jarak Tempuh (KM)',
          type: 'number',
          required: true,
        },
        {
          name: 'registrationYear',
          label: 'Tahun Registrasi',
          type: 'number',
          required: true,
          min: 1900,
          max: new Date().getFullYear(),
        },
        {
          name: 'buildYear',
          label: 'Tahun Perakitan',
          type: 'number',
          required: true,
          min: 1900,
          max: new Date().getFullYear(),
        },
      ],
    },
    {
      name: 'gallery',
      type: 'array',
      label: 'Galeri Foto',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'carsgallery',
          required: true,
        },
        {
          name: 'tag',
          type: 'select',
          options: [
            { label: 'Eksterior', value: 'exterior' },
            { label: 'Interior', value: 'interior' },
            { label: 'Mesin', value: 'engine' },
          ],
        },
        {
          name: 'isPrimary',
          type: 'checkbox',
          label: 'Foto Utama (Card)',
        },
        {
          name: 'isFeatured',
          type: 'checkbox',
          label: 'Tampilkan di depan',
        },
      ],
    },
    {
      name: 'features',
      label: 'Fitur kendaraan',
      type: 'array',
      fields: [
        {
          name: 'feature',
          type: 'text',
          maxLength: 100,
        },
      ],
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      admin: {
        hidden: true,
      },
      hooks: {
        beforeValidate: [
          async ({ value, data, req }) => {
            if (value) return value

            if (!data?.title) return value

            let baseSlug = slugify(data.title, {
              lower: true,
              strict: true,
            })

            let slug = baseSlug
            let counter = 1

            const existing = await req.payload.find({
              collection: 'cars',
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
    {
      name: 'description',
      label: 'Deskripsi',
      type: 'textarea',
      required: true,
    },
    {
      name: 'analytics',
      label: 'Analitik & Keuangan',
      type: 'group',
      admin: {
        position: 'sidebar',
      },
      fields: [
        {
          name: 'status',
          type: 'select',
          defaultValue: 'available',
          options: [
            { label: 'Tersedia', value: 'available' },
            { label: 'Dipesan', value: 'booked' },
            { label: 'Terjual', value: 'sold' },
          ],
          required: true,
          hooks: {
            afterChange: [
              async ({ data, req, value }) => {
                if (value === 'sold') {
                  const currentSoldDate = data?.analytics?.soldDate
                  if (!currentSoldDate) {
                    await req.payload.update({
                      collection: 'cars',
                      id: data?.id,
                      data: {
                        analytics: {
                          ...(data?.analytics || {}),
                          soldDate: new Date().toISOString(),
                        },
                      },
                    })
                  }
                } else if (value === 'available' || value === 'booked') {
                  await req.payload.update({
                    collection: 'cars',
                    id: data?.id,
                    data: {
                      analytics: {
                        ...(data?.analytics || {}),
                        soldDate: null,
                      },
                    },
                  })
                }
              },
            ],
          },
        },
        {
          name: 'purchasePrice',
          label: 'Harga Beli (IDR)',
          type: 'number',
          required: true,
          defaultValue: 0,
        },
        {
          name: 'purchaseDate',
          label: 'Tanggal Beli',
          type: 'date',
          admin: {
            date: {
              pickerAppearance: 'dayOnly',
            },
          },
        },
        {
          name: 'soldPrice',
          label: 'Harga Terjual (IDR)',
          type: 'number',
          defaultValue: 0,
        },
        {
          name: 'repairs',
          label: 'Daftar Perbaikan (Repair)',
          type: 'array',
          fields: [
            {
              name: 'description',
              label: 'Deskripsi Perbaikan',
              type: 'text',
              required: true,
            },
            {
              name: 'cost',
              label: 'Biaya (IDR)',
              type: 'number',
              required: true,
              defaultValue: 0,
            },
          ],
        },
        {
          name: 'operationalCosts',
          label: 'Biaya Operasional (Servis/Maintenance)',
          type: 'array',
          fields: [
            {
              name: 'description',
              label: 'Deskripsi Biaya',
              type: 'text',
              required: true,
            },
            {
              name: 'cost',
              label: 'Biaya (IDR)',
              type: 'number',
              required: true,
              defaultValue: 0,
            },
          ],
        },
        {
          name: 'soldDate',
          label: 'Tanggal Terjual',
          type: 'date',
          admin: {
            date: {
              pickerAppearance: 'dayOnly',
            },
          },
        },
      ],
    },
    {
      name: 'price',
      label: 'Harga Jual (IDR)',
      type: 'number',
      required: true,
    },

    {
      name: 'financing',
      label: 'Skema Pembiayaan',
      type: 'group',
      fields: [
        {
          name: 'downPaymentMin',
          label: 'Uang Muka Minimum',
          type: 'number',
          required: true,
        },
        {
          name: 'leasing',
          label: 'Pembiayaan',
          type: 'array',
          fields: [
            {
              name: 'provider',
              label: 'Leasing',
              type: 'text',
              required: true,
            },
            {
              name: 'interestRate',
              label: 'Bunga (% per tahun)',
              type: 'number',
              required: true,
            },
            {
              name: 'tenorMonths',
              label: 'Jangka Waktu',
              type: 'select',
              hasMany: true,
              required: true,
              options: [
                { label: '12 Bulan', value: '12' },
                { label: '24 Bulan', value: '24' },
                { label: '36 Bulan', value: '36' },
                { label: '48 Bulan', value: '48' },
                { label: '60 Bulan', value: '60' },
              ],
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }: { data: any }) => {
        // Validasi tahun
        if (data.carSpecification?.buildYear > data.carSpecification?.registrationYear) {
          throw new Error('Tahun perakitan tidak boleh lebih baru dari tahun registrasi')
        }

        // Validasi isFeatured maks 9
        const featuredCount = data?.gallery?.filter((item: any) => item.isFeatured).length || 0
        if (featuredCount > 9) {
          throw new Error('Maksimal hanya 9 gambar untuk ditampilkan di depan')
        }

        // Validasi isPrimary tepat 1
        const primaryCount = data?.gallery?.filter((item: any) => item.isPrimary).length || 0
        if (primaryCount > 1) {
          throw new Error('Hanya boleh 1 foto utama (isPrimary)')
        }

        return data
      },
    ],
    afterChange: [
      async ({ doc, previousDoc, req }) => {
        const payload = req.payload

        const updateCount = async (collection: string, field: string, value: any) => {
          if (!value) return

          const count = await payload.count({
            collection: 'cars',
            where: {
              [field]: { equals: value },
              'analytics.status': { equals: 'available' },
            },
          })

          await payload.update({
            collection: collection as any,
            id: value,
            data: {
              count: count.totalDocs,
            },
          })
        }

        // 🔥 brand
        await updateCount('carBrands', 'carBrand', doc.carBrand)

        if (previousDoc?.carBrand && previousDoc.carBrand !== doc.carBrand) {
          await updateCount('carBrands', 'carBrand', previousDoc.carBrand)
        }

        // 🔥 type
        await updateCount('carTypes', 'carType', doc.carType)

        if (previousDoc?.carType && previousDoc.carType !== doc.carType) {
          await updateCount('carTypes', 'carType', previousDoc.carType)
        }
      },
    ],
    afterDelete: [
      async ({ doc, req }) => {
        const payload = req.payload

        const update = async (collection: string, field: string, value: any) => {
          if (!value) return

          const count = await payload.count({
            collection: 'cars',
            where: {
              [field]: { equals: value },
              'analytics.status': { equals: 'available' },
            },
          })

          await payload.update({
            collection: collection as any,
            id: value,
            data: {
              count: count.totalDocs,
            },
          })
        }

        await update('carBrands', 'carBrand', doc.carBrand)
        await update('carTypes', 'carType', doc.carType)
      },
    ],
  },
}

export const CarBrands: CollectionConfig = {
  slug: 'carBrands',
  labels: {
    singular: 'Merek Mobil',
    plural: 'Daftar Merek',
  },
  admin: {
    useAsTitle: 'title',
    hidden: true,
  },
  fields: [
    {
      name: 'title',
      label: 'Nama Merek',
      type: 'text',
      unique: true,
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (value) return value
            if (data?.title) {
              return slugify(data.title, { lower: true, strict: true })
            }
            return value
          },
        ],
      },
    },
    {
      name: 'icon',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'count',
      type: 'number',
      defaultValue: 0,
      admin: {
        readOnly: true,
      },
    },
  ],
}

export const CarTypes: CollectionConfig = {
  slug: 'carTypes',
  labels: {
    singular: 'Tipe Mobil',
    plural: 'Daftar Tipe',
  },
  admin: {
    useAsTitle: 'title',
    hidden: true,
  },
  fields: [
    {
      name: 'title',
      label: 'Nama Tipe',
      type: 'text',
      unique: true,
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (value) return value
            if (data?.title) {
              return slugify(data.title, { lower: true, strict: true })
            }
            return value
          },
        ],
      },
    },
    {
      name: 'icon',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'count',
      type: 'number',
      defaultValue: 0,
      admin: {
        readOnly: true,
      },
    },
  ],
}
