export const formatCurrency = (cents: number): string => {
  return (cents / 100).toFixed(2).replace('.', ',')
}

// Accepts pt-BR price input: "78", "78,00", "1.234,56" (dot = thousands,
// comma = decimals). Returns NaN for anything else so callers can reject it.
export const parsePriceCents = (raw: string): number => {
  const clean = raw.trim()
  const ptBRPrice = /^\d{1,3}(\.\d{3})*(,\d{1,2})?$/
  const plainPrice = /^\d+(,\d{1,2})?$/
  if (!ptBRPrice.test(clean) && !plainPrice.test(clean)) return NaN
  return Math.round(parseFloat(clean.replace(/\./g, '').replace(',', '.')) * 100)
}
