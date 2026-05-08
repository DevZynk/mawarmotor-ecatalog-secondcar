'use client'

import React from 'react'
import Link from 'next/link'
import { Activity } from 'lucide-react'
import { usePathname } from 'next/navigation'

import { useAuth } from '@payloadcms/ui'

export default function AnalyticNavLink() {
  const { user } = useAuth()
  const pathname = usePathname()
  const isActive = pathname === '/admin'

  if (!user || user.role === '3') return null

  return (
    <div style={{ width: '100%', marginBottom: '10px' }}>
      <Link href="/admin/" style={{ textDecoration: 'none', color: 'inherit' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            flex: 'row',
            width: '100%',
            padding: '10px 16px',
            borderRadius: '4px',
            backgroundColor: isActive ? 'var(--theme-elevation-100)' : 'transparent',
            color: isActive ? 'var(--theme-text)' : 'var(--theme-text-light)',
            transition: 'all 0.2s',
            fontWeight: isActive ? 600 : 400,
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => {
            if (!isActive) {
              e.currentTarget.style.backgroundColor = 'var(--theme-elevation-50)'
              e.currentTarget.style.color = 'var(--theme-text)'
            }
          }}
          onMouseLeave={(e) => {
            if (!isActive) {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.color = 'var(--theme-text-light)'
            }
          }}
        >
          <Activity size={18} />
          <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Analitik</span>
        </div>
      </Link>
    </div>
  )
}
