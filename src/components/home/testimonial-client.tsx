'use client'

import { useState } from 'react'
import { StarIcon, CaretLeftIcon, CaretRightIcon, QuotesIcon } from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'motion/react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import _ from 'lodash'

export default function TestimonialClient({ reviews }: any) {
  const [current, setCurrent] = useState(0)

  const t = reviews[current]

  const prev = () => setCurrent((c) => (c === 0 ? reviews.length - 1 : c - 1))

  const next = () => setCurrent((c) => (c === reviews.length - 1 ? 0 : c + 1))

  return (
    <section id="reviewSection">
      <div className="relative rounded-xl border bg-card p-6 md:p-8 max-w-2xl mx-auto overflow-hidden">
        <QuotesIcon size={40} weight="fill" className="absolute top-4 right-4 text-primary/10" />

        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {/* ⭐ Stars */}
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <StarIcon
                  key={i}
                  size={16}
                  weight="fill"
                  className={i < Number(t?.rating ?? 5) ? 'text-yellow-500' : 'text-muted'}
                />
              ))}
            </div>

            <p className="italic">&ldquo;{t?.testimoni}&rdquo;</p>

            <div className="flex items-center gap-3 mt-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src={t?.avatar?.url} alt={t?.name} />
                <AvatarFallback>{t?.name?.charAt(0)}</AvatarFallback>
              </Avatar>

              <div>
                <p className="font-semibold text-sm">{t?.name}</p>
                <p className="text-xs text-muted-foreground">Pembeli {_.startCase(t?.product)}</p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* NAVIGATION */}
        <div className="flex justify-between mt-6">
          <button onClick={prev}>
            <CaretLeftIcon />
          </button>

          <button onClick={next}>
            <CaretRightIcon />
          </button>
        </div>
      </div>
    </section>
  )
}
