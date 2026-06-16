import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { StatusSelector } from './StatusSelector'

describe('StatusSelector', () => {
  it('renders the three delivery options with the selected one checked', () => {
    render(<StatusSelector value="shipped" onChange={() => {}} />)
    expect(screen.getByRole('radio', { name: 'em preparação' }).getAttribute('aria-checked')).toBe('false')
    expect(screen.getByRole('radio', { name: 'enviado' }).getAttribute('aria-checked')).toBe('true')
    expect(screen.getByRole('radio', { name: 'entregue' }).getAttribute('aria-checked')).toBe('false')
  })

  it('calls onChange with the clicked status', () => {
    const onChange = vi.fn()
    render(<StatusSelector value="preparing" onChange={onChange} />)
    fireEvent.click(screen.getByRole('radio', { name: 'entregue' }))
    expect(onChange).toHaveBeenCalledWith('delivered')
  })

  it('does not call onChange when the already-selected option is clicked', () => {
    const onChange = vi.fn()
    render(<StatusSelector value="delivered" onChange={onChange} />)
    fireEvent.click(screen.getByRole('radio', { name: 'entregue' }))
    expect(onChange).not.toHaveBeenCalled()
  })

  it('moves and selects with arrow keys (radiogroup pattern)', () => {
    const onChange = vi.fn()
    render(<StatusSelector value="preparing" onChange={onChange} />)
    const preparing = screen.getByRole('radio', { name: 'em preparação' })
    fireEvent.keyDown(preparing, { key: 'ArrowRight' })
    expect(onChange).toHaveBeenCalledWith('shipped')
    // wraps backward from the first option to the last
    fireEvent.keyDown(preparing, { key: 'ArrowLeft' })
    expect(onChange).toHaveBeenCalledWith('delivered')
  })

  it('only the selected option is in the tab order', () => {
    render(<StatusSelector value="shipped" onChange={() => {}} />)
    expect(screen.getByRole('radio', { name: 'enviado' }).getAttribute('tabindex')).toBe('0')
    expect(screen.getByRole('radio', { name: 'em preparação' }).getAttribute('tabindex')).toBe('-1')
  })

  it('does not call onChange when disabled', () => {
    const onChange = vi.fn()
    render(<StatusSelector value="preparing" onChange={onChange} disabled />)
    const shipped = screen.getByRole('radio', { name: 'enviado' }) as HTMLButtonElement
    expect(shipped.disabled).toBe(true)
    fireEvent.click(shipped)
    expect(onChange).not.toHaveBeenCalled()
  })
})
