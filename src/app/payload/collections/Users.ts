import type { CollectionConfig } from 'payload'

import { isAdmin, isAdminField, isAdminOrSelf } from '../access'

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
    update: isAdminOrSelf,
    delete: isAdmin,
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
      defaultValue: '2',
      required: true,
      access: {
        update: isAdminField, // Only admins can change roles
      },
      options: [
        { label: 'Administrator', value: '1' },
        { label: 'Manajer', value: '2' },
        { label: 'Staf Lapangan', value: '3' },
      ],
    },
  ],
}
