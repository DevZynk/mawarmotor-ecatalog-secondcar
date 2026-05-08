export type MediaType = 'photo' | 'video'
export type MediaCategory = 'all' | 'engine' | 'interior' | 'exterior'

export interface MediaItem {
  id: string
  type: MediaType
  category: MediaCategory
  src: string
  thumb: string
  alt: string
  width?: number
  height?: number
}

export interface GalleryProps {
  items: MediaItem[]
  title?: string
  initialCount?: number
}