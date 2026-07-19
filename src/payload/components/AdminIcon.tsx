'use server'
import { getPayloadClient } from '@/lib/payload'

export default async function AdminIcon() {
  const payload = await getPayloadClient()
  const site = await payload.findGlobal({
    slug: 'site',
  })

  const logoUrl = typeof site.logo === 'object' ? site.logo?.url : null
  const siteName = site.siteName || 'Mawar Motor'

  if (!logoUrl) {
    return (
      <div
        style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          background: 'var(--theme-success-500)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          fontSize: '14px',
          color: '#fff',
        }}
      >
        {siteName.charAt(0).toUpperCase()}
      </div>
    )
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={logoUrl}
      alt={siteName}
      style={{
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        objectFit: 'cover',
      }}
    />
  )
}
