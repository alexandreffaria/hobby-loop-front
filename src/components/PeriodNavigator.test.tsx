import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { PeriodNavigator } from './PeriodNavigator'

describe('PeriodNavigator', () => {
  it('disables "previous" at the earliest period and keeps "next" enabled', () => {
    const onPrev = vi.fn()
    render(
      <PeriodNavigator label="05/06 – 04/07" onPrev={onPrev} onNext={() => {}} canPrev={false} />,
    )
    const prev = screen.getByRole('button', { name: 'Período anterior' }) as HTMLButtonElement
    expect(prev.disabled).toBe(true)
    fireEvent.click(prev)
    expect(onPrev).not.toHaveBeenCalled()
  })

  it('fires onPrev/onNext when enabled', () => {
    const onPrev = vi.fn()
    const onNext = vi.fn()
    render(<PeriodNavigator label="05/06 – 04/07" onPrev={onPrev} onNext={onNext} canPrev />)
    fireEvent.click(screen.getByRole('button', { name: 'Período anterior' }))
    fireEvent.click(screen.getByRole('button', { name: 'Próximo período' }))
    expect(onPrev).toHaveBeenCalledTimes(1)
    expect(onNext).toHaveBeenCalledTimes(1)
  })
})
