import React from 'react'

export type CarStatus =
  | 'READY'
  | 'SOLD'
  | 'BOOKED'        
  | 'NEGOTIATION'  
  | 'ON_PROGRESS'  
  | 'HOLD'          

export interface CarTitleProps {
  name: string
  price: number
  status: CarStatus
  description?: string
  cartype?: {
    url: string
    name: string
  }
  carbrand?: {
    url: string
    name: string
  }
}

function getStatusLabel(status: CarStatus) {
  switch (status) {
    case 'READY':
      return 'Tersedia'
    case 'SOLD':
      return 'Terjual'
    case 'BOOKED':
      return 'Sudah DP'
    case 'NEGOTIATION':
      return 'Sedang Ditawar'
    case 'ON_PROGRESS':
      return 'Proses Kredit'
    case 'HOLD':
      return 'Di-hold'
    default:
      return status
  }
}

function getStatusStyle(status: CarStatus) {
  switch (status) {
    case 'READY':
      return 'bg-primary text-primary-foreground'
    case 'SOLD':
      return 'bg-muted text-muted-foreground line-through'
    case 'BOOKED':
      return 'bg-yellow-500 text-white'
    case 'NEGOTIATION':
      return 'bg-orange-500 text-white'
    case 'ON_PROGRESS':
      return 'bg-blue-500 text-white'
    case 'HOLD':
      return 'bg-gray-400 text-white'
    default:
      return 'bg-muted'
  }
}

export default function CarTitle({ name, price, status }: CarTitleProps) {
  return (
    <div className="space-y-1">
      <h1 className="text-xl font-bold text-foreground">{name}</h1>

      <div className="flex items-center gap-3">
        <p className="text-lg font-semibold text-foreground">
          Rp {price?.toLocaleString('id-ID')}
        </p>

        <span
          className={`text-xs font-medium px-2.5 py-1 rounded-full ${getStatusStyle(
            status
          )}`}
        >
          {getStatusLabel(status)}
        </span>
      </div>
    </div>
  )
}