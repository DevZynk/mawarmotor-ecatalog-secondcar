import { usePathname } from 'next/navigation'

export default function UrlPath() {
  const pathname = usePathname()

  const fullUrl = typeof window !== 'undefined' ? window.location.origin + pathname : pathname

  return fullUrl
}
