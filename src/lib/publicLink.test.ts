import { describe, it, expect } from 'vitest'
import { buildPublicLink, displayPublicLink } from './publicLink'

describe('buildPublicLink', () => {
  it('uses the current origin in dev', () => {
    expect(buildPublicLink('abc-123')).toBe(`${window.location.origin}/s/abc-123`)
  })
})

describe('displayPublicLink', () => {
  it('strips the protocol for banner display', () => {
    expect(displayPublicLink('abc-123')).toBe(`${window.location.host}/s/abc-123`)
  })
})
