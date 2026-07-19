'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { FunnelIcon, XIcon, CheckIcon, CaretDownIcon } from '@phosphor-icons/react'
import { useState, useEffect } from 'react'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { cn } from '@/lib/utils'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupInput,
} from '@/components/ui/input-group'

// ── Types ─────────────────────────────────────────────────

interface FilterOption {
  value: string
  label: string
}

// ── Constants ─────────────────────────────────────────────

const sortOptions: FilterOption[] = [
  { label: 'Terbaru', value: '-createdAt' },
  { label: 'Harga Terendah', value: 'price' },
  { label: 'Harga Tertinggi', value: '-price' },
  { label: 'KM Terendah', value: 'carSpecification.odometer' },
]

const fuelOptions: FilterOption[] = [
  { label: 'Semua', value: '' },
  { label: 'Bensin', value: 'bensin' },
  { label: 'Solar', value: 'solar' },
  { label: 'Listrik', value: 'listrik' },
  { label: 'Hybrid', value: 'hybrid' },
]

const transmissionOptions: FilterOption[] = [
  { label: 'Semua', value: '' },
  { label: 'Manual', value: 'manual' },
  { label: 'AT', value: 'at' },
  { label: 'CVT', value: 'cvt' },
]

// ── Component ─────────────────────────────────────────────

export default function CarFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [brands, setBrands] = useState<any[]>([])
  const [types, setTypes] = useState<any[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '')
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '')
  const [brandOpen, setBrandOpen] = useState(false)
  const [typeOpen, setTypeOpen] = useState(false)
  const [sortOpen, setSortOpen] = useState(false)

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const res = await fetch('/api/car-filters')
        const { brands: brandsData, types: typesData } = await res.json()

        setBrands([
          { value: '', title: 'Semua' },
          ...(brandsData || []).map((b: any) => ({
            value: String(b.title),
            title: b.title,
          })),
        ])

        setTypes([
          { value: '', title: 'Semua' },
          ...(typesData || []).map((t: any) => ({
            value: String(t.title),
            title: t.title,
          })),
        ])
      } catch (err) {
        console.error('Failed fetch filters:', err)
      }
    }

    fetchFilters()
  }, []) // ← dependency array kosong = sekali saat mount

  // Sync price input dengan URL
  useEffect(() => {
    const sync = setTimeout(() => {
      setMinPrice(searchParams.get('minPrice') || '')
      setMaxPrice(searchParams.get('maxPrice') || '')
    }, 0)
    return () => clearTimeout(sync)
  }, [searchParams])

  // ── URL helpers ───────────────────────────────────────────

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    params.delete('page') // reset pagination
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  function applyPriceFilter() {
    const params = new URLSearchParams(searchParams.toString())
    if (minPrice) params.set('minPrice', minPrice)
    else params.delete('minPrice')
    if (maxPrice) params.set('maxPrice', maxPrice)
    else params.delete('maxPrice')
    params.delete('page')
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  function clearAll() {
    setMinPrice('')
    setMaxPrice('')
    router.push(pathname, { scroll: false })
  }


  // ── Derived state ─────────────────────────────────────────

  const currentBrand = searchParams.get('brand') || ''
  const currentType = searchParams.get('type') || ''
  const currentFuel = searchParams.get('fuel') || ''
  const currentTrans = searchParams.get('transmission') || ''
  const currentSort = searchParams.get('sort') || '-createdAt'
  const currentSearch = searchParams.get('search') || ''

  const hasFilters = !!(
    currentBrand ||
    currentType ||
    currentFuel ||
    currentTrans ||
    searchParams.get('minPrice') ||
    searchParams.get('maxPrice') ||
    currentSearch
  )

  const selectedBrand = brands.find((b) => b.value === currentBrand)
  const selectedType = types.find((t) => t.value === currentType)

  // ── Render ────────────────────────────────────────────────

  return (
    <div className="space-y-4">
      {/* Sort + Filter Toggle */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button
            variant={showFilters ? 'default' : 'outline'}
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="text-xs"
          >
            <FunnelIcon size={14} />
            Filter
          </Button>

          {hasFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAll}
              className="text-xs text-muted-foreground"
            >
              <XIcon size={14} />
              Reset
            </Button>
          )}
        </div>

        {currentSearch && (
          <div className="flex-1 px-4">
            <div className="bg-muted px-3 py-1.5 rounded-full text-xs inline-flex items-center gap-2">
              <span className="text-muted-foreground">Pencarian:</span>
              <span className="font-medium">&quot;{currentSearch}&quot;</span>
              <button
                onClick={() => updateParam('search', '')}
                className="hover:bg-muted-foreground/20 rounded-full p-0.5 transition-colors"
              >
                <XIcon size={12} />
              </button>
            </div>
          </div>
        )}

        {/* Sort */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground hidden sm:inline">Urutkan:</span>

          <Popover open={sortOpen} onOpenChange={setSortOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 text-xs px-2.5 font-normal">
                {sortOptions.find((o) => o.value === currentSort)?.label || 'Terbaru'}
                <CaretDownIcon className="ml-1 h-3.5 w-3.5 opacity-50 shrink-0" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[160px] p-0" align="end">
              <Command>
                <CommandList>
                  <CommandGroup>
                    {sortOptions.map((opt) => (
                      <CommandItem
                        key={opt.value}
                        value={opt.label}
                        onSelect={() => {
                          updateParam('sort', opt.value)
                          setSortOpen(false)
                        }}
                        className="text-xs cursor-pointer"
                      >
                        {opt.label}
                        <CheckIcon
                          className={cn(
                            'ml-auto h-3.5 w-3.5',
                            currentSort === opt.value ? 'opacity-100' : 'opacity-0',
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      {/* Filter Panel */}
      {showFilters && (
        <div className="rounded-xl border bg-card p-4 space-y-5 animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-3 justify-around flex-col md:flex-row">
<div className='w-full md:w-1/3 gap-2 flex justify-center'>
            {/* Brand Dropdown */}
            {brands.length > 0 && (
              <div className="flex flex-col space-y-2 w-45">
                <p className="text-xs font-medium text-muted-foreground">Merek</p>
                <Popover open={brandOpen} onOpenChange={setBrandOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between font-normal text-xs h-9"
                    >
                      <span className="truncate">{selectedBrand?.title || 'Semua Merek'}</span>
                      <CaretDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[180px] p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Cari merek..." className="text-xs h-9" />
                      <CommandList>
                        <CommandEmpty className="text-xs p-4 text-center">
                          Tidak ditemukan.
                        </CommandEmpty>
                        <CommandGroup>
                          {brands.map((b) => (
                            <CommandItem
                              key={b.value}
                              value={b.value}
                              onSelect={() => {
                                updateParam('brand', b.value)
                                setBrandOpen(false)
                              }}
                              className="text-xs cursor-pointer"
                            >
                              {b.title}
                              <CheckIcon
                                className={cn(
                                  'ml-auto h-4 w-4',
                                  currentBrand === b.value ? 'opacity-100' : 'opacity-0',
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            )}

            {/* Type Dropdown */}
            {types.length > 0 && (
              <div className="flex flex-col w-45 space-y-2 ">
                <p className="text-xs font-medium text-muted-foreground">Tipe Mobil</p>
                <Popover open={typeOpen} onOpenChange={setTypeOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between font-normal text-xs h-9"
                    >
                      <span className="truncate">{selectedType?.title || 'Semua Tipe'}</span>
                      <CaretDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[180px] p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Cari tipe..." className="text-xs h-9" />
                      <CommandList>
                        <CommandEmpty className="text-xs p-4 text-center">
                          Tidak ditemukan.
                        </CommandEmpty>
                        <CommandGroup>
                          {types.map((t) => (
                            <CommandItem
                              key={t.value}
                              value={t.value}
                              onSelect={() => {
                                updateParam('type', t.value)
                                setTypeOpen(false)
                              }}
                              className="text-xs cursor-pointer"
                            >
                              {t.title}
                              <CheckIcon
                                className={cn(
                                  'ml-auto h-4 w-4',
                                  currentType === t.value ? 'opacity-100' : 'opacity-0',
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            )}


</div>
            {/* Price Range */}
            <div className="flex flex-col space-y-2">
              <p className="text-xs font-medium text-muted-foreground">Harga</p>
              <div className="flex flex-col md:flex-row gap-2">
                <div className="flex items-center gap-2">
                  <InputGroup className="h-9 w-full flex-1">
                    <InputGroupAddon align="inline-start">
                      <InputGroupText className="text-xs">Rp</InputGroupText>
                    </InputGroupAddon>
                    <InputGroupInput
                      type="number"
                      step="10"
                      min="0"
                      placeholder="Min"
                      value={minPrice ? Number(minPrice) / 1_000_000 : ''}
                      onChange={(e) =>
                        setMinPrice(
                          e.target.value ? String(Number(e.target.value) * 1_000_000) : '',
                        )
                      }
                      className="text-xs text-right pr-2"
                    />
                    <InputGroupAddon align="inline-end">
                      <InputGroupText className="text-xs">Juta</InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>

                  <span className="text-muted-foreground text-xs">-</span>

                  <InputGroup className="h-9 w-full flex-1">
                    <InputGroupAddon align="inline-start">
                      <InputGroupText className="text-xs">Rp</InputGroupText>
                    </InputGroupAddon>
                    <InputGroupInput
                      type="number"
                      step="10"
                      min="0"
                      placeholder="Max"
                      value={maxPrice ? Number(maxPrice) / 1_000_000 : ''}
                      onChange={(e) =>
                        setMaxPrice(
                          e.target.value ? String(Number(e.target.value) * 1_000_000) : '',
                        )
                      }
                      className="text-xs text-right pr-2"
                    />
                    <InputGroupAddon align="inline-end">
                      <InputGroupText className="text-xs">Juta</InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                </div>
                <Button size="sm" onClick={applyPriceFilter} className="h-9  text-xs">
                  Terapkan Harga
                </Button>
              </div>
            </div>
          </div>

          {/* Fuel & Transmission */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t mt-4">
            {/* Fuel */}
            <ToggleButton
              title="Bahan Bakar"
              data={fuelOptions}
              paramKey="fuel"
              currentValue={currentFuel}
              onClick={updateParam}
            />
            {/* Transmission */}
            <ToggleButton
              title="Transmisi"
              data={transmissionOptions}
              paramKey="transmission"
              currentValue={currentTrans}
              onClick={updateParam}
            />
          </div>
        </div>
      )}
    </div>
  )
}

function ToggleButton({
  title,
  data,
  paramKey,
  currentValue,
  onClick,
}: {
  title: string
  data: { label: string; value: string }[]
  paramKey: string
  currentValue: string
  onClick: (key: string, value: string) => void
}) {
  return (
    <div>
      <p className="text-xs font-medium text-muted-foreground mb-2">{title}</p>
      <div className="flex flex-wrap gap-1.5">
        {data.map((opt) => (
          <Button
            key={opt.value}
            size="sm"
            variant={currentValue === opt.value ? 'default' : 'outline'}
            onClick={() => onClick(paramKey, opt.value)}
            className="text-xs h-7"
          >
            {opt.label}
          </Button>
        ))}
      </div>
    </div>
  )
}
