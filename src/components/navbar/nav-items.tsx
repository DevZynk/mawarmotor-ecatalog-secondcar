'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'motion/react'
import { CarProfileIcon, HeartIcon, HouseIcon, XIcon, ListIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { useWishlist } from '@/hooks/use-wishlist'
import { Button } from '../ui/button'

const navItems = [
  { title: 'Beranda', icon: HouseIcon, href: '/' },
  { title: 'Mobil Bekas', icon: CarProfileIcon, href: '/cars' },
]

export function DesktopMenu() {
  const pathname = usePathname()
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <nav aria-label="Navigasi utama">
      <ul className="flex gap-1 items-center">
        {navItems.map((item, index) => {
          const isActive =
            pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))

          return (
            <li key={item.href} className="relative">
              <Link
                href={item.href}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`relative flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg transition-colors duration-200 ${
                  isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                {/* Hover Background Capsule */}
                <AnimatePresence>
                  {hoveredIndex === index && (
                    <motion.div
                      layoutId="hover-capsule"
                      className="absolute inset-0 bg-muted/60 rounded-lg"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                </AnimatePresence>

                <span className="relative z-10 flex items-center gap-1.5">
                  <item.icon size={18} weight={isActive ? 'fill' : 'regular'} />
                  {item.title}
                </span>

                {/* Active Indicator Underline */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute -bottom-5 left-4 right-4 h-[4px] bg-primary rounded-full"
                      initial={{ opacity: 0, scaleX: 0 }}
                      animate={{ opacity: 1, scaleX: 1 }}
                      exit={{ opacity: 0, scaleX: 0 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </AnimatePresence>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, x: 20 },
  show: { opacity: 1, x: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 25 } },
}

export function MobileMenu() {
  const [open, setOpen] = useState(false)
  const { count: wishlistCount } = useWishlist()

  return (
    <>
      {/* Hamburger button */}
      <Button
        onClick={() => setOpen(true)}
        variant={'ghost'}
        size={'icon-lg'}
        className='md:hidden'
        aria-label="Buka menu navigasi"
      >
        <ListIcon size={18} />
      </Button>

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
                <motion.ul
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  className="p-3 space-y-1"
                >
                  {navItems.map((item) => (
                    <motion.li key={item.href} variants={itemVariants}>
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-muted transition"
                      >
                        <item.icon size={20} className="text-muted-foreground" />
                        {item.title}
                      </Link>
                    </motion.li>
                  ))}
                </motion.ul>
              </nav>

              {/* Tools section */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="px-6 pt-4 border-t mx-3"
              >
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
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
