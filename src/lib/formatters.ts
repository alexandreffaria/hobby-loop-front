const brl = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

// "78,00", "1.234,56" — without the R$ symbol (callers render it).
export const formatCurrency = (cents: number): string => brl.format(cents / 100)

// Highest accepted price: R$ 1.000.000,00. Far below int32 range so the
// backend's INTEGER price_cents column can never overflow from the UI.
const maxPriceCents = 100_000_000

// Accepts pt-BR price input: "78", "78,00", "1.234,56" (dot = thousands,
// comma = decimals). Returns NaN for anything else so callers can reject it.
export const parsePriceCents = (raw: string): number => {
  const clean = raw.trim()
  const ptBRPrice = /^\d{1,3}(\.\d{3})*(,\d{1,2})?$/
  const plainPrice = /^\d+(,\d{1,2})?$/
  if (!ptBRPrice.test(clean) && !plainPrice.test(clean)) return NaN
  const cents = Math.round(parseFloat(clean.replace(/\./g, '').replace(',', '.')) * 100)
  return cents > maxPriceCents ? NaN : cents
}
