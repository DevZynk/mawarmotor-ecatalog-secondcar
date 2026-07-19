'use'
import { getPayloadClient } from '@/lib/payload'

export default async function AdminLogo() {
  const payload = await getPayloadClient()
  const site = await payload.findGlobal({
    slug: 'site',
  })

  const logoUrl = typeof site.logo === 'object' ? site.logo?.url : null

  if (!logoUrl) {
    return (
      <div style={{ padding: '10px 0', textAlign: 'center' }}>
        <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>
          {site.siteName || 'Mawar Motor'}
        </h2>
      </div>
    )
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px',
        padding: '20px 0',
      }}
    >
     {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={logoUrl}
        alt={site.siteName}
        style={{
          width: '90px',
          height: '90px',
          borderRadius: '50%',
          objectFit: 'cover',
          border: '2px solid var(--theme-border)',
        }}
      />
      <h3
        style={{
          margin: 0,
          fontSize: '20px',
          fontWeight: 'bold',
          color: 'var(--theme-text)',
        }}
      >
        {site.siteName}
      </h3>
    </div>
  )
}
