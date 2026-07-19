'use client'

import { useState, useEffect } from 'react'
import { MagnifyingGlassIcon } from '@phosphor-icons/react'
import Logo from '../shared/logo'
import SearchModal from './search-modal'
import WishlistButton from './wishlist-button'
import { DesktopMenu, MobileMenu } from './nav-items'
import ThemeButton from './theme-button'

export default function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  return (
    <>
      <nav className="w-full h-18 bg-background fixed top-0 left-0 z-40 flex items-center justify-center border-b transition-all duration-200">
        <div className="w-full max-w-6xl flex items-center justify-between px-4">
          <Logo />

          <div className="hidden md:flex">
            <DesktopMenu />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              className="inline-flex shrink-0 items-center justify-center rounded-full border border-border bg-background hover:bg-muted hover:text-foreground size-9 transition-all outline-none"
              aria-label="Cari mobil (Ctrl+K)"
            >
              <MagnifyingGlassIcon size={18} />
            </button>

            <WishlistButton />
            <ThemeButton />
            <MobileMenu />
          </div>
        </div>
      </nav>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
