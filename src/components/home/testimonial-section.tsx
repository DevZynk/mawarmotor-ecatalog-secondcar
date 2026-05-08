import { getPayloadClient } from '@/lib/payload'
import TestimonialClient from './testimonial-client'

export default async function TestimonialSection() {
  const payload = await getPayloadClient()

  const review = await payload.findGlobal({
    slug: 'review',
  })

  return <TestimonialClient reviews={review.reviews} />
}