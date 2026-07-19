'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import {
  MagnifyingGlassIcon,
  XIcon,
  SpinnerIcon,
  SlidersHorizontalIcon,
  CaretDownIcon,
  CheckIcon,
  CarProfileIcon,
} from '@phosphor-icons/react'
import formatRupiah from '@/lib/formatRupiah'
import { Button } from '@/components/ui/button'
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
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'

// ── Types ────────────────────────────────────────────────

interface SearchResult {
  id: string
  title: string
  slug: string
  price: number
  image: string | null
  brand: string | null
  type: string | null
  fuel: string
  transmission: string
  odometer: number
  year: number
}

interface SearchFilters {
  brand: string
  type: string
  fuel: string
  priceMin: string
  priceMax: string
  sort: string
}


// ── Constants ────────────────────────────────────────────

const FUELS = [
  { value: '', label: 'Semua' },
  { value: 'bensin', label: 'Bensin' },
  { value: 'solar', label: 'Solar' },
  { value: 'listrik', label: 'Listrik' },
  { value: 'hybrid', label: 'Hybrid' },
]

const SORTS = [
  { value: '', label: 'Relevansi' },
  { value: 'price_asc', label: 'Harga Termurah' },
  { value: 'price_desc', label: 'Harga Termahal' },
  { value: 'newest', label: 'Terbaru' },
  { value: 'km_asc', label: 'KM Terendah' },
]

const PRICE_RANGES = [
  { value: '', label: 'Semua' },
  { value: '0-150000000', label: '< 150 Juta' },
  { value: '150000000-250000000', label: '150 - 250 Juta' },
  { value: '250000000-400000000', label: '250 - 400 Juta' },
  { value: '400000000-', label: '> 400 Juta' },
]

const DEFAULT_FILTERS: SearchFilters = {
  brand: '',
  type: '',
  fuel: '',
  priceMin: '',
  priceMax: '',
  sort: '',
}

// ── Highlight helper ─────────────────────────────────────

function highlightMatch(text: string, query: string) {
  if (!query || query.length < 2) return text
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  const parts = text.split(regex)
  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark key={i} className="bg-primary/20 text-primary font-semibold rounded-sm px-0.5">
        {part}
      </mark>
    ) : (
      part
    ),
  )
}

// ── Component ────────────────────────────────────────────

export default function SearchModal() {
  const [open, setOpen] = useState(false)
  const onClose = () => setOpen(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<SearchFilters>(DEFAULT_FILTERS)
  const [brands, setBrands] = useState<{ value: string; label: string }[]>([])
  const [types, setTypes] = useState<{ value: string; label: string }[]>([])
  const [brandOpen, setBrandOpen] = useState(false)
  const [typeOpen, setTypeOpen] = useState(false)
  const [fuelOpen, setFuelOpen] = useState(false)
  const [sortOpen, setSortOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  // Focus + reset on open
  useEffect(() => {
    if (open) {
      setTimeout(() => {
        inputRef.current?.focus()
        setQuery('')
        setResults([])
        setFilters(DEFAULT_FILTERS)
        setShowFilters(false)
      }, 100)
    }
  }, [open])

  useEffect(() => {
    if (!open) return

    const fetchFilters = async () => {
      try {
        const res = await fetch('/api/car-filters')
        const { brands: brandsData, types: typesData } = await res.json()

        setBrands([
          { value: '', label: 'Semua' },
          ...(brandsData || []).map((b: any) => ({
            value: String(b.id),
            label: b.title,
          })),
        ])

        setTypes([
          { value: '', label: 'Semua' },
          ...(typesData || []).map((t: any) => ({
            value: String(t.id),
            label: t.title,
          })),
        ])
      } catch (err) {
        console.error('Failed fetch filters:', err)
      }
    }

    fetchFilters()
  }, [open])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(true)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  // Debounced search
  const doSearch = useCallback(async (q: string, f: SearchFilters) => {
    if (q.length < 2 && !f.brand && !f.type && !f.fuel && !f.priceMin && !f.priceMax) {
      setResults([])
      return
    }

    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.set('limit', '12')
      params.set('depth', '1')

      if (q.length >= 2) params.set('where[title][like]', q)
      params.set('where[analytics.status][equals]', 'available')
      if (f.brand) params.set('where[carBrand][equals]', f.brand)
      if (f.type) params.set('where[carType][equals]', f.type)
      if (f.fuel) params.set('where[carSpecification.fuel][equals]', f.fuel)
      if (f.priceMin) params.set('where[price][greater_than_equal]', f.priceMin)
      if (f.priceMax) params.set('where[price][less_than_equal]', f.priceMax)

      // Sorting
      if (f.sort === 'price_asc') params.set('sort', 'price')
      else if (f.sort === 'price_desc') params.set('sort', '-price')
      else if (f.sort === 'newest') params.set('sort', '-createdAt')
      else if (f.sort === 'km_asc') params.set('sort', 'carSpecification.odometer')
      else params.set('sort', '-createdAt')

      const res = await fetch(`/api/cars?${params.toString()}`)
      const data = await res.json()

      const mapped: SearchResult[] = (data.docs || []).map((car: any) => {
        const featuredGallery = car.gallery?.find((g: any) => g.isFeatured) || car.gallery?.[0]
        const img = featuredGallery?.image
        const imageUrl = typeof img === 'object' ? img.sizes?.thumbnail?.url || null : null

        return {
          id: String(car.id),
          title: car.title,
          slug: car.slug,
          price: car.price,
          image: imageUrl,
          brand: typeof car.carBrand === 'object' ? car.carBrand?.title : null,
          type: typeof car.carType === 'object' ? car.carType?.title : null,
          fuel: car.carSpecification?.fuel || '',
          transmission: car.carSpecification?.transmission || '',
          odometer: car.carSpecification?.odometer || 0,
          year: car.carSpecification?.buildYear || 0,
        }
      })

      setResults(mapped)
    } catch (err) {
      console.error('Search error:', err)
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [])

  const triggerSearch = useCallback(
    (q: string, f: SearchFilters) => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => doSearch(q, f), 300)
    },
    [doSearch],
  )

  const handleQueryChange = (value: string) => {
    setQuery(value)
    triggerSearch(value, filters)
  }

  const updateFilter = (key: keyof SearchFilters, value: string) => {
    const updated = { ...filters, [key]: value }

    // Handle price range preset
    if (key === 'priceMin' || key === 'priceMax') {
      setFilters(updated)
    } else {
      setFilters(updated)
    }

    triggerSearch(query, updated)
  }

  const handlePriceRange = (range: string) => {
    const [min, max] = range.split('-')
    const updated = { ...filters, priceMin: min || '', priceMax: max || '' }
    setFilters(updated)
    triggerSearch(query, updated)
  }

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS)
    triggerSearch(query, DEFAULT_FILTERS)
  }

  const handleSelect = (slug: string) => {
    onClose()
    router.push(`/cars/${slug}`)
  }

  const hasActiveFilters =
    filters.brand || filters.type || filters.fuel || filters.priceMin || filters.priceMax
  const showResults = query.length >= 2 || hasActiveFilters

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon-lg"
        >
          <MagnifyingGlassIcon />
        </Button>
      </DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className="fixed top-[5vh] left-1/2 -translate-x-1/2 translate-y-0 sm:max-w-2xl w-full p-0 gap-0 bg-background border shadow-2xl overflow-hidden"
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 border-b">
          <MagnifyingGlassIcon size={20} className="text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            placeholder="Cari mobil... (mis: Avanza, Fortuner, Toyota)"
            className="flex-1 py-3.5 text-sm bg-transparent outline-none placeholder:text-muted-foreground"
            autoComplete="off"
          />
          {loading && <SpinnerIcon size={18} className="animate-spin text-muted-foreground" />}

          {/* Filter toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-1.5 rounded-lg transition ${showFilters ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-muted-foreground'}`}
            aria-label="Toggle filter"
          >
            <SlidersHorizontalIcon size={16} />
          </button>

          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-muted transition"
            aria-label="Tutup pencarian"
          >
            <XIcon size={16} />
          </button>
        </div>

        {/* Filters panel */}
        {showFilters && (
          <div className="px-4 py-3 border-b bg-muted/20 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Filter & Urutkan
              </p>
              {hasActiveFilters && (
                <button onClick={resetFilters} className="text-xs text-primary hover:underline">
                  Reset Filter
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {/* Brand */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                  Merek
                </span>
                <Popover open={brandOpen} onOpenChange={setBrandOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between h-9 text-xs px-2.5 font-normal bg-background"
                    >
                      <span className="truncate">
                        {brands.find((b) => b.value === filters.brand)?.label || 'Semua Merek'}
                      </span>
                      <CaretDownIcon className="ml-1 h-3.5 w-3.5 opacity-50 shrink-0" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[180px] p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Cari merek..." className="h-8 text-xs" />
                      <CommandList>
                        <CommandEmpty className="text-xs py-3 text-center">
                          Tidak ditemukan
                        </CommandEmpty>
                        <CommandGroup>
                          {brands.map((b) => (
                            <CommandItem
                              key={b.value}
                              value={b.label}
                              onSelect={() => {
                                updateFilter('brand', b.value)
                                setBrandOpen(false)
                              }}
                              className="text-xs cursor-pointer"
                            >
                              {b.label}
                              <CheckIcon
                                className={cn(
                                  'ml-auto h-3.5 w-3.5',
                                  filters.brand === b.value ? 'opacity-100' : 'opacity-0',
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

              {/* Type */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                  Tipe
                </span>
                <Popover open={typeOpen} onOpenChange={setTypeOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between h-9 text-xs px-2.5 font-normal bg-background"
                    >
                      <span className="truncate">
                        {types.find((t) => t.value === filters.type)?.label || 'Semua Tipe'}
                      </span>
                      <CaretDownIcon className="ml-1 h-3.5 w-3.5 opacity-50 shrink-0" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-60 p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Cari tipe..." className="h-8 text-xs" />
                      <CommandList>
                        <CommandEmpty className="text-xs py-3 text-center">
                          Tidak ditemukan
                        </CommandEmpty>
                        <CommandGroup>
                          {types.map((t) => (
                            <CommandItem
                              key={t.value}
                              value={t.label}
                              onSelect={() => {
                                updateFilter('type', t.value)
                                setTypeOpen(false)
                              }}
                              className="text-xs cursor-pointer"
                            >
                              {t.label}
                              <CheckIcon
                                className={cn(
                                  'ml-auto h-3.5 w-3.5',
                                  filters.type === t.value ? 'opacity-100' : 'opacity-0',
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

              {/* Fuel */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                  Bahan Bakar
                </span>
                <Popover open={fuelOpen} onOpenChange={setFuelOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between h-9 text-xs px-2.5 font-normal bg-background"
                    >
                      <span className="truncate">
                        {FUELS.find((f) => f.value === filters.fuel)?.label || 'Semua'}
                      </span>
                      <CaretDownIcon className="ml-1 h-3.5 w-3.5 opacity-50 shrink-0" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[140px] p-0" align="start">
                    <Command>
                      <CommandList>
                        <CommandGroup>
                          {FUELS.map((f) => (
                            <CommandItem
                              key={f.value}
                              value={f.label}
                              onSelect={() => {
                                updateFilter('fuel', f.value)
                                setFuelOpen(false)
                              }}
                              className="text-xs cursor-pointer"
                            >
                              {f.label}
                              <CheckIcon
                                className={cn(
                                  'ml-auto h-3.5 w-3.5',
                                  filters.fuel === f.value ? 'opacity-100' : 'opacity-0',
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

              {/* Sort */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                  Urutkan
                </span>
                <Popover open={sortOpen} onOpenChange={setSortOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between h-9 text-xs px-2.5 font-normal bg-background"
                    >
                      <span className="truncate">
                        {SORTS.find((s) => s.value === filters.sort)?.label || 'Relevansi'}
                      </span>
                      <CaretDownIcon className="ml-1 h-3.5 w-3.5 opacity-50 shrink-0" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[160px] p-0" align="end">
                    <Command>
                      <CommandList>
                        <CommandGroup>
                          {SORTS.map((s) => (
                            <CommandItem
                              key={s.value}
                              value={s.label}
                              onSelect={() => {
                                updateFilter('sort', s.value)
                                setSortOpen(false)
                              }}
                              className="text-xs cursor-pointer"
                            >
                              {s.label}
                              <CheckIcon
                                className={cn(
                                  'ml-auto h-3.5 w-3.5',
                                  filters.sort === s.value ? 'opacity-100' : 'opacity-0',
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

            {/* Price range shortcuts */}
            <div className="flex flex-wrap gap-1.5">
              {PRICE_RANGES.map((pr) => {
                const [min, max] = pr.value.split('-')
                const isActive =
                  filters.priceMin === (min || '') && filters.priceMax === (max || '')
                return (
                  <button
                    key={pr.value}
                    onClick={() => handlePriceRange(pr.value)}
                    className={`text-[11px] px-2.5 py-1 rounded-full border transition ${
                      isActive
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-background hover:bg-muted border-border'
                    }`}
                  >
                    {pr.label}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Results */}
        <div className="max-h-[55vh] overflow-y-auto">
          {!showResults && (
            <div className="p-8 text-center text-sm text-muted-foreground">
              <CarProfileIcon size={36} className="mx-auto mb-3 opacity-30" />
              <p>Ketik nama mobil untuk mencari</p>
              <p className="text-xs mt-1.5 opacity-50">
                {'Belum ada mobil yang sesuai. Coba ubah kata kunci atau filter'}
              </p>
            </div>
          )}

          {showResults && !loading && results.length === 0 && (
            <div className="p-8 text-center text-sm text-muted-foreground">
              <p>Tidak ada mobil ditemukan</p>
              <p className="text-xs mt-1 opacity-50">Coba ubah kata kunci</p>
            </div>
          )}

          {results.map((car) => (
            <button
              key={car.id}
              onClick={() => handleSelect(car.slug)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted transition text-left border-b last:border-b-0"
            >
              {/* Thumbnail */}
              <div className="relative w-20 h-14 rounded-lg bg-muted overflow-hidden shrink-0">
                {car.image ? (
                  <Image
                    src={car.image}
                    alt={car.title}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <CarProfileIcon size={18} className="text-muted-foreground" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {highlightMatch(car.title, query)}
                </p>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                  {car.brand && <span className="font-medium">{car.brand}</span>}
                  {car.type && (
                    <>
                      <span className="opacity-40">·</span>
                      <span>{car.type}</span>
                    </>
                  )}
                  <span className="opacity-40">·</span>
                  <span>{car.year}</span>
                  <span className="opacity-40">·</span>
                  <span>{car.odometer.toLocaleString('id-ID')} km</span>
                </div>
              </div>

              {/* Price */}
              <div className="text-right shrink-0">
                <p className="text-sm font-bold text-primary">{formatRupiah(car.price)}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        {results.length > 0 && (
          <div className="px-4 py-2.5 border-t bg-muted/20 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">{results.length} hasil ditemukan</span>
            <button
              onClick={() => {
                onClose()
                const p = new URLSearchParams()
                if (query) p.set('q', query)
                if (filters.brand) p.set('brand', filters.brand)
                if (filters.type) p.set('type', filters.type)
                if (filters.fuel) p.set('fuel', filters.fuel)
                if (filters.sort) p.set('sort', filters.sort)
                router.push(`/cars?${p.toString()}`)
              }}
              className="text-xs font-medium text-primary hover:underline"
            >
              Lihat semua di halaman listing →
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
