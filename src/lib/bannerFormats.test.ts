import { describe, it, expect } from 'vitest'
import { BANNER_FORMATS, bannerFilename } from './bannerFormats'

describe('BANNER_FORMATS', () => {
  it('defines the three known media sizes', () => {
    expect(BANNER_FORMATS.map((f) => [f.id, f.width, f.height])).toEqual([
      ['story', 1080, 1920],
      ['post', 1080, 1080],
      ['landscape', 1200, 630],
    ])
  })
})

describe('bannerFilename', () => {
  it('slugifies the plan name, including accents', () => {
    expect(bannerFilename('Kit Higiene Café', BANNER_FORMATS[0])).toBe(
      'kit-higiene-cafe-story-1080x1920.png',
    )
  })

  it('falls back to "banner" when the name has no usable characters', () => {
    expect(bannerFilename('???', BANNER_FORMATS[1])).toBe('banner-post-1080x1080.png')
  })
})
