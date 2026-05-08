export default function formatRupiahShort(value?: number) {
  if (!value) return '-'

  const format = (num: number, digit: number) =>
    num.toFixed(digit).replace('.', ',').replace(/,0+$/, '') // hapus ,0 atau ,00

  if (value >= 1_000_000_000) {
    return `Rp ${format(value / 1_000_000_000, 2)} Miliar`
  }

  if (value >= 1_000_000) {
    return `Rp ${format(value / 1_000_000, 1)} Juta`
  }

  if (value >= 1_000) {
    return `Rp ${format(value / 1_000, 0)} Ribu`
  }

  return `Rp ${value}`
}
