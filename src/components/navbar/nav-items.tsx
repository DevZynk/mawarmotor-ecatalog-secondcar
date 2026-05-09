'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'motion/react'
import {
  CarProfileIcon,
  HeartIcon,
  HouseIcon,
  XIcon,
  ListIcon
} from '@phosphor-icons/react'
import { useState } from 'react'
import { useWishlist } from '@/hooks/use-wishlist'
const navItems = [
  { title: 'Beranda', icon: HouseIcon, href: '/' },
  { title: 'Mobil Bekas', icon: CarProfileIcon, href: '/cars' },
  // { title: 'Rental', icon: SteeringWheelIcon, href: '/rent' },
]

export function DesktopMenu() {
  const pathname = usePathname()

  return (
    <nav aria-label="Navigasi utama">
      <ul className="flex gap-0.5 items-center">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`relative flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <item.icon size={18} weight={isActive ? 'fill' : 'regular'} />
                {item.title}

                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute -bottom-4.5 left-3 right-3 h-[3px] bg-primary rounded-full"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
export function MobileMenu() {
  const [open, setOpen] = useState(false)
  const { count: wishlistCount } = useWishlist()

  return (
    <>
      {/* Hamburger button */}
      <button
        onClick={() => setOpen(true)}
        className="inline-flex shrink-0 items-center justify-center rounded-full border border-border bg-background hover:bg-muted size-9 transition-all outline-none md:hidden"
        aria-label="Buka menu navigasi"
      >
        <ListIcon size={18} />
      </button>

      {/* Overlay + Slide menu */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-100 bg-black/40 backdrop-blur-sm md:hidden"
              onClick={() => setOpen(false)}
            />

            {/* Side panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 z-101 w-72 bg-background border-l shadow-xl md:hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 h-16 border-b">
                <span className="text-sm font-semibold">Menu</span>
                <button
                  onClick={() => setOpen(false)}
                  className="p-1.5 rounded-full hover:bg-muted transition"
                  aria-label="Tutup menu"
                >
                  <XIcon size={18} />
                </button>
              </div>

              {/* Nav items */}
              <nav aria-label="Menu navigasi mobile">
                <ul className="p-3 space-y-1">
                  {navItems.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-muted transition"
                      >
                        <item.icon size={20} className="text-muted-foreground" />
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Tools section */}
              <div className="px-6 pt-4 border-t mx-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Tools
                </p>
                <ul className="space-y-1">
                  <li>
                    <Link
                      href="/wishlist"
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-between px-3 py-2 text-sm text-foreground hover:bg-muted rounded-lg transition"
                    >
                      <span className="flex items-center gap-2">
                        <HeartIcon size={18} className="text-muted-foreground" />
                        Wishlist
                      </span>
                      {wishlistCount > 0 && (
                        <span className="min-w-[20px] h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center px-1.5">
                          {wishlistCount}
                        </span>
                      )}
                    </Link>
                  </li>
                </ul>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
