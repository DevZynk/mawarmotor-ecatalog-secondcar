'use client'

import Link from 'next/link'
import { LogOut } from 'lucide-react'
import { useAuth } from '@payloadcms/ui'

export default function LogoutButton() {
  const { user } = useAuth()

  if (!user) return null

  return (
    <div 
      className="logout-nav-item"
      style={{ width: '100%' }}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        @media (min-width: 768px) {
          .logout-nav-item {
            display: none !important;
          }
        }
      ` }} />
      <Link href="/admin/logout" style={{ textDecoration: 'none', color: 'inherit' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            width: '100%',
            padding: '10px 16px',
            borderRadius: '4px',
            backgroundColor: 'transparent',
            color: 'var(--theme-text-light)',
            transition: 'all 0.2s',
            fontWeight: 400,
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--theme-elevation-50)'
            e.currentTarget.style.color = 'var(--theme-text)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent'
            e.currentTarget.style.color = 'var(--theme-text-light)'
          }}
        >
          <LogOut size={18} />
          <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Keluar</span>
        </div>
      </Link>
    </div>
  )
}
