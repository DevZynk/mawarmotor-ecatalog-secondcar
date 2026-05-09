import { getPayload } from 'payload'
import config from '@payload-config'
import AnalyticDashboardClient from './AnalyticDashboardClient'
import { Gutter } from '@payloadcms/ui'

import { headers } from 'next/headers'

export default async function AnalyticDashboard() {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: await headers() })

  if (!user || (user.role !== '1' && user.role !== '2')) {
    return (
      <Gutter className="p-8">
        <h1>Akses Dashboard Ditolak</h1>
        <p>Anda tidak memiliki izin untuk mengakses halaman ini.</p>
      </Gutter>
    )
  }
  
  // Fetch all cars
  const carsResult = await payload.find({
    collection: 'cars',
    limit: 0,
    depth: 1,
  })

  const cars = carsResult.docs

  return (
    <Gutter className='p-8'>
      <AnalyticDashboardClient cars={cars} />
    </Gutter>
  )
}
