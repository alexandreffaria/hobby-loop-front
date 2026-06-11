export interface BannerFormat {
  id: 'story' | 'post' | 'landscape'
  label: string
  width: number
  height: number
}

export const BANNER_FORMATS: BannerFormat[] = [
  { id: 'story', label: 'Story / Status · 1080×1920', width: 1080, height: 1920 },
  { id: 'post', label: 'Post · 1080×1080', width: 1080, height: 1080 },
  { id: 'landscape', label: 'Paisagem · 1200×630', width: 1200, height: 630 },
]

export const bannerFilename = (planName: string, format: BannerFormat): string => {
  const slug = planName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
  return `${slug || 'banner'}-${format.id}-${format.width}x${format.height}.png`
}
