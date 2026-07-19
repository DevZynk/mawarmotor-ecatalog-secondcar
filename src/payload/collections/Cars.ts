import { APIError, type CollectionConfig } from 'payload'
import slugify from 'slugify'
import breakpoint from '../breakpoints'
import { isAdmin, isManagerOrAbove } from '../access'

class CustomAPIError extends APIError {
  constructor(message: string) {
    super(message, 400, undefined, true)
  }
}

const Error = (message: string) => new CustomAPIError(message)
export const Cars: CollectionConfig = {
  slug: 'cars',
  trash: true,
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
      name: 'carBrand',
      label: 'Merek Kendaraan',
      type: 'relationship',
      relationTo: 'carBrands',
      required: true,
    },
    {
      name: 'carType',
      label: 'Jenis Mobil',
      type: 'relationship',
      relationTo: 'carTypes',
      required: true,
    },
    {
      name: 'carSpecification',
      type: 'group',
      required: true,
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
      name: 'cardthumbnail',
      label: 'Foto Depan (Card)',
      type: 'upload',
      relationTo: 'carsgallery',
      hasMany: false,
      admin: {
        description: 'Foto utama untuk Card (Rasio foto 4:3 )',
      },
      required: true,
    },
    {
      name: 'gallery',
      type: 'array',
      label: 'Galeri Foto',
      admin: {
        description: 'Galeri foto harus diisi Minimal 9 foto. Rasio foto harus 16:9',
      },
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
          required: true,
          options: [
            { label: 'Eksterior', value: 'exterior' },
            { label: 'Interior', value: 'interior' },
            { label: 'Mesin', value: 'engine' },
          ],
        },
        {
          name: 'isSlideshow',
          type: 'checkbox',
          label: 'Tampilkan di Slideshow',
        },
      ],
    },
    {
      name: 'features',
      label: 'Fitur kendaraan',
      required: true,
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
          type: 'radio',
          defaultValue: 'available',
          required: true,

          options: [
            { label: 'Tersedia', value: 'available' },
            { label: 'Dipesan', value: 'booked' },
            { label: 'Terjual', value: 'sold' },
          ],
          hooks: {
            afterChange: [
              async ({ data, req, value, context }) => {
                if (context?.skipStatusHook) return

                if (value === 'sold') {
                  const currentSoldDate = data?.analytics?.soldDate
                  if (!currentSoldDate) {
                    await req.payload.update({
                      collection: 'cars',
                      where: { id: data?.id },
                      data: {
                        analytics: {
                          ...(data?.analytics || {}),
                          soldDate: new Date().toISOString(),
                        },
                      },
                      context: { skipStatusHook: true }, // ✅ pass flag
                    })
                  }
                } else if (value === 'available' || value === 'booked') {
                  // ✅ Hanya update jika soldDate memang belum null
                  if (
                    data?.analytics?.soldDate !== null &&
                    data?.analytics?.soldDate !== undefined
                  ) {
                    await req.payload.update({
                      collection: 'cars',
                      where: { id: data?.id },
                      data: {
                        analytics: {
                          ...(data?.analytics || {}),
                          soldDate: null,
                        },
                      },
                      context: { skipStatusHook: true },
                    })
                  }
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
          required: true,
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
          admin: {
            condition: (_, siblingData) => siblingData?.status === 'sold',
          },
        },
        {
          name: 'soldDate',
          label: 'Tanggal Terjual',
          type: 'date',
          admin: {
            condition: (_, siblingData) => siblingData?.status === 'sold',

            date: {
              pickerAppearance: 'dayOnly',
            },
          },
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
          name: 'ownership',
          label: 'Data Kepemilikan',
          type: 'group',
          fields: [
            {
              name: 'ownershipType',
              label: 'Jenis Kepemilikan',
              type: 'radio',
              required: true,
              defaultValue: 'dealer',
              options: [
                {
                  label: 'Stok Dealer',
                  value: 'dealer',
                },
                {
                  label: 'Titipan / Perorangan',
                  value: 'personal',
                },
              ],
            },

            // =========================
            // DATA PEMILIK
            // =========================

            {
              name: 'personalOwner',
              label: 'Data Pemilik / Pemilik Sebelumnya',
              type: 'group',
              fields: [
                {
                  name: 'name',
                  label: 'Nama',
                  type: 'text',
                  required: true,
                },

                {
                  name: 'phone',
                  label: 'Nomor Telepon',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'nik',
                  label: 'Nomor Induk Kependudukan (NIK)',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'address',
                  label: 'Alamat / Domisili',
                  type: 'textarea',
                  required: true,
                },
              ],
            },

            // =========================
            // DATA STNK
            // =========================

            {
              name: 'stnkName',
              label: 'Nama di STNK',
              type: 'text',
              required: true,
            },
            {
              name: 'plateNumber',
              label: 'Nomor Polisi',
              type: 'text',
              required: true,
            },
            // =========================
            // TANGAN KE
            // =========================

            {
              name: 'handOwnership',
              label: 'Mobil Tangan Ke',
              type: 'number',
              required: true,
              min: 1,
              defaultValue: 1,
              admin: {
                description: 'Contoh: tangan pertama = 1',
              },
            },
          ],
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
      required: true,
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
          required: true,
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
                { label: '11 Bulan', value: '11' },
                { label: '23 Bulan', value: '23' },
                { label: '35 Bulan', value: '35' },
                { label: '47 Bulan', value: '47' },
                { label: '59 Bulan', value: '59' },
                { label: '71 Bulan', value: '71' },
                { label: '83 Bulan', value: '83' },
                { label: '95 Bulan', value: '95' },
                { label: '119 Bulan', value: '119' },
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
          Error('Tahun perakitan tidak boleh lebih baru dari tahun registrasi')
        }

        // Validasi isFeatured maks 9
        const featuredCount = data?.gallery?.filter((item: any) => item.isFeatured).length || 0
        if (featuredCount > 9) {
          Error('Maksimal hanya 9 gambar untuk ditampilkan di depan')
        }

        // Validasi isPrimary tepat 1
        const primaryCount = data?.gallery?.filter((item: any) => item.isPrimary).length || 0
        if (primaryCount > 1) {
          Error('Hanya boleh 1 foto utama (isPrimary)')
        }

        return data
      },
    ],
    afterDelete: [
      async ({ doc, req }) => {
        const payload = req.payload

        // =========================
        // GALLERY & THUMBNAIL CASCADE DELETE
        // =========================

        const galleryIds: string[] = []

        // Tambahkan cardthumbnail
        if (doc.cardthumbnail) {
          galleryIds.push(
            typeof doc.cardthumbnail === 'object' ? doc.cardthumbnail.id : doc.cardthumbnail,
          )
        }

        // Tambahkan semua gambar dari gallery
        if (Array.isArray(doc.gallery)) {
          doc.gallery.forEach((item: any) => {
            if (item.image) {
              galleryIds.push(typeof item.image === 'object' ? item.image.id : item.image)
            }
          })
        }

        if (galleryIds.length > 0) {
          try {
            await payload.delete({
              collection: 'carsgallery',
              where: {
                id: {
                  in: galleryIds,
                },
              },
            })
          } catch (err) {
            console.error('Gagal menghapus gambar galeri:', err)
          }
        }
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
    hidden: () => !!isAdmin,
  },
  hooks: {
    afterDelete: [
      async ({ doc, req }) => {
        if (doc.icon) {
          const iconId = typeof doc.icon === 'object' ? doc.icon.id : doc.icon
          try {
            await req.payload.delete({
              collection: 'media',
              id: iconId,
            })
          } catch (err) {
            console.error('Gagal menghapus icon merek:', err)
          }
        }
      },
    ],
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
      admin: {
        hidden: true,
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (value) return value
            if (data?.title) {
              return slugify('car-logo-' + data.title, { lower: true, strict: true, trim: true })
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
    hidden: () => !!isAdmin,
  },
  hooks: {
    afterDelete: [
      async ({ doc, req }) => {
        if (doc.icon) {
          const iconId = typeof doc.icon === 'object' ? doc.icon.id : doc.icon
          try {
            await req.payload.delete({
              collection: 'media',
              id: iconId,
            })
          } catch (err) {
            console.error('Gagal menghapus icon tipe mobil:', err)
          }
        }
      },
    ],
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
              return slugify('car-type-' + data.title, { lower: true, strict: true, trim: true })
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
