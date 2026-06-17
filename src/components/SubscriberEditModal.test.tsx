import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { SubscriberEditModal } from './SubscriberEditModal'

const initial = { name: 'João', phone: '11', address: 'Rua A', cep: '01310', complement: 'ap 1' }

function renderModal(over: Partial<Parameters<typeof SubscriberEditModal>[0]> = {}) {
  const onSubmit = vi.fn()
  render(
    <SubscriberEditModal
      subscriberName="João"
      initial={initial}
      isPending={false}
      serverError={null}
      onSubmit={onSubmit}
      onClose={() => {}}
      {...over}
    />,
  )
  return { onSubmit }
}

describe('SubscriberEditModal', () => {
  it('prefills the form from initial values', () => {
    renderModal()
    expect((screen.getByLabelText('Nome') as HTMLInputElement).value).toBe('João')
    expect((screen.getByLabelText(/Endereço/) as HTMLInputElement).value).toBe('Rua A')
  })

  it('blocks submit and shows an error when a required field is empty', () => {
    const { onSubmit } = renderModal({ initial: { ...initial, name: '' } })
    fireEvent.click(screen.getByRole('button', { name: 'Salvar' }))
    expect(onSubmit).not.toHaveBeenCalled()
    expect(screen.getByRole('alert').textContent).toMatch(/obrigatório/i)
  })

  it('submits trimmed values when valid', () => {
    const { onSubmit } = renderModal({ initial: { ...initial, name: '  João Updated  ' } })
    fireEvent.click(screen.getByRole('button', { name: 'Salvar' }))
    expect(onSubmit).toHaveBeenCalledWith({
      name: 'João Updated',
      phone: '11',
      address: 'Rua A',
      cep: '01310',
      complement: 'ap 1',
    })
  })
})
