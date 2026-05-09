'use client'

import { useMemo, useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useSite } from '@/context/site-context'
import UrlPath from '../shared/url-path'
import Link from 'next/link'

type LeasingProvider = {
  provider: string
  downPaymentMin: number
  tenorOption: number[]
  interestRate: number
}

type FinanceCardProps = {
  carName: string
  carPrice: number
  leasing: LeasingProvider[]
}

function fmt(n: number) {
  return 'Rp ' + Math.round(n).toLocaleString('id-ID')
}

function fmtShort(n: number) {
  if (n >= 1_000_000_000) return 'Rp ' + (n / 1_000_000_000).toFixed(2) + ' M'
  if (n >= 1_000_000) return 'Rp ' + (n / 1_000_000).toFixed(1) + ' jt'
  return fmt(n)
}

function toMinDpPct(downPaymentMin: number, carPrice: number) {
  return Math.ceil((downPaymentMin / carPrice) * 100)
}

function rateVariant(rate: number): 'default' | 'secondary' | 'destructive' {
  if (rate <= 5.5) return 'default'
  if (rate <= 6.5) return 'secondary'
  return 'destructive'
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-widest mb-2.5">
      {children}
    </p>
  )
}

function BreakdownRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-2 border-b last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium tabular-nums">{value}</span>
    </div>
  )
}

export default function FinanceCard({ carName, carPrice, leasing }: FinanceCardProps) {
  const site = useSite()
  const [providerIdx, setProviderIdx] = useState(0)
  const [tenor, setTenor] = useState<number>(() => leasing[0].tenorOption.slice(-1)[0])
  const [dpPct, setDpPct] = useState<number>(() => toMinDpPct(leasing[0].downPaymentMin, carPrice))

  const provider = leasing[providerIdx]
  const minDpPct = toMinDpPct(provider.downPaymentMin, carPrice)

  const clampedDpPct = Math.min(Math.max(dpPct, minDpPct), 80)

  const downPayment = (clampedDpPct / 100) * carPrice
  const loan = carPrice - downPayment
  const interest = loan * (provider.interestRate / 100) * (tenor / 12)
  const total = loan + interest
  const monthly = total / tenor

  function handleProviderChange(idx: number) {
    const next = leasing[idx]
    const nextMin = toMinDpPct(next.downPaymentMin, carPrice)
    setProviderIdx(idx)
    setTenor(next.tenorOption[0])
    setDpPct((prev) => Math.max(prev, nextMin))
  }

  function handleDpChange(values: number | readonly number[]) {
    const next = Array.isArray(values) ? values[0] : values
    if (typeof next === 'number' && !isNaN(next)) {
      setDpPct(next)
    }
  }
  const defaultMsg = `Halo ${site?.siteName}, saya tertarik dengan mobil ${carName} - (${UrlPath()}).

Saya ingin meminta simulasi kredit dengan detail berikut:
• Leasing/Provider: ${provider.provider}
• DP: ${clampedDpPct}% (${fmt(downPayment)})
• Tenor: ${tenor} bulan
• Harga OTR: ${fmt(carPrice)}

Mohon dibantu informasi estimasi cicilan per bulan dan proses pengajuannya ya. Terima kasih`

  const waLink = useMemo(() => {
    const message = `Halo Mawar Motor, saya tertarik dengan ${carName}`

    return `https://wa.me/6282155636360?text=${encodeURIComponent(message)}`
  }, [carName])
  return (
    <Card className="overflow-hidden w-full">
      {/* ── Header ── */}
      <CardHeader className="pb-0 pt-5 px-5">
        <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-widest">
          Simulasi Cicilan
        </p>
        <p className="text-lg font-semibold mt-0.5">{carName}</p>
        <p className="text-sm text-muted-foreground mt-0.5">
          Harga OTR: <span className="font-medium text-foreground">{fmt(carPrice)}</span>
        </p>
        <Separator />
      </CardHeader>

      <CardContent className="px-5 pt-4 pb-5 space-y-5 flex  gap-5 flex-col md:flex-row">
        <div className="w-full flex flex-col gap-4">
          {/* ── Provider ── */}
          <div>
            <SectionLabel>Pilih Leasing</SectionLabel>
            <div className="grid grid-cols-2 gap-2">
              {leasing.map((l, i) => {
                const active = i === providerIdx
                return (
                  <button
                    key={l.provider}
                    onClick={() => handleProviderChange(i)}
                    className={[
                      'text-left rounded-lg px-3 py-2.5 border transition-all duration-150',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                      active
                        ? 'border-primary ring-1 ring-primary bg-background shadow-sm'
                        : 'border-border bg-muted/40 hover:bg-muted',
                    ].join(' ')}
                  >
                    <p className={`text-[13px] ${active ? 'font-semibold' : 'font-normal'}`}>
                      {l.provider}
                    </p>
                    <Badge
                      variant={rateVariant(l.interestRate)}
                      className="mt-1.5 text-[11px] px-2 py-0"
                    >
                      {l.interestRate}% / th
                    </Badge>
                  </button>
                )
              })}
            </div>
          </div>

          <Separator />

          {/* ── Down Payment ── */}
          <div>
            <div className="flex justify-between items-baseline mb-3">
              <SectionLabel>Uang Muka</SectionLabel>
              <div className="flex items-baseline gap-1.5">
                <span className="text-base font-semibold tabular-nums">{clampedDpPct}%</span>
                <span className="text-sm text-muted-foreground tabular-nums">
                  ≈ {fmtShort(downPayment)}
                </span>
              </div>
            </div>

            {/*
            Pass clampedDpPct (never NaN, always within [min, 80]) to Slider.
            Re-key on minDpPct so Radix re-mounts when the min boundary shifts,
            preventing the controlled→uncontrolled warning.
          */}
            <Slider
              key={`dp-slider-${minDpPct}`}
              value={[clampedDpPct]}
              min={Number(minDpPct)}
              max={80}
              step={1}
              onValueChange={handleDpChange}
            />

            <div className="flex justify-between mt-2">
              <span className="text-[11px] text-muted-foreground">Min {minDpPct}%</span>
              <span className="text-[11px] text-muted-foreground">Maks 80%</span>
            </div>
          </div>

          <Separator />

          {/* ── Tenor ── */}
          <div>
            <SectionLabel>Tenor</SectionLabel>
            <div className="flex flex-wrap gap-1.5">
              {provider.tenorOption.map((t) => (
                <Button
                  key={t}
                  size="sm"
                  variant={t === tenor ? 'default' : 'outline'}
                  onClick={() => setTenor(t)}
                  className="text-[13px]"
                >
                  {t} bln
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          {/* ── Breakdown ── */}
        </div>
        <div className="w-full flex flex-col gap-4">
          <div>
            <SectionLabel>Rincian Pembiayaan</SectionLabel>
            <BreakdownRow label="Harga OTR" value={fmt(carPrice)} />
            <BreakdownRow label={`Uang muka (${clampedDpPct}%)`} value={fmt(downPayment)} />
            <BreakdownRow label="Pokok pinjaman" value={fmt(loan)} />
            <BreakdownRow
              label={`Bunga flat ${provider.interestRate}% × ${(tenor + 1) / 12} thn`}
              value={fmt(interest)}
            />
          </div>

          <Separator />

          {/* ── Hero ── */}
          <div className="bg-muted rounded-xl px-4 py-4 flex justify-between items-center">
            <div>
              <p className="text-[12px] text-muted-foreground">Estimasi cicilan / bulan</p>
              <p className="text-2xl font-bold text-primary mt-0.5 tabular-nums">{fmt(monthly)}</p>
            </div>
            <div className="text-right">
              <p className="text-[12px] text-muted-foreground">Total bayar</p>
              <p className="text-sm font-semibold mt-0.5 tabular-nums">{fmtShort(total)}</p>
            </div>
          </div>

          {/* ── CTA ── */}
          <Link href={waLink} target="_blank">
            <Button className="w-full" size="lg">
              Hubungi WhatsApp
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
