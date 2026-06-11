import { describe, it, expect } from 'vitest'
import { formatCurrency, parsePriceCents } from './formatters'

describe('parsePriceCents', () => {
  it.each([
    ['78,00', 7800],
    ['78', 7800],
    ['0,50', 50],
    ['1.234,56', 123456],
    ['12.345', 1234500],
    [' 78,00 ', 7800],
  ])('parses %s as %d cents', (raw, cents) => {
    expect(parsePriceCents(raw)).toBe(cents)
  })

  it.each([['12abc'], [''], ['abc'], ['0,001'], ['1,2,3'], ['78.00,10']])(
    'rejects %s as NaN',
    (raw) => {
      expect(parsePriceCents(raw)).toBeNaN()
    },
  )
})

describe('formatCurrency', () => {
  it('formats cents with pt-BR decimal comma', () => {
    expect(formatCurrency(7800)).toBe('78,00')
  })

  it('round-trips with parsePriceCents', () => {
    expect(parsePriceCents(formatCurrency(123456))).toBe(123456)
  })
})
