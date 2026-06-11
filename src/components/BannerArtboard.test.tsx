import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BannerArtboard } from './BannerArtboard'
import { BANNER_FORMATS } from '../lib/bannerFormats'
import { displayPublicLink } from '../lib/publicLink'
import type { Subscription } from '../services/subscription.service'

const plan: Subscription = {
  id: 'abc-123',
  name: 'Kit Higiene',
  description: 'Kit mensal de higiene',
  price_cents: 7800,
  products: [
    { id: 'p1', name: 'Desodorante' },
    { id: 'p2', name: 'Sabonete' },
    { id: 'p3', name: 'Hidratante' },
  ],
  created_at: '2026-01-01T00:00:00Z',
}

describe('BannerArtboard', () => {
  it('renders plan name, products, formatted price and plan link', () => {
    render(<BannerArtboard plan={plan} format={BANNER_FORMATS[0]} />)
    expect(screen.getByText('Kit Higiene')).toBeDefined()
    expect(screen.getByText(/Desodorante/)).toBeDefined()
    expect(screen.getByText(/78,00/)).toBeDefined()
    expect(screen.getByText(displayPublicLink('abc-123'))).toBeDefined()
  })

  it.each(BANNER_FORMATS)('sizes the artboard to $id dimensions', (format) => {
    const { container } = render(<BannerArtboard plan={plan} format={format} />)
    const artboard = container.firstElementChild as HTMLElement
    expect(artboard.style.width).toBe(`${format.width}px`)
    expect(artboard.style.height).toBe(`${format.height}px`)
  })
})
