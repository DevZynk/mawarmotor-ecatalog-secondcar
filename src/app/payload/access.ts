import type { Access, FieldAccess } from 'payload'

export const isAdmin: Access = ({ req: { user } }) => {
  return Boolean(user && (user.role === '1'))
}


export const isAdminField: FieldAccess = ({ req: { user } }) => {
  return Boolean(user && (user.role === '1' || user.role === '2'))
}

export const isManagerOrAbove: Access = ({ req: { user } }) => {
  return Boolean(user && (user.role === '1' || user.role === '2'))
}

export const isStaff: Access = ({ req: { user } }) => {
  return Boolean(user && user.role === '3')
}

export const isAdminOrSelf: Access = ({ req: { user } }) => {
  if (user) {
    if (user.role === '1' || user.role === '2') return true
    return {
      id: {
        equals: user.id,
      },
    }
  }
  return false
}
