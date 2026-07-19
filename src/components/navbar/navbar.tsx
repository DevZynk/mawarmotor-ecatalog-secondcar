'use client'

import Logo from '../shared/logo'
import SearchModal from './search-modal'
import WishlistButton from './wishlist-button'
import { DesktopMenu, MobileMenu } from './nav-items'
import ThemeButton from './theme-button'

export default function Navbar() {
  return (
    <nav className="w-full h-18 bg-background fixed top-0 left-0 z-40 flex items-center justify-center border-b transition-all duration-200">
      <div className="w-full max-w-6xl flex items-center justify-between px-4">
        <Logo />

        <div className="hidden md:flex">
          <DesktopMenu />
        </div>

        <div className="flex items-center gap-2">
          <SearchModal />
          <WishlistButton />
          <ThemeButton />
          <MobileMenu />
        </div>
      </div>
    </nav>
  )
}
