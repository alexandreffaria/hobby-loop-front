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

  it('rejects prices above the R$ 1.000.000,00 cap', () => {
    expect(parsePriceCents('1.000.000,01')).toBeNaN()
    expect(parsePriceCents('999999999999')).toBeNaN()
    expect(parsePriceCents('1.000.000,00')).toBe(100_000_000)
  })
})

describe('formatCurrency', () => {
  it('formats cents with pt-BR decimal comma', () => {
    expect(formatCurrency(7800)).toBe('78,00')
  })

  it('groups thousands pt-BR style', () => {
    expect(formatCurrency(123456)).toBe('1.234,56')
  })

  it('round-trips with parsePriceCents', () => {
    expect(parsePriceCents(formatCurrency(123456))).toBe(123456)
  })
})
