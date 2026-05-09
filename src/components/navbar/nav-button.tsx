'use client'
import Link from 'next/link'

import { Button } from '../ui/button'
import { HeartIcon, ListIcon, MagnifyingGlassIcon } from '@phosphor-icons/react'
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from '@/components/ui/popover'


export function SearchButton() {
  return (
    <Link href={'/search'}>
      <Button variant={'outline'} size={'icon-lg'} className="rounded-full">
        <MagnifyingGlassIcon size={32} />
      </Button>
    </Link>
  )
}

export function WishListButton() {
  return (
    <Popover>
      <PopoverTrigger className="group/button inline-flex shrink-0 items-center justify-center rounded-full border border-border bg-background hover:bg-muted hover:text-foreground size-9 transition-all outline-none">
        <HeartIcon size={32} />
      </PopoverTrigger>
      <PopoverContent>
        <PopoverHeader>
          <PopoverTitle>Title</PopoverTitle>
          <PopoverDescription>Description text here.</PopoverDescription>
        </PopoverHeader>
      </PopoverContent>
    </Popover>
  )
}

export function NavItemsButton() {
  return (
    <Link href={'/wishlist'}>
      <Button variant={'outline'} size={'icon-lg'} className="rounded-full">
        <ListIcon size={32} />
      </Button>
    </Link>
  )
}
