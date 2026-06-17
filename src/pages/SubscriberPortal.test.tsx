import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SubscriberPortal } from './SubscriberPortal'
import {
  cancelSubscriberPortal,
  getSubscriberPortal,
  type Subscriber,
  type SubscriberPortal as SubscriberPortalData,
} from '../services/subscriber.service'

vi.mock('../services/subscriber.service', () => ({
  getSubscriberPortal: vi.fn(),
  cancelSubscriberPortal: vi.fn(),
}))

const subscriber: Subscriber = {
  id: 'sub-1',
  name: 'Pedro Santos',
  email: 'pedro@example.com',
  status: 'active',
  created_at: '2026-06-12T00:00:00Z',
}

const portal: SubscriberPortalData = {
  subscriber,
  plan: {
    id: 'plan-1',
    name: 'Kit Higiene',
    description: 'Kit mensal',
    price_cents: 7800,
    products: [{ id: 'p1', name: 'Desodorante' }],
    active_subscribers: 1,
    created_at: '2026-01-01T00:00:00Z',
    archived: false,
  },
}

function renderPortal() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/assinatura/tok-1']}>
        <Routes>
          <Route path="/assinatura/:token" element={<SubscriberPortal />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('SubscriberPortal', () => {
  beforeEach(() => {
    vi.mocked(getSubscriberPortal).mockReset()
    vi.mocked(cancelSubscriberPortal).mockReset()
    vi.spyOn(window, 'confirm').mockReturnValue(true)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders plan, subscriber and active status', async () => {
    vi.mocked(getSubscriberPortal).mockResolvedValue(portal)
    renderPortal()

    expect(await screen.findByText('Kit Higiene')).toBeDefined()
    expect(screen.getByText('Pedro Santos')).toBeDefined()
    expect(screen.getByText('pedro@example.com')).toBeDefined()
    expect(screen.getByText('Ativa')).toBeDefined()
    expect(screen.getByRole('button', { name: 'Cancelar assinatura' })).toBeDefined()
  })

  it('cancels after confirmation and flips to the canceled state', async () => {
    vi.mocked(getSubscriberPortal).mockResolvedValue(portal)
    vi.mocked(cancelSubscriberPortal).mockResolvedValue({ ...subscriber, status: 'canceled' })
    renderPortal()

    fireEvent.click(await screen.findByRole('button', { name: 'Cancelar assinatura' }))
    expect(window.confirm).toHaveBeenCalled()
    await waitFor(() => expect(cancelSubscriberPortal).toHaveBeenCalledWith('tok-1'))

    expect(await screen.findByText('Sua assinatura foi cancelada.')).toBeDefined()
    expect(screen.getByText('Cancelada')).toBeDefined()
    expect(screen.queryByRole('button', { name: 'Cancelar assinatura' })).toBeNull()
  })

  it('does not cancel when the confirmation is dismissed', async () => {
    vi.mocked(getSubscriberPortal).mockResolvedValue(portal)
    vi.spyOn(window, 'confirm').mockReturnValue(false)
    renderPortal()

    fireEvent.click(await screen.findByRole('button', { name: 'Cancelar assinatura' }))
    expect(cancelSubscriberPortal).not.toHaveBeenCalled()
  })

  it('shows an error banner when canceling fails', async () => {
    vi.mocked(getSubscriberPortal).mockResolvedValue(portal)
    vi.mocked(cancelSubscriberPortal).mockRejectedValue(new Error('boom'))
    renderPortal()

    fireEvent.click(await screen.findByRole('button', { name: 'Cancelar assinatura' }))
    expect(
      await screen.findByText('Não foi possível cancelar. Tente novamente.'),
    ).toBeDefined()
    // Still cancellable — the subscription was not canceled.
    expect(screen.getByRole('button', { name: 'Cancelar assinatura' })).toBeDefined()
  })

  it('shows the not-found state for a bad link', async () => {
    vi.mocked(getSubscriberPortal).mockRejectedValue(new Error('404'))
    renderPortal()

    expect(await screen.findByText('Assinatura não encontrada.')).toBeDefined()
  })
})
