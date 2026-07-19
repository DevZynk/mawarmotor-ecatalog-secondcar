import { getPayload } from 'payload'
import config from '@payload-config'
import { Payload } from 'payload'

let cached: any

export const getPayloadClient = async (): Promise<Payload> => {
  if (!cached) {
    // ponytail: Drizzle pushDevSchema retry — ALTER "serial" pseudo-type fails on first
    // pass but succeeds on retry; max 3 attempts, add migration if this breaks
    let lastErr: unknown
    for (let i = 0; i < 3; i++) {
      try {
        cached = await getPayload({ config })
        break
      } catch (e: any) {
        lastErr = e
        if (!e?.payloadInitError) throw e
        await new Promise((r) => setTimeout(r, 1000))
      }
    }
    if (!cached) throw lastErr
  }
  return cached
}
