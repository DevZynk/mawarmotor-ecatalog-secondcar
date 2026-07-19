'use client'

import React, { useMemo, useState } from 'react'
import {
  TrendingUp,
  Activity,
  DollarSign,
  Clock,
  CarFront,
  CheckCircle,
  Download,
  User,
  ShieldCheck,
  Search,
  ArrowUpRight,
  Filter,
  ChevronDown,
  ChevronUp,
  BarChart3,
  PieChart,
  ExternalLink,
  Info,
} from 'lucide-react'
import * as XLSX from 'xlsx'
import { motion, AnimatePresence } from 'framer-motion'

// ─── Types ────────────────────────────────────────────────────────────────────

interface ProcessedCar {
  id: string
  title: string
  plateNumber: string
  brand: string
  type: string
  year: number | string
  transmission: string
  fuel: string
  odometer: number | string
  days: number
  heatLabel: string
  heatColor: string
  heatKey: string
  purchasePrice: number
  maintenanceCost: number
  repairCost: number
  totalCost: number
  listingPrice: number
  soldPrice: number
  profit: number
  status: 'available' | 'booked' | 'sold'
  createdAt: string
  purchaseDate: string | null
  soldDate: string | null
  ownershipType: 'dealer' | 'personal'
  ownerName: string
  ownerPhone: string
  ownerNik: string
  ownerAddress: string
  stnkName: string
  handOwnership: number | string
}

interface BrandStat {
  brand: string
  count: number
  soldCount: number
  totalProfit: number
  avgDays: number
}

interface AgingBucket {
  key: string
  label: string
  count: number
  color: string
  percentage: number
}

interface MonthlyPoint {
  month: string
  profit: number
  count: number
}

interface DashboardStats {
  availableCount: number
  bookedCount: number
  soldCount: number
  personalCount: number
  totalInvValue: number
  totalPotProfit: number
  totalRealProfit: number
  avgDaysToSell: number
  inventoryHealth: number
}

type TabKey = 'insight' | 'finansial' | 'kepemilikan'
type SortOption = 'Unit Terbaru' | 'Stok Terlama' | 'Laba Tertinggi' | 'Harga Tertinggi'

// ─── Constants ────────────────────────────────────────────────────────────────

const AGING_CONFIG = [
  { key: 'green', label: 'Normal (< 30)', color: '#10b981', min: 0, max: 29 },
  { key: 'yellow', label: 'Peringatan (30-60)', color: '#f59e0b', min: 30, max: 59 },
  { key: 'red', label: 'Kritis (60-90)', color: '#ef4444', min: 60, max: 90 },
  { key: 'black', label: 'Slow Moving (> 90)', color: '#6b7280', min: 91, max: Infinity },
] as const

const STATUS_BADGE: Record<string, string> = {
  available: '#6b7280',
  booked: '#f59e0b',
  sold: '#10b981',
}

const SORT_OPTIONS: SortOption[] = [
  'Unit Terbaru',
  'Stok Terlama',
  'Laba Tertinggi',
  'Harga Tertinggi',
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

const idr = (n: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(n || 0)

const fmtDate = (d: string | null) =>
  d
    ? new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
    : '-'

const diffDaysFrom = (a: Date, b: Date) =>
  Math.ceil(Math.abs(b.getTime() - a.getTime()) / 86_400_000)

const getAgingConfig = (days: number) =>
  AGING_CONFIG.find(({ min, max }) => days >= min && days <= max) ?? AGING_CONFIG[0]

const getRelId = (v: any): string | null => (!v ? null : typeof v === 'object' ? v.id : v)

// ─── Data hook ────────────────────────────────────────────────────────────────

function useDashboardData(cars: any[]) {
  return useMemo(() => {
    const now = new Date()
    const brandMap: Record<
      string,
      { count: number; soldCount: number; profit: number; totalDays: number }
    > = {}
    const monthMap: Record<string, { profit: number; count: number }> = {}
    const agingCounter: Record<string, number> = { green: 0, yellow: 0, red: 0, black: 0 }

    let totalInvValue = 0
    let totalPotProfit = 0
    let totalRealProfit = 0
    let totalDaysToSell = 0
    let validSoldDays = 0

    const uniqueBrands = new Set<string>()
    const uniqueTypes = new Set<string>()

    const processedCars: ProcessedCar[] = []
    for (const c of cars) {
      const status = (c.analytics?.status || 'available') as ProcessedCar['status']
      const isSold = status === 'sold'
      const isActive = status === 'available' || status === 'booked'

      const refStart = new Date(c.analytics?.purchaseDate || c.createdAt)
      const soldDateObj = c.analytics?.soldDate ? new Date(c.analytics.soldDate) : null
      const days = diffDaysFrom(refStart, soldDateObj ?? now)

      const agingCfg = isSold ? null : getAgingConfig(days)
      const heatKey = isSold ? 'sold' : (agingCfg?.key ?? 'green')
      const heatLabel = isSold ? 'Terjual' : (agingCfg?.label ?? 'Normal')
      const heatColor = isSold ? '#10b981' : (agingCfg?.color ?? '#10b981')
      if (!isSold && agingCfg) agingCounter[agingCfg.key]++

      const pPrice = c.analytics?.purchasePrice || 0
      const mCost = (c.analytics?.operationalCosts || []).reduce(
        (s: number, i: any) => s + (i.cost || 0),
        0,
      )
      const rCost = (c.analytics?.repairs || []).reduce((s: number, i: any) => s + (i.cost || 0), 0)
      const totalCost = pPrice + mCost + rCost
      const listingPrice = c.price || 0
      const soldPrice = c.analytics?.soldPrice || 0
      const profit = isSold ? soldPrice - totalCost : listingPrice - totalCost

      if (isActive) {
        totalInvValue += totalCost
        totalPotProfit += profit
      }
      if (isSold) {
        totalRealProfit += profit
        if (soldDateObj) {
          totalDaysToSell += days
          validSoldDays++
          const mk = `${soldDateObj.getFullYear()}-${String(soldDateObj.getMonth() + 1).padStart(2, '0')}`
          if (!monthMap[mk]) monthMap[mk] = { profit: 0, count: 0 }
          monthMap[mk].profit += profit
          monthMap[mk].count++
        }
      }

      const brand = c.carBrand?.title || 'Unknown'
      const type = c.carType?.title || 'Unknown'
      uniqueBrands.add(brand)
      uniqueTypes.add(type)

      if (!brandMap[brand]) brandMap[brand] = { count: 0, soldCount: 0, profit: 0, totalDays: 0 }
      brandMap[brand].count++
      if (isSold) {
        brandMap[brand].soldCount++
        brandMap[brand].profit += profit
        brandMap[brand].totalDays += days
      }

      const ownership = c.analytics?.ownership || {}
      const ownershipType: 'dealer' | 'personal' = ownership.ownershipType || 'dealer'
      const personalOwner = ownership.personalOwner || {}

      processedCars.push({
        id: c.id,
        title: c.title,
        plateNumber: ownership.plateNumber,
        brand,
        type,
        year: c.carSpecification?.buildYear || '-',
        transmission: c.carSpecification?.transmission || '-',
        fuel: c.carSpecification?.fuel || '-',
        odometer: c.carSpecification?.odometer ?? '-',
        days,
        heatLabel,
        heatColor,
        heatKey,
        purchasePrice: pPrice,
        maintenanceCost: mCost,
        repairCost: rCost,
        totalCost,
        listingPrice,
        soldPrice,
        profit,
        status,
        createdAt: c.createdAt,
        purchaseDate: c.analytics?.purchaseDate || null,
        soldDate: c.analytics?.soldDate || null,
        ownershipType,
        ownerName: personalOwner.name || '-',
        ownerPhone: personalOwner.phone || '-',
        ownerNik: personalOwner.nik || '-',
        ownerAddress: personalOwner.address || '-', 
        stnkName: ownership.stnkName || '-',
        handOwnership: ownership.handOwnership ?? '-',
      })
    }

    // Brand analysis
    const brandAnalysis: BrandStat[] = Object.entries(brandMap)
      .map(([brand, d]) => ({
        brand,
        count: d.count,
        soldCount: d.soldCount,
        totalProfit: d.profit,
        avgDays: d.soldCount > 0 ? d.totalDays / d.soldCount : 0,
      }))
      .sort((a, b) => b.totalProfit - a.totalProfit)

    // Aging analysis
    const totalActive = Object.values(agingCounter).reduce((s, v) => s + v, 0)
    const agingAnalysis: AgingBucket[] = AGING_CONFIG.map(({ key, label, color }) => ({
      key,
      label,
      color,
      count: agingCounter[key],
      percentage: totalActive > 0 ? (agingCounter[key] / totalActive) * 100 : 0,
    }))

    // Monthly trend (last 6 months)
    const monthlyTrend: MonthlyPoint[] = Object.entries(monthMap)
      .map(([month, d]) => ({ month, profit: d.profit, count: d.count }))
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-6)

    const healthPct =
      totalActive > 0 ? ((agingCounter.green + agingCounter.yellow) / totalActive) * 100 : 100

    const stats: DashboardStats = {
      availableCount: processedCars.filter((c) => c.status === 'available').length,
      bookedCount: processedCars.filter((c) => c.status === 'booked').length,
      soldCount: processedCars.filter((c) => c.status === 'sold').length,
      personalCount: processedCars.filter((c) => c.ownershipType === 'personal').length,
      totalInvValue,
      totalPotProfit,
      totalRealProfit,
      avgDaysToSell: validSoldDays > 0 ? Math.round(totalDaysToSell / validSoldDays) : 0,
      inventoryHealth: Math.round(healthPct),
    }

    return {
      stats,
      processedCars,
      brands: [...uniqueBrands].sort(),
      types: [...uniqueTypes].sort(),
      brandAnalysis,
      agingAnalysis,
      monthlyTrend,
    }
  }, [cars])
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({
  icon,
  label,
  value,
  sub,
  iconColor,
  delay = 0,
}: {
  icon: React.ReactNode
  label: string
  value: React.ReactNode
  sub?: React.ReactNode
  iconColor?: string
  delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      className="stat-card"
    >
      <div className="stat-icon" style={{ color: iconColor }}>
        {icon}
      </div>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      {sub && <div className="stat-sub">{sub}</div>}
    </motion.div>
  )
}

function DonutChart({ data }: { data: AgingBucket[] }) {
  const R = 40
  const C = 2 * Math.PI * R
  const total = data.reduce((s, d) => s + d.count, 0)

  const segments: Array<AgingBucket & { dash: number; offset: number }> = []
  let currentOffset = 0
  for (const seg of data) {
    const dash = total > 0 ? (seg.count / total) * C : 0
    segments.push({
      ...seg,
      dash,
      offset: currentOffset,
    })
    currentOffset += dash
  }

  return (
    <div className="donut-wrap">
      <svg viewBox="0 0 100 100" width={160} height={160}>
        <circle
          cx="50"
          cy="50"
          r={R}
          fill="none"
          stroke="var(--theme-elevation-150)"
          strokeWidth={14}
        />
        {segments.map((seg, i) => (
          <circle
            key={i}
            cx="50"
            cy="50"
            r={R}
            fill="none"
            stroke={seg.color}
            strokeWidth={14}
            strokeDasharray={`${seg.dash} ${C}`}
            strokeDashoffset={-seg.offset}
            transform="rotate(-90 50 50)"
            strokeLinecap="butt"
          />
        ))}
        <text
          x="50"
          y="46"
          textAnchor="middle"
          style={{ fontSize: 11, fontWeight: 800, fill: 'var(--theme-text)' }}
        >
          {total}
        </text>
        <text
          x="50"
          y="58"
          textAnchor="middle"
          style={{ fontSize: 7, fill: 'var(--theme-text-light)' }}
        >
          Unit Aktif
        </text>
      </svg>
      <div className="donut-legend">
        {data.map((seg, i) => (
          <div key={i} className="legend-row">
            <span className="legend-dot" style={{ background: seg.color }} />
            <span className="legend-text">{seg.label}</span>
            <span className="legend-count">{seg.count}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function BarChart({ data }: { data: BrandStat[] }) {
  const max = Math.max(...data.map((d) => d.totalProfit), 1)
  return (
    <div className="bar-list">
      {data.slice(0, 6).map((item, i) => (
        <div key={i} className="bar-item">
          <div className="bar-meta">
            <span className="bar-brand">{item.brand}</span>
            <span className="bar-profit">{idr(item.totalProfit)}</span>
          </div>
          <div className="bar-track">
            <motion.div
              className="bar-fill"
              initial={{ width: 0 }}
              animate={{ width: `${(item.totalProfit / max) * 100}%` }}
              transition={{ duration: 0.8, delay: i * 0.08 }}
            />
          </div>
          <span className="bar-meta-sm">
            {item.soldCount} terjual · avg {Math.round(item.avgDays)} hari
          </span>
        </div>
      ))}
    </div>
  )
}

function TrendChart({ data }: { data: MonthlyPoint[] }) {
  if (!data.length) return <div className="empty-chart">Belum ada data penjualan tercatat.</div>
  const max = Math.max(...data.map((d) => d.profit), 1)
  return (
    <div className="trend-wrap">
      {data.map((pt, i) => (
        <div key={i} className="trend-col">
          <span className="trend-profit">{idr(pt.profit)}</span>
          <div className="trend-bar-track">
            <motion.div
              className="trend-bar"
              style={{ height: `${Math.max((pt.profit / max) * 100, 4)}%` }}
              initial={{ height: 0 }}
              animate={{ height: `${Math.max((pt.profit / max) * 100, 4)}%` }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            />
          </div>
          <span className="trend-label">
            {pt.month.slice(5)}/{pt.month.slice(2, 4)}
          </span>
          <span className="trend-count">{pt.count} unit</span>
        </div>
      ))}
    </div>
  )
}

function Badge({ children, color, bg }: { children: React.ReactNode; color: string; bg: string }) {
  return (
    <span className="badge" style={{ color, background: bg }}>
      {children}
    </span>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AnalyticDashboardClient({ cars }: { cars: any[] }) {
  // ── Filter state
  const [filterBrand, setFilterBrand] = useState('All')
  const [filterType, setFilterType] = useState('All')
  const [filterStatus, setFilterStatus] = useState('All')
  const [filterHeat, setFilterHeat] = useState('All')
  const [filterOwnership, setFilterOwnership] = useState('All')
  const [sortOption, setSortOption] = useState<SortOption>('Unit Terbaru')
  const [search, setSearch] = useState('')
  const [minProfit, setMinProfit] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [filtersOpen, setFiltersOpen] = useState(true)
  const [activeTab, setActiveTab] = useState<TabKey>('insight')

  const { stats, processedCars, brands, types, brandAnalysis, agingAnalysis, monthlyTrend } =
    useDashboardData(cars)

  // ── Filtered + sorted cars
  const filteredCars = useMemo(() => {
    const q = search.toLowerCase()

    return processedCars
      .filter((c) => {
        if (
          q &&
          !c.title.toLowerCase().includes(q) &&
          !c.plateNumber.toLowerCase().includes(q) &&
          !c.brand.toLowerCase().includes(q)
        )
          return false
        if (filterBrand !== 'All' && c.brand !== filterBrand) return false
        if (filterType !== 'All' && c.type !== filterType) return false
        if (filterStatus !== 'All' && c.status !== filterStatus) return false
        if (filterHeat !== 'All' && c.heatKey !== filterHeat) return false
        if (filterOwnership !== 'All' && c.ownershipType !== filterOwnership) return false
        if (minProfit && c.profit < Number(minProfit)) return false
        if (startDate) {
          const ds = new Date(startDate).getTime()
          if (
            new Date(c.createdAt).getTime() < ds &&
            !(c.soldDate && new Date(c.soldDate).getTime() >= ds)
          )
            return false
        }
        if (endDate) {
          const de = new Date(endDate).getTime() + 86_400_000
          if (
            new Date(c.createdAt).getTime() > de &&
            !(c.soldDate && new Date(c.soldDate).getTime() <= de)
          )
            return false
        }
        return true
      })
      .sort((a, b) => {
        if (sortOption === 'Laba Tertinggi') return b.profit - a.profit
        if (sortOption === 'Stok Terlama') return b.days - a.days
        if (sortOption === 'Harga Tertinggi')
          return (
            (b.status === 'sold' ? b.soldPrice : b.listingPrice) -
            (a.status === 'sold' ? a.soldPrice : a.listingPrice)
          )
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      })
  }, [
    processedCars,
    search,
    filterBrand,
    filterType,
    filterStatus,
    filterHeat,
    filterOwnership,
    sortOption,
    minProfit,
    startDate,
    endDate,
  ])

  const topProfitable = useMemo(
    () => [...filteredCars].filter((c) => c.status === 'sold').sort((a, b) => b.profit - a.profit).slice(0, 5),
    [filteredCars]
  )

  const oldestStock = useMemo(
    () => [...filteredCars].filter((c) => c.status !== 'sold').sort((a, b) => b.days - a.days).slice(0, 5),
    [filteredCars]
  )

  // ── Export
  const exportToExcel = () => {
    const finansial = filteredCars.map((c) => ({
      'Nama Unit': c.title,
      'No. Polisi': c.plateNumber,
      Merek: c.brand,
      Tipe: c.type,
      Tahun: c.year,
      Transmisi: c.transmission,
      BBM: c.fuel,
      'Odometer (KM)': c.odometer,
      Status: c.status,
      Aging: c.heatLabel,
      'Lama Stok (Hari)': c.days,
      'Harga Beli': c.purchasePrice,
      'Biaya Operasional': c.maintenanceCost,
      'Biaya Perbaikan': c.repairCost,
      'Total Modal': c.totalCost,
      'Harga Listing': c.listingPrice,
      'Harga Jual': c.soldPrice,
      'Laba/Rugi': c.profit,
      'Tgl Input': fmtDate(c.createdAt),
      'Tgl Beli': fmtDate(c.purchaseDate),
      'Tgl Terjual': fmtDate(c.soldDate),
    }))

    const kepemilikan = filteredCars.map((c) => ({
      'Nama Unit': c.title,
      'No. Polisi': c.plateNumber,
      Kepemilikan: c.ownershipType === 'personal' ? 'Titipan / Perorangan' : 'Stok Dealer',
      'Nama Pemilik': c.ownerName,
      'No. Telp': c.ownerPhone,
      NIK: c.ownerNik,
      'Nama di STNK': c.stnkName,
      Alamat: c.ownerAddress,
      'Tangan Ke': c.handOwnership,
    }))

    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(finansial), 'Finansial')
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(kepemilikan), 'Kepemilikan')
    XLSX.writeFile(wb, `Laporan_${new Date().toISOString().slice(0, 10)}.xlsx`)
  }

  // ── Render
  return (
    <div className="ad">
      <style>{CSS}</style>

      {/* Header */}
      <div className="ad-header">
        <div>
          <h1 className="ad-title">Analitik Bisnis</h1>
          <p className="ad-sub">Real-time inventory health &amp; profitability dashboard</p>
        </div>
        <button className="btn-primary" onClick={exportToExcel}>
          <Download size={15} /> Ekspor Excel
        </button>
      </div>

      {/* Stat Cards */}
      <div className="stats-grid">
        <StatCard
          delay={0.0}
          icon={<Activity size={22} />}
          iconColor="#10b981"
          label="Laba Terealisasi"
          value={idr(stats.totalRealProfit)}
          sub={
            <>
              <ArrowUpRight size={12} /> {stats.soldCount} unit terjual
            </>
          }
        />
        <StatCard
          delay={0.1}
          icon={<DollarSign size={22} />}
          iconColor="#f59e0b"
          label="Modal Tertanam"
          value={idr(stats.totalInvValue)}
          sub={
            <>
              <CarFront size={12} /> {stats.availableCount} unit stok
            </>
          }
        />
        <StatCard
          delay={0.2}
          icon={<TrendingUp size={22} />}
          iconColor="#3b82f6"
          label="Potensi Laba"
          value={idr(stats.totalPotProfit)}
          sub="Estimasi jika semua terjual"
        />
        <StatCard
          delay={0.3}
          icon={<Clock size={22} />}
          iconColor="#8b5cf6"
          label="Avg. Waktu Jual"
          value={`${stats.avgDaysToSell} Hari`}
          sub="Dari beli hingga laku"
        />
        <StatCard
          delay={0.4}
          icon={<CheckCircle size={22} />}
          iconColor="#10b981"
          label="Stok Sehat"
          value={`${stats.inventoryHealth}%`}
          sub="Normal + Peringatan"
        />
        <StatCard
          delay={0.5}
          icon={<User size={22} />}
          iconColor="#f59e0b"
          label="Unit Titipan"
          value={stats.personalCount}
          sub={`dari ${cars.length} total unit`}
        />
      </div>

      {/* Insight Panels */}
      <div className="insight-row">
        <div className="card">
          <div className="card-head">
            <span className="card-title">
              <BarChart3 size={16} /> Laba per Merek
            </span>
            <span className="card-meta">Top 6</span>
          </div>
          <BarChart data={brandAnalysis} />
        </div>
        <div className="card">
          <div className="card-head">
            <span className="card-title">
              <PieChart size={16} /> Aging Stok
            </span>
          </div>
          <DonutChart data={agingAnalysis} />
        </div>
      </div>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <div className="card-head">
          <span className="card-title">
            <Activity size={16} /> Tren Laba Bulanan (6 Bulan Terakhir)
          </span>
          <span className="card-meta">
            {monthlyTrend.reduce((s, m) => s + m.count, 0)} unit terjual
          </span>
        </div>
        <TrendChart data={monthlyTrend} />
      </div>

      {/* Filters */}
      <div className="filter-card">
        <button className="filter-header" onClick={() => setFiltersOpen((v) => !v)}>
          <span className="filter-title">
            <Filter size={14} /> Filter &amp; Pencarian
          </span>
          <div className="filter-right">
            <div className="search-wrap" onClick={(e) => e.stopPropagation()}>
              <Search size={13} className="search-icon" />
              <input
                className="search-input"
                placeholder="Unit, nopol, merek..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            {filtersOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        </button>

        <AnimatePresence initial={false}>
          {filtersOpen && (
            <motion.div
              key="filters"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              style={{ overflow: 'hidden' }}
            >
              <div className="filter-body">
                <div className="filter-grid">
                  <Sel label="Merek" value={filterBrand} onChange={setFilterBrand}>
                    <option value="All">Semua Merek</option>
                    {brands.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </Sel>
                  <Sel label="Tipe" value={filterType} onChange={setFilterType}>
                    <option value="All">Semua Tipe</option>
                    {types.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </Sel>
                  <Sel label="Status" value={filterStatus} onChange={setFilterStatus}>
                    <option value="All">Semua Status</option>
                    <option value="available">Tersedia</option>
                    <option value="booked">Dipesan</option>
                    <option value="sold">Terjual</option>
                  </Sel>
                  <Sel label="Aging" value={filterHeat} onChange={setFilterHeat}>
                    <option value="All">Semua Aging</option>
                    <option value="green">Normal (&lt; 30 Hari)</option>
                    <option value="yellow">Peringatan (30-60)</option>
                    <option value="red">Kritis (60-90)</option>
                    <option value="black">Slow Moving (&gt; 90)</option>
                  </Sel>
                  <Sel label="Kepemilikan" value={filterOwnership} onChange={setFilterOwnership}>
                    <option value="All">Semua</option>
                    <option value="dealer">Stok Dealer</option>
                    <option value="personal">Titipan</option>
                  </Sel>
                  <Sel
                    label="Urutkan"
                    value={sortOption}
                    onChange={(v) => setSortOption(v as SortOption)}
                  >
                    {SORT_OPTIONS.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </Sel>
                  <div className="filter-group">
                    <label className="filter-label">Min Laba (IDR)</label>
                    <input
                      className="filter-input"
                      type="number"
                      placeholder="0"
                      value={minProfit}
                      onChange={(e) => setMinProfit(e.target.value)}
                    />
                  </div>
                  <div className="filter-group" style={{ gridColumn: 'span 2' }}>
                    <label className="filter-label">Rentang Tanggal</label>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <input
                        className="filter-input"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                      <input
                        className="filter-input"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Tabs */}
      <div className="tabs-row">
        {(
          [
            { key: 'insight', label: 'Ringkasan', icon: <Activity size={14} /> },
            { key: 'finansial', label: 'Finansial', icon: <DollarSign size={14} /> },
            { key: 'kepemilikan', label: 'Kepemilikan', icon: <ShieldCheck size={14} /> },
          ] as { key: TabKey; label: string; icon: React.ReactNode }[]
        ).map((t) => (
          <button
            key={t.key}
            className={`tab-btn ${activeTab === t.key ? 'tab-active' : ''}`}
            onClick={() => setActiveTab(t.key)}
          >
            {t.icon} {t.label}
          </button>
        ))}
        <span className="tab-count">{filteredCars.length} unit ditemukan</span>
      </div>

      {/* Tables */}
      <div className="table-card">
        {activeTab === 'insight' && (
          <div className="insight-dashboard">
            {/* Top Brands */}
            <div className="insight-col">
              <h4 className="insight-heading">Performa Merek Terbaik</h4>
              <div className="insight-list">
                {brandAnalysis.slice(0, 5).map((b, i) => (
                  <div key={i} className="insight-item">
                    <div className="insight-rank">#{i + 1}</div>
                    <div style={{ flex: 1 }}>
                      <div className="insight-brand">{b.brand}</div>
                      <div className="insight-detail">
                        <div className="insight-row-val">
                          <span>Total Laba:</span>
                          <span className="insight-val text-success">{idr(b.totalProfit)}</span>
                        </div>
                        <div className="insight-row-val">
                          <span>Terjual:</span>
                          <span className="insight-val">{b.soldCount} unit</span>
                        </div>
                        <div className="insight-row-val">
                          <span>Rata-rata Terjual:</span>
                          <span className="insight-val">{Math.round(b.avgDays)} hari</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Most Profitable Units */}
            <div className="insight-col">
              <h4 className="insight-heading">Unit Paling Menguntungkan</h4>
              <div className="insight-list">
                {topProfitable.length === 0 && (
                  <div className="empty-state" style={{ padding: 20 }}>Belum ada data penjualan</div>
                )}
                {topProfitable.map((c, i) => (
                  <div key={i} className="insight-item">
                    <div className="insight-rank">#{i + 1}</div>
                    <div style={{ flex: 1 }}>
                      <div className="insight-brand">{c.title}</div>
                      <div className="insight-detail">
                        <div className="insight-row-val">
                          <span>Nopol / Tahun:</span>
                          <span className="insight-val">{c.plateNumber || '-'} ({c.year})</span>
                        </div>
                        <div className="insight-row-val">
                          <span>Laba Bersih:</span>
                          <span className="insight-val text-success">{idr(c.profit)}</span>
                        </div>
                        <div className="insight-row-val">
                          <span>Lama Terjual:</span>
                          <span className="insight-val">{c.days} hari</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Oldest Stock */}
            <div className="insight-col">
              <h4 className="insight-heading">Stok Terlama (Perhatian)</h4>
              <div className="insight-list">
                {oldestStock.length === 0 && (
                  <div className="empty-state" style={{ padding: 20 }}>Tidak ada stok aktif</div>
                )}
                {oldestStock.map((c, i) => (
                  <div key={i} className="insight-item" style={{ borderColor: c.days > 90 ? '#ef4444' : c.days > 60 ? '#f59e0b' : 'var(--theme-border-color)' }}>
                    <div className="insight-rank">#{i + 1}</div>
                    <div style={{ flex: 1 }}>
                      <div className="insight-brand">{c.title}</div>
                      <div className="insight-detail">
                        <div className="insight-row-val">
                          <span>Nopol / Tahun:</span>
                          <span className="insight-val">{c.plateNumber || '-'} ({c.year})</span>
                        </div>
                        <div className="insight-row-val">
                          <span>Total Modal:</span>
                          <span className="insight-val">{idr(c.totalCost)}</span>
                        </div>
                        <div className="insight-row-val">
                          <span>Lama Mengendap:</span>
                          <span className="insight-val" style={{ color: c.days > 90 ? '#ef4444' : 'inherit' }}>{c.days} hari</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'finansial' && (
          <div className="table-scroll">
            <table className="table" style={{ minWidth: 1700 }}>
              <thead>
                <tr>
                  <th></th>
                  <th>Unit</th>
                  <th>Nopol</th>
                  <th>Merek / Tipe</th>
                  <th>Tahun</th>
                  <th>Status</th>
                  <th>Aging</th>
                  <th>Hari</th>
                  <th>Harga Beli</th>
                  <th>Operasional</th>
                  <th>Perbaikan</th>
                  <th>Total Modal</th>
                  <th>Harga Jual</th>
                  <th>Laba / Rugi</th>
                  <th>Tgl Beli</th>
                  <th>Tgl Terjual</th>
                </tr>
              </thead>
              <tbody>
                {filteredCars.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <a
                        href={`/admin/collections/cars/${item.id}`}
                        className="icon-btn"
                        title="Edit"
                      >
                        <ExternalLink size={13} />
                      </a>
                    </td>
                    <td className="fw8">{item.title}</td>
                    <td className="mono fw7">{item.plateNumber}</td>
                    <td className="text-sm">
                      {item.brand} / {item.type}
                    </td>
                    <td>{item.year}</td>
                    <td>
                      <Badge
                        color={STATUS_BADGE[item.status]}
                        bg={STATUS_BADGE[item.status] + '20'}
                      >
                        {item.status}
                      </Badge>
                    </td>
                    <td>
                      <Badge color={item.heatColor} bg={item.heatColor + '20'}>
                        {item.heatLabel}
                      </Badge>
                    </td>
                    <td className="fw7">{item.days}</td>
                    <td className="mono">{idr(item.purchasePrice)}</td>
                    <td className="mono text-light">{idr(item.maintenanceCost)}</td>
                    <td className="mono text-light">{idr(item.repairCost)}</td>
                    <td className="mono fw7">{idr(item.totalCost)}</td>
                    <td className="mono">{item.status === 'sold' ? idr(item.soldPrice) : '-'}</td>
                    <td
                      className="mono fw8"
                      style={{ color: item.profit >= 0 ? '#10b981' : '#ef4444' }}
                    >
                      {item.profit >= 0 ? '+' : ''}
                      {idr(item.profit)}
                    </td>
                    <td className="text-sm text-light">{fmtDate(item.purchaseDate)}</td>
                    <td className="text-sm text-light">{fmtDate(item.soldDate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'kepemilikan' && (
          <div className="table-scroll">
            <table className="table" style={{ minWidth: 1200 }}>
              <thead>
                <tr>
                  <th>Unit</th>
                  <th>Nopol</th>
                  <th>Status</th>
                  <th>Kepemilikan</th>
                  <th>Tangan Ke</th>
                  <th>Nama Pemilik</th>
                  <th>No. Telepon</th>
                  <th>NIK</th>
                  <th>Nama di STNK</th>
                  <th>Alamat</th>
                </tr>
              </thead>
              <tbody>
                {filteredCars.map((item) => (
                  <tr key={item.id}>
                    <td className="fw8">{item.title}</td>
                    <td className="mono fw7">{item.plateNumber}</td>
                    <td>
                      <Badge
                        color={STATUS_BADGE[item.status]}
                        bg={STATUS_BADGE[item.status] + '20'}
                      >
                        {item.status}
                      </Badge>
                    </td>
                    <td>
                      <Badge
                        color={item.ownershipType === 'personal' ? '#f59e0b' : '#6b7280'}
                        bg={item.ownershipType === 'personal' ? '#f59e0b20' : '#6b728020'}
                      >
                        {item.ownershipType === 'personal' ? 'Titipan' : 'Dealer'}
                      </Badge>
                    </td>
                    <td className="text-center fw7">{item.handOwnership}</td>
                    <td>{item.ownerName}</td>
                    <td className="mono">{item.ownerPhone}</td>
                    <td className="mono text-sm">{item.ownerNik}</td>
                    <td>{item.stnkName}</td>
                    <td
                      className="text-sm"
                      style={{ maxWidth: 240, whiteSpace: 'normal', lineHeight: 1.5 }}
                    >
                      {item.ownerAddress}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filteredCars.length === 0 && (
          <div className="empty-state">
            <Info size={28} style={{ opacity: 0.2 }} />
            <p>Tidak ada data kendaraan yang sesuai filter.</p>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Small helpers ────────────────────────────────────────────────────────────

function Sel({
  label,
  value,
  onChange,
  children,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  children: React.ReactNode
}) {
  return (
    <div className="filter-group">
      <label className="filter-label">{label}</label>
      <select className="filter-select" value={value} onChange={(e) => onChange(e.target.value)}>
        {children}
      </select>
    </div>
  )
}

// ─── CSS ─────────────────────────────────────────────────────────────────────

const CSS = `
.ad { color: var(--theme-text); background: var(--theme-bg); padding-bottom: 60px; font-family: inherit; }

/* Header */
.ad-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2rem; }
.ad-title   { font-size: 2rem; font-weight: 600; margin: 0; line-height: 1.2; }
.ad-sub     { color: var(--theme-text-light); margin-top: .5rem; font-size: 1rem; }
.btn-primary {
  display: inline-flex; align-items: center; gap: 8px;
  height: 40px; padding: 0 16px; border-radius: 4px;
  background: var(--theme-text); color: var(--theme-bg);
  font-size: .875rem; font-weight: 500; cursor: pointer; border: none;
  transition: opacity .15s ease-in-out;
}
.btn-primary:hover { opacity: .85; }

/* Stats */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px; margin-bottom: 2rem;
}
.stat-card {
  background: var(--theme-elevation-50);
  border: 1px solid var(--theme-border-color);
  border-radius: 4px; padding: 20px;
  transition: border-color .2s;
}
.stat-card:hover { border-color: var(--theme-elevation-200); }
.stat-icon  { width: 40px; height: 40px; border-radius: 4px; display: flex; align-items: center; justify-content: center; background: var(--theme-elevation-100); margin-bottom: 16px; }
.stat-label { font-size: .75rem; text-transform: uppercase; letter-spacing: .05em; color: var(--theme-text-light); font-weight: 600; }
.stat-value { font-size: 1.5rem; font-weight: 600; margin: 6px 0 8px; line-height: 1.2; }
.stat-sub   { font-size: .8rem; color: var(--theme-text-light); display: flex; align-items: center; gap: 6px; }

/* Cards */
.card {
  background: var(--theme-elevation-50);
  border: 1px solid var(--theme-border-color);
  border-radius: 4px; padding: 24px;
}
.card-head  { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.card-title { font-size: 1.1rem; font-weight: 600; display: flex; align-items: center; gap: 8px; }
.card-meta  { font-size: .8rem; color: var(--theme-text-light); font-weight: 500; }
.insight-row { display: grid; grid-template-columns: 3fr 2fr; gap: 20px; margin-bottom: 20px; }
@media (max-width: 960px) { .insight-row { grid-template-columns: 1fr; } }

/* Bar Chart */
.bar-list { display: flex; flex-direction: column; gap: 16px; }
.bar-item { display: flex; flex-direction: column; gap: 6px; }
.bar-meta { display: flex; justify-content: space-between; }
.bar-brand  { font-size: .875rem; font-weight: 600; }
.bar-profit { font-size: .875rem; font-family: monospace; font-weight: 500; }
.bar-meta-sm { font-size: .75rem; color: var(--theme-text-light); }
.bar-track { height: 6px; background: var(--theme-elevation-150); border-radius: 3px; overflow: hidden; }
.bar-fill  { height: 100%; background: var(--theme-text); border-radius: 3px; }

/* Donut Chart */
.donut-wrap { display: flex; align-items: center; justify-content: center; gap: 32px; padding: 12px 0; }
.donut-legend { display: flex; flex-direction: column; gap: 12px; }
.legend-row   { display: flex; align-items: center; gap: 10px; font-size: .875rem; }
.legend-dot   { width: 10px; height: 10px; border-radius: 2px; flex-shrink: 0; }
.legend-text  { flex: 1; font-weight: 500; }
.legend-count { font-weight: 600; }

/* Trend Chart */
.trend-wrap { display: flex; align-items: flex-end; gap: 16px; height: 160px; padding-top: 20px; }
.trend-col  { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 6px; height: 100%; justify-content: flex-end; }
.trend-bar-track { flex: 1; width: 100%; display: flex; align-items: flex-end; }
.trend-bar  { width: 100%; background: var(--theme-text); border-radius: 2px 2px 0 0; min-height: 4px; }
.trend-label  { font-size: .75rem; font-weight: 500; color: var(--theme-text-light); }
.trend-count  { font-size: .75rem; color: var(--theme-text-light); }
.trend-profit { font-size: .7rem; font-family: monospace; color: var(--theme-text-light); text-align: center; white-space: nowrap; transform: rotate(-45deg) translateY(-5px); }
.empty-chart  { display: flex; align-items: center; justify-content: center; height: 100px; color: var(--theme-text-light); font-size: .9rem; }

/* Filters */
.filter-card { background: var(--theme-elevation-50); border: 1px solid var(--theme-border-color); border-radius: 4px; margin-bottom: 1.5rem; overflow: hidden; }
.filter-header { width: 100%; display: flex; justify-content: space-between; align-items: center; padding: 16px 24px; background: var(--theme-elevation-100); cursor: pointer; border: none; color: var(--theme-text); border-bottom: 1px solid transparent; transition: background .15s; }
.filter-header:hover { background: var(--theme-elevation-150); }
.filter-title  { display: flex; align-items: center; gap: 8px; font-size: .875rem; font-weight: 600; text-transform: uppercase; letter-spacing: .05em; }
.filter-right  { display: flex; align-items: center; gap: 16px; }
.search-wrap   { position: relative; }
.search-icon   { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--theme-text-light); pointer-events: none; }
.search-input  {
  height: 38px; padding: 0 12px 0 38px;
  border: 1px solid var(--theme-border-color); border-radius: 4px;
  background: var(--theme-bg); color: var(--theme-text); font-size: .875rem; outline: none; width: 240px;
}
.search-input:focus { border-color: var(--theme-text); }
.filter-body { padding: 24px; border-top: 1px solid var(--theme-border-color); }
.filter-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; }
.filter-group { display: flex; flex-direction: column; gap: 8px; }
.filter-label  { font-size: .75rem; font-weight: 600; text-transform: uppercase; letter-spacing: .05em; color: var(--theme-text-light); }
.filter-select, .filter-input {
  height: 40px; padding: 0 12px;
  border: 1px solid var(--theme-border-color); border-radius: 4px;
  background: var(--theme-bg); color: var(--theme-text); font-size: .875rem; outline: none;
  transition: border-color .15s;
}
.filter-select:focus, .filter-input:focus { border-color: var(--theme-text); }

/* Tabs */
.tabs-row { display: flex; align-items: center; gap: 8px; margin-bottom: 1rem; border-bottom: 1px solid var(--theme-border-color); padding-bottom: 0; }
.tab-btn  {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 12px 20px; font-size: .875rem; font-weight: 600;
  cursor: pointer; transition: all .15s; border: none; background: transparent;
  color: var(--theme-text-light); position: relative; border-bottom: 2px solid transparent;
}
.tab-btn:hover { color: var(--theme-text); }
.tab-active { color: var(--theme-text) !important; border-bottom-color: var(--theme-text) !important; }
.tab-count { margin-left: auto; font-size: .875rem; color: var(--theme-text-light); }

/* Table */
.table-card  { background: var(--theme-elevation-50); border: 1px solid var(--theme-border-color); border-radius: 4px; overflow: hidden; }
.table-scroll { overflow: auto; max-height: 700px; }
.table { width: 100%; border-collapse: collapse; text-align: left; }
.table th {
  padding: 16px 20px; font-size: .75rem; text-transform: uppercase;
  letter-spacing: .05em; font-weight: 600; color: var(--theme-text-light);
  background: var(--theme-elevation-100);
  border-bottom: 1px solid var(--theme-border-color);
  position: sticky; top: 0; z-index: 10; white-space: nowrap;
}
.table td { padding: 16px 20px; border-bottom: 1px solid var(--theme-border-color); font-size: .875rem; white-space: nowrap; vertical-align: middle; }
.table tr:hover td { background: var(--theme-elevation-100); }
.table tr:last-child td { border-bottom: none; }

/* Insight tab */
.insight-dashboard { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 32px; padding: 32px; }
.insight-col { display: flex; flex-direction: column; gap: 16px; }
.insight-heading { font-size: .75rem; font-weight: 600; color: var(--theme-text-light); text-transform: uppercase; letter-spacing: .05em; margin: 0 0 8px 0; border-bottom: 1px solid var(--theme-border-color); padding-bottom: 12px; }
.insight-list { display: flex; flex-direction: column; gap: 12px; }
.insight-item { display: flex; align-items: flex-start; gap: 16px; padding: 12px; border-radius: 4px; background: var(--theme-elevation-50); border: 1px solid var(--theme-border-color); transition: border-color .2s; }
.insight-item:hover { border-color: var(--theme-elevation-200); }
.insight-rank  { font-size: 1.1rem; font-weight: 700; color: var(--theme-text-light); width: 28px; padding-top: 2px; }
.insight-brand { font-size: .95rem; font-weight: 600; line-height: 1.2; }
.insight-detail { font-size: .8rem; color: var(--theme-text-light); margin-top: 6px; display: flex; flex-direction: column; gap: 4px; }
.insight-row-val { display: flex; justify-content: space-between; gap: 16px; }
.insight-val { font-family: monospace; font-size: .85rem; font-weight: 600; color: var(--theme-text); }

/* Misc */
.badge {
  display: inline-block; padding: 4px 10px; border-radius: 4px;
  font-size: .75rem; font-weight: 600; text-transform: uppercase; letter-spacing: .05em;
}
.icon-btn {
  width: 32px; height: 32px; border-radius: 4px; display: flex; align-items: center; justify-content: center;
  background: var(--theme-elevation-100); color: var(--theme-text); transition: background .15s; border: 1px solid var(--theme-border-color);
}
.icon-btn:hover { background: var(--theme-elevation-200); }
.empty-state { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 80px; color: var(--theme-text-light); font-size: .95rem; }
.fw7 { font-weight: 600; } .fw8 { font-weight: 700; }
.mono { font-family: 'JetBrains Mono', monospace; font-size: .875rem; }
.text-sm { font-size: .875rem; } .text-light { color: var(--theme-text-light); }
.text-success { color: #10b981 !important; }
.text-error { color: #ef4444 !important; }
.text-center { text-align: center; }
input[type="date"]::-webkit-calendar-picker-indicator { filter: var(--theme-is-dark, invert(1)); opacity: .5; cursor: pointer; }
`
