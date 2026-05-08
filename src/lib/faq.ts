import type { Car } from '@/payload-types'
import formatRupiah from '@/lib/formatRupiah'

function getTransLabel(t: string) {
  const m: Record<string, string> = { manual: 'Manual', at: 'Automatic (AT)', cvt: 'CVT', dct: 'DCT', amt: 'AMT' }
  return m[t] || t
}

function getFuelLabel(f: string) {
  const m: Record<string, string> = { bensin: 'Bensin', solar: 'Solar', listrik: 'Listrik', hybrid: 'Hybrid' }
  return m[f] || f
}

export function generateFaqItems(car: Car) {
  const brandName = typeof car.carBrand === 'object' && car.carBrand ? car.carBrand.title : null
  const spec = car.carSpecification

  return [
    {
      q: `Berapa harga ${car.title}?`,
      a: `Harga ${car.title} adalah ${formatRupiah(car.price)}. ${
        car.financing?.downPaymentMin
          ? `Tersedia juga skema kredit dengan DP mulai dari ${formatRupiah(car.financing.downPaymentMin)}.`
          : ''
      }`,
    },
    {
      q: `Apa spesifikasi ${car.title}?`,
      a: `${car.title} memiliki mesin ${spec.engine}cc, transmisi ${getTransLabel(spec.transmission)}, bahan bakar ${getFuelLabel(spec.fuel)}, kapasitas ${spec.passenger} penumpang, dan odometer ${spec.odometer.toLocaleString('id-ID')} km.`,
    },
    {
      q: `Apakah ${car.title} masih tersedia?`,
      a: car.analytics.status === 'available'
        ? `Ya, ${car.title} masih tersedia dan siap untuk test drive. Hubungi kami via WhatsApp untuk informasi lebih lanjut.`
        : car.analytics.status === 'booked'
          ? `${car.title} sedang dalam proses booking. Hubungi kami untuk konfirmasi ketersediaan.`
          : `Mohon maaf, ${car.title} sudah terjual. Silakan lihat mobil serupa lainnya.`,
    },
    {
      q: `Tahun berapa ${car.title}?`,
      a: `${car.title} adalah tahun perakitan ${spec.buildYear}, registrasi ${spec.registrationYear}. Warna ${spec.color}.`,
    },
    ...(car.financing?.leasing?.length
      ? [
          {
            q: `Bagaimana cara kredit ${car.title}?`,
            a: `Tersedia ${car.financing.leasing.length} pilihan leasing dengan bunga mulai ${Math.min(
              ...car.financing.leasing.map((l) => l.interestRate),
            )}% per tahun. DP minimum ${formatRupiah(car.financing.downPaymentMin)} dengan tenor hingga 60 bulan. Hubungi kami untuk simulasi detail.`,
          },
        ]
      : []),
  ]
}
