'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'motion/react'
import {
  HouseIcon,
  CarProfileIcon,
  XIcon,
  ListIcon,
  ScalesIcon,
  HeartIcon,
  SteeringWheelIcon,
} from '@phosphor-icons/react'
import { useWishlist } from '@/hooks/use-wishlist'

const navItems = [
  { title: 'Beranda', icon: HouseIcon, href: '/' },
  { title: 'Mobil Bekas', icon: CarProfileIcon, href: '/cars' },
  // { title: 'Rental', icon: SteeringWheelIcon, href: '/rent' },
]

