import type { DeliveryStatus, DeliverySubscriber } from '../services/delivery.service'

const STATUS_LABELS: Record<DeliveryStatus, string> = {
  preparing: 'em preparação',
  shipped: 'enviado',
  delivered: 'entregue',
}

const CSV_HEADER = [
  'Nome',
  'Email',
  'Telefone',
  'Endereço',
  'Complemento',
  'CEP',
  'Produtos',
  'Status',
  'Período',
]

// UTF-8 byte-order mark so spreadsheets (Excel) render accented text correctly.
const BOM = '﻿'

// RFC 4180 quoting: wrap a field in quotes when it contains a comma, quote, or
// line break, doubling any embedded quotes.
function csvField(value: string): string {
  return /[",\n\r]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value
}

/** Builds the monthly shipping list as CSV text (BOM-prefixed UTF-8). */
export function buildShippingCsv(
  subscribers: DeliverySubscriber[],
  productNames: string[],
  periodLabel: string,
): string {
  const products = productNames.join('; ')
  const rows = subscribers.map((s) =>
    [
      s.name,
      s.email,
      s.phone,
      s.address,
      s.complement,
      s.cep,
      products,
      STATUS_LABELS[s.delivery_status],
      periodLabel,
    ]
      .map(csvField)
      .join(','),
  )
  const lines = [CSV_HEADER.map(csvField).join(','), ...rows]
  return BOM + lines.join('\r\n')
}

/** Triggers a client-side file download of text content. */
export function downloadTextFile(
  filename: string,
  content: string,
  mime = 'text/csv;charset=utf-8',
): void {
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
