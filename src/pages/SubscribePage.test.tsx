import { describe, it, expect } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SubscribePage } from './SubscribePage'
import type { Subscription } from '../services/subscription.service'

const plan: Subscription = {
  id: 'abc',
  name: 'Kit Higiene',
  description: 'Kit mensal',
  price_cents: 7800,
  products: [{ id: 'p1', name: 'Desodorante' }],
  created_at: '2026-01-01T00:00:00Z',
}

function renderPage() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  // Seed the cache so the form renders without a backend.
  queryClient.setQueryData(['public-subscription', 'abc'], plan)
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/s/abc']}>
        <Routes>
          <Route path="/s/:id" element={<SubscribePage />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('SubscribePage e-mail confirmation', () => {
  it('blocks submission when the e-mails do not match', () => {
    renderPage()
    fireEvent.change(screen.getByLabelText('Seu nome'), { target: { value: 'Ana' } })
    fireEvent.change(screen.getByLabelText('Telefone'), { target: { value: '11 99999' } })
    fireEvent.change(screen.getByLabelText('E-mail'), { target: { value: 'ana@example.com' } })
    fireEvent.change(screen.getByLabelText('Confirmar e-mail'), {
      target: { value: 'ana@exemplo.com' },
    })
    fireEvent.change(screen.getByLabelText('Endereço'), { target: { value: 'Rua A, 1' } })
    fireEvent.change(screen.getByLabelText('CEP'), { target: { value: '01310-100' } })

    fireEvent.click(screen.getByRole('button', { name: 'Continuar para pagamento →' }))
    expect(screen.getByText('Os e-mails não coincidem.')).toBeDefined()
  })

  it('accepts matching e-mails regardless of case and spacing', () => {
    renderPage()
    fireEvent.change(screen.getByLabelText('Seu nome'), { target: { value: 'Ana' } })
    fireEvent.change(screen.getByLabelText('Telefone'), { target: { value: '11 99999' } })
    fireEvent.change(screen.getByLabelText('E-mail'), { target: { value: 'ana@example.com' } })
    fireEvent.change(screen.getByLabelText('Confirmar e-mail'), {
      target: { value: ' ANA@example.com ' },
    })
    fireEvent.change(screen.getByLabelText('Endereço'), { target: { value: 'Rua A, 1' } })
    fireEvent.change(screen.getByLabelText('CEP'), { target: { value: '01310-100' } })

    fireEvent.click(screen.getByRole('button', { name: 'Continuar para pagamento →' }))
    // Validation passed — the mismatch message is absent (the mutation then
    // fails in jsdom, which is outside this test's scope).
    expect(screen.queryByText('Os e-mails não coincidem.')).toBeNull()
  })
})
