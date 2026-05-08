import { getPayload } from 'payload'
import config from '@payload-config'
import { Payload } from 'payload'

let cached: any

export const getPayloadClient = async (): Promise<Payload>=> {
  if (!cached) {
    cached = await getPayload({ config })
  }
  return cached
}
