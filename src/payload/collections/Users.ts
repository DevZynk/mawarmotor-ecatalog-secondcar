import type { CollectionConfig } from 'payload'
import { isAdmin, isAdminOrSelf } from '../access'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    group: 'Informasi Pribadi',
  },
  auth: true,
  access: {
    read: isAdminOrSelf,
    create: isAdmin,
    delete: isAdmin,
    update: ({ req: { user }, id }) => {
      if (!user) return false
      if (user.role === '1') return true 
      return user.id === id 
    },
  },

  fields: [
    {
      name: 'name',
      label: 'Nama Lengkap',
      type: 'text',
    },
    {
      name: 'role',
      label: 'Jabatan / Hak Akses',
      type: 'select',
      defaultValue: '3',
      required: true,
      options: [
        { label: 'Administrator', value: '1' },
        { label: 'Manajer', value: '2' },
        { label: 'Staf Lapangan', value: '3' },
      ],

      access: {
        read: () => true,
        update: ({ req: { user }, id }) => {
          if (user?.role !== '1') return false 
          if (user?.id === id) return false 
          return true
        },
      },
    },
  ],
}
