'use client'

import { Button } from '@/components/ui/button'
import { MoonIcon, SunIcon } from '@phosphor-icons/react'
import { AnimatePresence, motion } from 'motion/react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

const ThemeButton = ({ className }: { className?: string }) => {
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Wait until client-side to avoid server/client mismatch
  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true)
    }, 0)
    return () => clearTimeout(timer)
  }, [])

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }

  const isDark = resolvedTheme === 'dark'

  if (!mounted) {
    // render placeholder button to prevent layout shift and FOUC
    return (
      <Button
        variant="ghost"
        size="icon"
        className={className}
        aria-label="Toggle theme"
        disabled
      >
        <div className="h-5 w-5" />
      </Button>
    )
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={isDark ? 'dark' : 'light'}
        initial={{ opacity: 0, rotate: -45, scale: 0.9 }}
        animate={{ opacity: 1, rotate: 0, scale: 1 }}
        exit={{ opacity: 0, rotate: 45, scale: 0.9 }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
        className="inline-flex"
      >
        <Button
          onClick={toggleTheme}
          variant="ghost"
          size="icon"
          className={className}
          aria-label="Toggle theme"
        >
          {isDark ? (
            <SunIcon className="h-5 w-5 text-yellow-500" />
          ) : (
            <MoonIcon className="h-5 w-5 text-foreground" />
          )}
        </Button>
      </motion.div>
    </AnimatePresence>
  )
}

export default ThemeButton
