import { getPayloadClient } from '@/lib/payload'

export async function GET() {
  const payload = await getPayloadClient()

  const [brands, types] = await Promise.all([
    payload.find({
      collection: 'carBrands',
      sort: '-count',
      where: {
        count: {
          greater_than: 0,
        },
      },
      limit: 0,
    }),
    payload.find({
      collection: 'carTypes',
      sort: '-count',
      where: {
        count: {
          greater_than: 0,
        },
      },
      limit: 0,
    }),
  ])

  return Response.json({ brands: brands.docs, types: types.docs })
}
