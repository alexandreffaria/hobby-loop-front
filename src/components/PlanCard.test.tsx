import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { PlanCard } from './PlanCard'

function renderCard(activeSubscribers: number) {
  render(
    <MemoryRouter>
      <PlanCard
        id="plan-1"
        name="Kit Higiene"
        description="Kit mensal"
        priceCents={7800}
        activeSubscribers={activeSubscribers}
        onEdit={vi.fn()}
        onManage={vi.fn()}
      />
    </MemoryRouter>,
  )
}

describe('PlanCard', () => {
  it('shows the active subscriber badge', () => {
    renderCard(3)
    const badge = screen.getByLabelText('3 assinantes ativos')
    expect(badge.textContent).toContain('3')
  })

  it('uses the singular form for one subscriber', () => {
    renderCard(1)
    expect(screen.getByLabelText('1 assinante ativo')).toBeDefined()
  })

  it('links the share button to the public banner page', () => {
    renderCard(0)
    const share = screen.getByRole('link', { name: /Compartilhar/ })
    expect(share.getAttribute('href')).toBe('/banner/plan-1')
  })
})
