'use client'

import React, { useMemo, useState } from 'react'
import {
  TrendingUp,
  TrendingDown,
  Activity,
  DollarSign,
  AlertTriangle,
  Clock,
  CarFront,
  CheckCircle,
  Download,
} from 'lucide-react'
import * as XLSX from 'xlsx'

export default function AnalyticDashboardClient({ cars }: { cars: any[] }) {
  const [filterBrand, setFilterBrand] = useState('All')
  const [filterType, setFilterType] = useState('All')
  const [filterStatus, setFilterStatus] = useState('All')
  const [filterHeat, setFilterHeat] = useState('All')
  const [sortOption, setSortOption] = useState('Unit Terbaru')
  
  // Additional Filters
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [minProfit, setMinProfit] = useState('')
  const [maxProfit, setMaxProfit] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(amount || 0)
  }

  const {
    stats,
    processedCars,
    brands,
    types,
  } = useMemo(() => {
    const now = new Date()

    let totalInvValue = 0
    let totalPotProfit = 0
    let totalRealProfit = 0
    let totalDaysToSell = 0
    let validSoldDays = 0

    let uniqueBrands = new Set<string>()
    let uniqueTypes = new Set<string>()

    const mapped = cars.map((c) => {
      const status = c.analytics?.status || 'available'
      const isAvailable = status === 'available'
      const isSold = status === 'sold'

      const purchaseDateObj = c.analytics?.purchaseDate ? new Date(c.analytics.purchaseDate) : null
      const startDate = purchaseDateObj || new Date(c.createdAt)
      const soldDateObj = c.analytics?.soldDate ? new Date(c.analytics.soldDate) : null
      
      const endDateForDays = soldDateObj || now
      const diffTime = Math.abs(endDateForDays.getTime() - startDate.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      let heatLabel = 'Normal (< 30 Hari)'
      let heatColor = 'var(--theme-success-500)'
      let heatKey = 'green'

      if (isAvailable || status === 'booked') {
        if (diffDays > 90) {
          heatLabel = 'Slow Moving (> 90 Hari)'
          heatColor = 'var(--theme-text)'
          heatKey = 'black'
        } else if (diffDays >= 60) {
          heatLabel = 'Kritis (60-90 Hari)'
          heatColor = 'var(--theme-error-500)'
          heatKey = 'red'
        } else if (diffDays >= 30) {
          heatLabel = 'Peringatan (30-60 Hari)'
          heatColor = 'var(--theme-warning-500)'
          heatKey = 'yellow'
        }
      } else {
        heatLabel = 'Terjual'
        heatColor = 'var(--theme-info-500)'
        heatKey = 'sold'
      }

      const pPrice = c.analytics?.purchasePrice || 0
      
      // Calculate totals from arrays
      const mCost = (c.analytics?.operationalCosts || []).reduce((sum: number, item: any) => sum + (item.cost || 0), 0)
      const rCost = (c.analytics?.repairs || []).reduce((sum: number, item: any) => sum + (item.cost || 0), 0)
      
      const listingPrice = c.price || 0
      const soldPrice = c.analytics?.soldPrice || 0

      const totalCost = pPrice + mCost + rCost
      const profit = isSold ? (soldPrice - totalCost) : (listingPrice - totalCost)

      if (isAvailable) {
        totalInvValue += totalCost
        totalPotProfit += profit
      }

      if (isSold) {
        totalRealProfit += profit
        if (soldDateObj) {
          totalDaysToSell += diffDays
          validSoldDays++
        }
      }

      const brandTitle = c.carBrand?.title || 'Unknown'
      const typeTitle = c.carType?.title || 'Unknown'
      uniqueBrands.add(brandTitle)
      uniqueTypes.add(typeTitle)

      return {
        id: c.id,
        title: c.title,
        plateNumber: c.plateNumber || '-',
        brand: brandTitle,
        type: typeTitle,
        year: c.carSpecification?.buildYear || '-',
        days: diffDays,
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
        status: status,
        createdAt: c.createdAt,
        purchaseDate: c.analytics?.purchaseDate,
        soldDate: c.analytics?.soldDate,
      }
    })

    return {
      stats: {
        availableCount: mapped.filter((c) => c.status === 'available').length,
        soldCount: mapped.filter((c) => c.status === 'sold').length,
        totalInvValue,
        totalPotProfit,
        totalRealProfit,
        avgDaysToSell: validSoldDays > 0 ? Math.round(totalDaysToSell / validSoldDays) : 0,
      },
      processedCars: mapped,
      brands: Array.from(uniqueBrands).sort(),
      types: Array.from(uniqueTypes).sort(),
    }
  }, [cars])

  const filteredAndSortedCars = useMemo(() => {
    let result = processedCars.filter((c) => {
      if (filterBrand !== 'All' && c.brand !== filterBrand) return false
      if (filterType !== 'All' && c.type !== filterType) return false
      if (filterStatus !== 'All' && c.status !== filterStatus) return false
      if (filterHeat !== 'All' && c.heatKey !== filterHeat) return false
      
      // Price Range Filter
      const targetPrice = c.status === 'sold' ? c.soldPrice : c.listingPrice
      if (minPrice && targetPrice < Number(minPrice)) return false
      if (maxPrice && targetPrice > Number(maxPrice)) return false
      
      // Profit Range Filter
      if (minProfit && c.profit < Number(minProfit)) return false
      if (maxProfit && c.profit > Number(maxProfit)) return false
      
      // Date Range Filter
      if (startDate) {
        const dStart = new Date(startDate).getTime()
        const cCreated = new Date(c.createdAt).getTime()
        const cSold = c.soldDate ? new Date(c.soldDate).getTime() : 0
        if (cCreated < dStart && (!cSold || cSold < dStart)) return false
      }
      if (endDate) {
        const dEnd = new Date(endDate).getTime() + 86400000 
        const cCreated = new Date(c.createdAt).getTime()
        const cSold = c.soldDate ? new Date(c.soldDate).getTime() : 0
        if (cCreated > dEnd && (!cSold || cSold > dEnd)) return false
      }

      return true
    })

    result.sort((a, b) => {
      switch (sortOption) {
        case 'Laba Tertinggi':
          return b.profit - a.profit
        case 'Laba Terendah':
          return a.profit - b.profit
        case 'Stok Terlama':
          return b.days - a.days
        case 'Unit Terbaru':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'Harga Tertinggi':
          return (b.status === 'sold' ? b.soldPrice : b.listingPrice) - (a.status === 'sold' ? a.soldPrice : a.listingPrice)
        case 'Harga Terendah':
          return (a.status === 'sold' ? a.soldPrice : a.listingPrice) - (b.status === 'sold' ? b.soldPrice : b.listingPrice)
        default:
          return 0
      }
    })

    return result
  }, [processedCars, filterBrand, filterType, filterStatus, filterHeat, sortOption, minPrice, maxPrice, minProfit, maxProfit, startDate, endDate])

  const exportToCSV = () => {
    const csvRows = []
    const headers = ['Nama Unit', 'No. Polisi', 'Merek', 'Tipe', 'Tahun', 'Status', 'Heat Status', 'Hari', 'Harga Beli', 'Biaya Operasional', 'Biaya Perbaikan', 'Total Modal', 'Harga Listing', 'Harga Jual', 'Laba/Rugi', 'Tgl Input', 'Tgl Terjual', 'Tgl Beli']
    csvRows.push(headers.join(','))

    filteredAndSortedCars.forEach(c => {
      const values = [
        `"${c.title}"`,
        `"${c.plateNumber}"`,
        `"${c.brand}"`,
        `"${c.type}"`,
        c.year,
        c.status,
        `"${c.heatLabel}"`,
        c.days,
        c.purchasePrice,
        c.maintenanceCost,
        c.repairCost,
        c.totalCost,
        c.listingPrice,
        c.soldPrice,
        c.profit,
        new Date(c.createdAt).toLocaleDateString(),
        c.soldDate ? new Date(c.soldDate).toLocaleDateString() : '-',
        c.purchaseDate ? new Date(c.purchaseDate).toLocaleDateString() : '-'
      ]
      csvRows.push(values.join(','))
    })

    const csvData = new Blob([csvRows.join('\n')], { type: 'text/csv' })
    const csvUrl = URL.createObjectURL(csvData)
    const hiddenElement = document.createElement('a')
    hiddenElement.href = csvUrl
    hiddenElement.target = '_blank'
    hiddenElement.download = 'Laporan_Analitik_Mobil.csv'
    hiddenElement.click()
  }

  const exportToExcel = () => {
    const data = filteredAndSortedCars.map(c => ({
      'Nama Unit': c.title,
      'No. Polisi': c.plateNumber,
      'Merek': c.brand,
      'Tipe': c.type,
      'Tahun': c.year,
      'Status': c.status,
      'Status Stok': c.heatLabel,
      'Lama Stok (Hari)': c.days,
      'Harga Beli': c.purchasePrice,
      'Biaya Operasional': c.maintenanceCost,
      'Biaya Perbaikan': c.repairCost,
      'Total Modal': c.totalCost,
      'Harga Listing': c.listingPrice,
      'Harga Jual': c.soldPrice,
      'Laba/Rugi': c.profit,
      'Tanggal Input': new Date(c.createdAt).toLocaleDateString(),
      'Tanggal Terjual': c.soldDate ? new Date(c.soldDate).toLocaleDateString() : '-',
      'Tanggal Beli': c.purchaseDate ? new Date(c.purchaseDate).toLocaleDateString() : '-'
    }))

    const worksheet = XLSX.utils.json_to_sheet(data)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Analitik")
    XLSX.writeFile(workbook, "Laporan_Analitik_Mobil.xlsx")
  }

  return (
    <div className="analytics-dashboard">
      <style>{`
        .analytics-dashboard {
          color: var(--theme-text);
          background-color: var(--theme-bg);
        }
        .dashboard-header {
          margin-bottom: 2rem;
        }
        .dashboard-title {
          font-size: 2.5rem;
          font-weight: 700;
          margin: 0;
          line-height: 1.1;
        }
        .dashboard-subtitle {
          color: var(--theme-text-light);
          margin-top: 0.5rem;
          font-size: 1.1rem;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 20px;
          margin-bottom: 3rem;
        }
        .stat-card {
          background: var(--theme-elevation-50);
          border: 1px solid var(--theme-border-color);
          border-radius: 4px;
          padding: 24px;
          display: flex;
          align-items: center;
          gap: 20px;
          transition: all 0.2s ease;
        }
        .stat-card:hover {
          border-color: var(--theme-text-light);
          background: var(--theme-elevation-100);
        }
        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--theme-elevation-150);
        }
        .stat-label {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--theme-text-light);
          font-weight: 600;
          margin-bottom: 4px;
        }
        .stat-value {
          font-size: 1.5rem;
          font-weight: 700;
        }
        .controls-container {
          background: var(--theme-elevation-50);
          border: 1px solid var(--theme-border-color);
          border-radius: 4px;
          padding: 24px;
          margin-bottom: 2rem;
        }
        .controls-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 24px;
        }
        .control-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .control-label {
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          color: var(--theme-text-light);
        }
        .control-select, .control-input {
          height: 40px;
          padding: 0 12px;
          border: 1px solid var(--theme-border-color);
          border-radius: 4px;
          background: var(--theme-bg);
          color: var(--theme-text);
          font-size: 0.875rem;
          width: 100%;
          outline: none;
        }
        .control-select:focus, .control-input:focus {
          border-color: var(--theme-text);
        }
        .double-input {
          display: flex;
          gap: 8px;
        }
        .export-actions {
          display: flex;
          gap: 12px;
          border-top: 1px solid var(--theme-border-color);
          padding-top: 24px;
        }
        .btn-export {
          height: 40px;
          padding: 0 20px;
          border-radius: 4px;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s;
          border: 1px solid var(--theme-border-color);
        }
        .btn-csv {
          background: var(--theme-elevation-100);
          color: var(--theme-text);
        }
        .btn-csv:hover { background: var(--theme-elevation-200); }
        .btn-excel {
          background: var(--theme-text);
          color: var(--theme-bg);
          border-color: var(--theme-text);
        }
        .btn-excel:hover { opacity: 0.9; }
        .table-container {
          background: var(--theme-elevation-50);
          border: 1px solid var(--theme-border-color);
          border-radius: 4px;
          overflow: auto;
        }
        .data-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          min-width: 2000px;
        }
        .data-table th {
          background: var(--theme-elevation-100);
          padding: 12px 16px;
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-weight: 700;
          color: var(--theme-text-light);
          border-bottom: 1px solid var(--theme-border-color);
          white-space: nowrap;
          position: sticky;
          top: 0;
          z-index: 10;
        }
        .data-table td {
          padding: 16px;
          font-size: 0.875rem;
          border-bottom: 1px solid var(--theme-border-color);
          white-space: nowrap;
        }
        .data-table tr:hover td {
          background: var(--theme-elevation-100);
        }
        .heat-badge {
          padding: 4px 10px;
          border-radius: 2px;
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: white;
          display: inline-block;
        }
        .currency {
          font-variant-numeric: tabular-nums;
          font-family: monospace;
        }
        input[type="date"]::-webkit-calendar-picker-indicator {
          filter: var(--theme-is-dark, invert(1));
        }
      `}</style>

      <div className="dashboard-header">
        <h1 className="dashboard-title">Analitik Bisnis</h1>
        <p className="dashboard-subtitle">Metrik performa dealer dan pelacakan inventaris real-time</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <CarFront size={20} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Stok Tersedia</div>
            <div className="stat-value">{stats.availableCount}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ color: 'var(--theme-success-500)' }}>
            <CheckCircle size={20} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Total Terjual</div>
            <div className="stat-value">{stats.soldCount}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ color: 'var(--theme-warning-500)' }}>
            <Clock size={20} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Rata-rata Lama Terjual</div>
            <div className="stat-value">{stats.avgDaysToSell} Hari</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ color: 'var(--theme-error-500)' }}>
            <DollarSign size={20} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Modal Tertanam (Stok)</div>
            <div className="stat-value currency">{formatCurrency(stats.totalInvValue)}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ color: 'var(--theme-success-500)' }}>
            <TrendingUp size={20} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Potensi Laba</div>
            <div className="stat-value currency">{formatCurrency(stats.totalPotProfit)}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ color: 'var(--theme-info-500)' }}>
            <Activity size={20} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Laba Terealisasi</div>
            <div className="stat-value currency">{formatCurrency(stats.totalRealProfit)}</div>
          </div>
        </div>
      </div>

      <div className="controls-container">
        <div className="controls-grid">
          <div className="control-group">
            <label className="control-label">Merek</label>
            <select className="control-select" value={filterBrand} onChange={e => setFilterBrand(e.target.value)}>
              <option value="All">Semua Merek</option>
              {brands.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <div className="control-group">
            <label className="control-label">Tipe</label>
            <select className="control-select" value={filterType} onChange={e => setFilterType(e.target.value)}>
              <option value="All">Semua Tipe</option>
              {types.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="control-group">
            <label className="control-label">Status</label>
            <select className="control-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              <option value="All">Semua Status</option>
              <option value="available">Tersedia</option>
              <option value="booked">Dipesan</option>
              <option value="sold">Terjual</option>
            </select>
          </div>
          <div className="control-group">
            <label className="control-label">Status Stok (Heat)</label>
            <select className="control-select" value={filterHeat} onChange={e => setFilterHeat(e.target.value)}>
              <option value="All">Semua Status Heat</option>
              <option value="green">Normal (&lt; 30 Hari)</option>
              <option value="yellow">Peringatan (30-60 Hari)</option>
              <option value="red">Kritis (60-90 Hari)</option>
              <option value="black">Slow Moving (&gt; 90 Hari)</option>
            </select>
          </div>
          <div className="control-group">
            <label className="control-label">Urutkan Berdasarkan</label>
            <select className="control-select" value={sortOption} onChange={e => setSortOption(e.target.value)}>
              <option value="Unit Terbaru">Unit Terbaru</option>
              <option value="Stok Terlama">Stok Terlama</option>
              <option value="Laba Tertinggi">Laba Tertinggi</option>
              <option value="Laba Terendah">Laba Terendah</option>
              <option value="Harga Tertinggi">Harga Tertinggi</option>
              <option value="Harga Terendah">Harga Terendah</option>
            </select>
          </div>

          <div className="control-group">
            <label className="control-label">Rentang Harga</label>
            <div className="double-input">
              <input type="number" placeholder="Min" className="control-input" value={minPrice} onChange={e => setMinPrice(e.target.value)} />
              <input type="number" placeholder="Max" className="control-input" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} />
            </div>
          </div>
          
          <div className="control-group">
            <label className="control-label">Rentang Laba</label>
            <div className="double-input">
              <input type="number" placeholder="Min" className="control-input" value={minProfit} onChange={e => setMinProfit(e.target.value)} />
              <input type="number" placeholder="Max" className="control-input" value={maxProfit} onChange={e => setMaxProfit(e.target.value)} />
            </div>
          </div>

          <div className="control-group" style={{ gridColumn: 'span 2' }}>
            <label className="control-label">Rentang Tanggal (Input / Terjual)</label>
            <div className="double-input">
              <input type="date" className="control-input" value={startDate} onChange={e => setStartDate(e.target.value)} />
              <input type="date" className="control-input" value={endDate} onChange={e => setEndDate(e.target.value)} />
            </div>
          </div>

        </div>

        <div className="export-actions">
          <button className="btn-export btn-excel" onClick={exportToExcel}>
            <Download size={16} />
            Ekspor Excel (.xlsx)
          </button>
          <button className="btn-export btn-csv" onClick={exportToCSV}>
            <Download size={16} />
            Ekspor CSV
          </button>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Nama Unit</th>
              <th>No. Polisi</th>
              <th>Merek & Tipe</th>
              <th>Tahun</th>
              <th>Status</th>
              <th>Status Stok</th>
              <th>Lama Stok</th>
              <th>Harga Beli</th>
              <th>Operasional</th>
              <th>Perbaikan</th>
              <th>Total Modal</th>
              <th>Harga Listing</th>
              <th>Harga Jual</th>
              <th>Laba / Rugi</th>
              <th>Tgl Input</th>
              <th>Tgl Terjual</th>
              <th>Tgl Beli</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedCars.map((item) => (
              <tr key={item.id}>
                <td style={{ fontWeight: 600 }}>{item.title}</td>
                <td style={{ fontFamily: 'monospace', fontWeight: 700 }}>{item.plateNumber}</td>
                <td>{item.brand} / {item.type}</td>
                <td>{item.year}</td>
                <td style={{ textTransform: 'uppercase', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.05em' }}>
                   {item.status}
                </td>
                <td>
                  <span className="heat-badge" style={{ backgroundColor: item.heatColor }}>
                    {item.heatLabel}
                  </span>
                </td>
                <td>{item.days} Hari</td>
                <td className="currency">{formatCurrency(item.purchasePrice)}</td>
                <td className="currency">{formatCurrency(item.maintenanceCost)}</td>
                <td className="currency">{formatCurrency(item.repairCost)}</td>
                <td className="currency" style={{ fontWeight: 600 }}>{formatCurrency(item.totalCost)}</td>
                <td className="currency">{formatCurrency(item.listingPrice)}</td>
                <td className="currency">{item.status === 'sold' ? formatCurrency(item.soldPrice) : '-'}</td>
                <td className="currency" style={{ color: item.profit >= 0 ? 'var(--theme-success-500)' : 'var(--theme-error-500)', fontWeight: 700 }}>
                  {item.profit >= 0 ? '+' : ''}{formatCurrency(item.profit)}
                </td>
                <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                <td>{item.soldDate ? new Date(item.soldDate).toLocaleDateString() : '-'}</td>
                <td>{item.purchaseDate ? new Date(item.purchaseDate).toLocaleDateString() : '-'}</td>
              </tr>
            ))}
            {filteredAndSortedCars.length === 0 && (
              <tr>
                <td colSpan={17} style={{ textAlign: 'center', padding: '48px', color: 'var(--theme-text-light)' }}>
                  Tidak ada data kendaraan yang ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
