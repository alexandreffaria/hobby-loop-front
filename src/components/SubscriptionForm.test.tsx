import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SubscriptionForm } from './SubscriptionForm'
import type { Subscription } from '../services/subscription.service'

const subscription: Subscription = {
  id: 'abc-123',
  name: 'Kit Higiene',
  description: 'Kit mensal de higiene',
  price_cents: 7800,
  products: [
    { id: 'p1', name: 'Desodorante' },
    { id: 'p2', name: 'Sabonete' },
  ],
  active_subscribers: 0,
  created_at: '2026-01-01T00:00:00Z',
}

function renderForm(props: Partial<Parameters<typeof SubscriptionForm>[0]> = {}) {
  const onSubmit = vi.fn()
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  render(
    <QueryClientProvider client={queryClient}>
      <SubscriptionForm
        isPending={false}
        serverError={null}
        submitLabel="Salvar"
        pendingLabel="Salvando..."
        onSubmit={onSubmit}
        {...props}
      />
    </QueryClientProvider>,
  )
  return { onSubmit }
}

describe('SubscriptionForm', () => {
  it('blocks submit and shows a message when name is empty', () => {
    const { onSubmit } = renderForm()
    fireEvent.click(screen.getByRole('button', { name: 'Salvar' }))
    expect(screen.getByText('Nome é obrigatório.')).toBeDefined()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('pre-fills fields from the initial subscription', () => {
    renderForm({ initial: subscription })
    expect(screen.getByLabelText('Nome da assinatura')).toHaveProperty('value', 'Kit Higiene')
    expect(screen.getByLabelText('Descrição')).toHaveProperty('value', 'Kit mensal de higiene')
    expect(screen.getByLabelText('Valor da assinatura')).toHaveProperty('value', '78,00')
  })

  it('submits parsed values from a pre-filled form', () => {
    const { onSubmit } = renderForm({ initial: subscription })
    fireEvent.click(screen.getByRole('button', { name: 'Salvar' }))
    expect(onSubmit).toHaveBeenCalledWith({
      name: 'Kit Higiene',
      description: 'Kit mensal de higiene',
      price_cents: 7800,
      product_ids: ['p1', 'p2'],
    })
  })

  it('rejects an invalid price', () => {
    const { onSubmit } = renderForm({ initial: subscription })
    fireEvent.change(screen.getByLabelText('Valor da assinatura'), {
      target: { value: 'abc' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Salvar' }))
    expect(screen.getByText('Informe um valor válido.')).toBeDefined()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('shows the server error and the pending label', () => {
    renderForm({ serverError: 'Erro ao salvar assinatura.', isPending: true })
    expect(screen.getByText('Erro ao salvar assinatura.')).toBeDefined()
    expect(screen.getByRole('button', { name: 'Salvando...' })).toBeDefined()
  })
})
