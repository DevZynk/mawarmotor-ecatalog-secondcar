"use client"

import { ImageBox } from '@inoo-ch/payload-image-optimizer/frontend'
import Link from 'next/link'
import { useSite } from "@/context/site-context"

export default function Logo() {
  const { logoUrl, siteName, location, alt } = useSite()

  return (
    <Link href="/">
      <div className="flex items-center gap-2">
        {logoUrl && (
          <ImageBox
            media={logoUrl}
            alt={alt}
            width={55}
            height={55}
            className="rounded-full object-cover"
          />
        )}
        <div>
          <p className="font-semibold text-lg">{siteName}</p>
          <p className="text-sm">{location}</p>
        </div>
      </div>
    </Link>
  )
}