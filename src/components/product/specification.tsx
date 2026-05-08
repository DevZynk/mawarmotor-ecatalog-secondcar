'use client'

import * as Icons from '@phosphor-icons/react'
import { Card } from '../ui/card'
import Link from 'next/link'

type SpecTitle =
  | 'Kapasitas Mesin'
  | 'Jumlah Penumpang'
  | 'Transmisi'
  | 'Bahan Bakar'
  | 'Warna'
  | 'Odometer'

interface SpecificationItem {
  title: SpecTitle
  data: string | number
}

interface SpecificationProps {
  items: SpecificationItem[]
}

// icon mapping
const iconMap: Record<SpecTitle, keyof typeof Icons> = {
  'Kapasitas Mesin': 'Engine',
  'Jumlah Penumpang': 'Users',
  Transmisi: 'Gear',
  'Bahan Bakar': 'GasPump',
  Warna: 'Eyedropper',
  Odometer: 'RoadHorizon',
}

// suffix formatter
function formatSpec(title: SpecTitle, value: string | number) {
  switch (title) {
    case 'Kapasitas Mesin':
      return `${value} cc`
    case 'Jumlah Penumpang':
      return `${value} orang`
    case 'Odometer':
      return `${value.toLocaleString('id-ID')} km`
    default:
      return value
  }
}

export default function Specification({ items }: SpecificationProps) {
  return (
    <div className="w-full">
      <div className="grid m-2 sm:grid-cols-1 md:grid-cols-2 gap-2">
        {items.map((item, index) => {
          const Icon = Icons[iconMap[item.title]] as any

          return (
            <div key={index} className="flex items-center gap-2 border-b  px-3 p-2">
              {Icon && (
                <div className="p-2 rounded-md bg-muted">
                  <Icon size={16} />
                </div>
              )}

              <div className="flex items-center justify-between gap-2 w-full">
                <p className="text-sm text-muted-foreground">{item.title}</p>
                <p className="font-semibold text-foreground">{formatSpec(item.title, item.data)}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
