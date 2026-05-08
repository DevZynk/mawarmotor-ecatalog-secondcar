'use client'

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import Image from 'next/image'
import Autoplay from 'embla-carousel-autoplay'
import { useRef, useState } from 'react'

type MediaItem = {
  type: 'image' | 'video'
  url: string
  alt?: string
}

interface CarCarouselProps {
  media: MediaItem[]
}

export default function CarCarousel({ media }: CarCarouselProps) {
  const plugin = useRef(Autoplay({ delay: 1000, stopOnInteraction: true }))
  const [api, setApi] = useState<any>()
  const [activeIndex, setActiveIndex] = useState(0)

  if (!media?.length) return null

  return (
    <div className=" relative w-full p-0 overflow-hidden">
      <Carousel
        className="rounded-sm"
        plugins={[plugin.current]}
        opts={{ align: 'center', loop: true }}
        setApi={(embla) => {
          setApi(embla)
          if (!embla) return
          embla.on('select', () => {
            setActiveIndex(embla.selectedScrollSnap())
          })
        }}
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent>
          {media.map((item, idx) => (
            <CarouselItem key={idx}>
              <div className="relative w-full aspect-video overflow-hidden  bg-black">
                {item.type === 'image' ? (
                  <Image
                    src={item.url}
                    alt={item.alt || `media-${idx}`}
                    sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw'
                    fill
                    className="object-cover"
                  />
                ) : (
                  <video src={item.url} controls className="w-full h-full object-cover" />
                )}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex items-center justify-center absolute top-1/2 left-1/2 -translate-x-1/2 w-[70%] ">
          <CarouselNext variant="secondary" />
          <CarouselPrevious variant="secondary" />
        </div>
      </Carousel>

      <div className="absolute top-[5%] left-1/2 -translate-x-1/2 w-[70%] flex gap-1">
        {media.map((_, idx) => (
          <button
            key={idx}
            onClick={() => api?.scrollTo(idx)}
            className="flex-1 h-1 rounded-full overflow-hidden bg-white/20 relative"
          >
            <div
              className={`
          h-full transition-all duration-300
          ${activeIndex === idx ? 'bg-white w-full' : 'bg-white/30 '}
        `}
            />
          </button>
        ))}
      </div>
    </div>
  )
}
