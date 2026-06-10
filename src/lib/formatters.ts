export const formatCurrency = (cents: number): string => {
  return (cents / 100).toFixed(2).replace('.', ',')
}

export const parsePriceCents = (raw: string): number =>
  Math.round(parseFloat(raw.replace(',', '.')) * 100)

export const formatPriceStr = (cents: number): string =>
  (cents / 100).toFixed(2).replace('.', ',')
