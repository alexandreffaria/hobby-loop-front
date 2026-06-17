import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SubscribePage } from './SubscribePage'
import { createSubscriber } from '../services/subscriber.service'
import type { Subscription } from '../services/subscription.service'

// The page must never hit the network in tests: the plan query is satisfied
// from a seeded cache (staleTime Infinity blocks the mount refetch) and the
// create-subscriber call is mocked.
vi.mock('../services/subscriber.service', () => ({
  getPublicSubscription: vi.fn(),
  createSubscriber: vi.fn(),
}))

const plan: Subscription = {
  id: 'abc',
  name: 'Kit Higiene',
  description: 'Kit mensal',
  price_cents: 7800,
  products: [{ id: 'p1', name: 'Desodorante' }],
  active_subscribers: 0,
  created_at: '2026-01-01T00:00:00Z',
  archived: false,
}

function renderPage() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, staleTime: Infinity } },
  })
  queryClient.setQueryData(['public-subscription', 'abc'], plan)
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/s/abc']}>
        <Routes>
          <Route path="/s/:id" element={<SubscribePage />} />
          <Route path="/s/:id/pagamento" element={<div>pagamento-page</div>} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

function fillForm(confirmEmail: string) {
  fireEvent.change(screen.getByLabelText('Seu nome'), { target: { value: 'Ana' } })
  fireEvent.change(screen.getByLabelText('Telefone'), { target: { value: '11 99999' } })
  fireEvent.change(screen.getByLabelText('E-mail'), { target: { value: 'ana@example.com' } })
  fireEvent.change(screen.getByLabelText('Confirmar e-mail'), { target: { value: confirmEmail } })
  fireEvent.change(screen.getByLabelText('Endereço'), { target: { value: 'Rua A, 1' } })
  fireEvent.change(screen.getByLabelText('CEP'), { target: { value: '01310-100' } })
}

describe('SubscribePage e-mail confirmation', () => {
  beforeEach(() => {
    vi.mocked(createSubscriber).mockReset()
  })

  it('blocks submission when the e-mails do not match', () => {
    renderPage()
    fillForm('ana@exemplo.com')
    fireEvent.click(screen.getByRole('button', { name: 'Continuar para pagamento →' }))
    expect(screen.getByText('Os e-mails não coincidem.')).toBeDefined()
    expect(createSubscriber).not.toHaveBeenCalled()
  })

  it('requires the confirm field like the other required fields', () => {
    renderPage()
    fillForm('')
    fireEvent.click(screen.getByRole('button', { name: 'Continuar para pagamento →' }))
    expect(screen.getByText('Preencha todos os campos (complemento é opcional).')).toBeDefined()
    expect(createSubscriber).not.toHaveBeenCalled()
  })

  it('submits and navigates to payment when the e-mails match (case/space-insensitive)', async () => {
    vi.mocked(createSubscriber).mockResolvedValue({
      id: 'sub-1',
      name: 'Ana',
      email: 'ana@example.com',
      status: 'pending_payment',
      created_at: '2026-01-01T00:00:00Z',
    })
    renderPage()
    fillForm(' ANA@example.com ')
    fireEvent.click(screen.getByRole('button', { name: 'Continuar para pagamento →' }))

    await waitFor(() => expect(createSubscriber).toHaveBeenCalledTimes(1))
    expect(createSubscriber).toHaveBeenCalledWith('abc', {
      name: 'Ana',
      phone: '11 99999',
      email: 'ana@example.com',
      address: 'Rua A, 1',
      cep: '01310-100',
      complement: '',
    })
    expect(await screen.findByText('pagamento-page')).toBeDefined()
  })
})
