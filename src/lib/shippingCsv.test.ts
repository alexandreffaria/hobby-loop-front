import { describe, it, expect } from 'vitest'
import { buildShippingCsv } from './shippingCsv'
import type { DeliverySubscriber } from '../services/delivery.service'

const sub = (over: Partial<DeliverySubscriber>): DeliverySubscriber => ({
  id: 'x',
  name: 'João',
  email: 'j@x.com',
  phone: '11999',
  address: 'Rua A',
  cep: '01310-100',
  complement: '',
  status: 'active',
  delivery_status: 'preparing',
  ...over,
})

describe('buildShippingCsv', () => {
  it('starts with a UTF-8 BOM followed by the header row', () => {
    const csv = buildShippingCsv([], [], 'Junho 2026')
    expect(csv.charCodeAt(0)).toBe(0xfeff)
    expect(csv.slice(1).split('\r\n')[0]).toBe(
      'Nome,Email,Telefone,Endereço,Complemento,CEP,Produtos,Status,Período',
    )
  })

  it('maps status to pt-BR labels and joins product names', () => {
    const csv = buildShippingCsv([sub({ delivery_status: 'shipped' })], ['Desodorante', 'Sabonete'], 'Junho 2026')
    const row = csv.slice(1).split('\r\n')[1]
    expect(row).toContain('enviado')
    expect(row).toContain('Desodorante; Sabonete')
    expect(row).toContain('Junho 2026')
  })

  it('RFC-4180-quotes fields with commas, quotes, or newlines', () => {
    const csv = buildShippingCsv(
      [sub({ name: 'Silva, João', address: 'Rua "X"', complement: 'linha1\nlinha2' })],
      [],
      'Junho 2026',
    )
    const row = csv.slice(1).split('\r\n')[1]
    expect(row).toContain('"Silva, João"')
    expect(row).toContain('"Rua ""X"""')
    expect(row).toContain('"linha1\nlinha2"')
  })
})
