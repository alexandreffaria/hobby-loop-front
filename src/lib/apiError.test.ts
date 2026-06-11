import { describe, it, expect } from 'vitest'
import { AxiosError, AxiosHeaders } from 'axios'
import { getApiErrorMessage } from './apiError'

const axiosErrorWithResponse = (status: number, body: unknown): AxiosError => {
  const err = new AxiosError('Request failed', 'ERR_BAD_REQUEST')
  err.response = {
    status,
    statusText: '',
    data: body,
    headers: {},
    config: { headers: new AxiosHeaders() },
  }
  return err
}

describe('getApiErrorMessage', () => {
  it('prefers the API error message', () => {
    const err = axiosErrorWithResponse(409, { error: 'email already in use' })
    expect(getApiErrorMessage(err, 'fallback')).toBe('email already in use')
  })

  it('falls back when the API body has no error field', () => {
    const err = axiosErrorWithResponse(500, {})
    expect(getApiErrorMessage(err, 'fallback')).toBe('fallback')
  })

  it('reports connectivity problems instead of the fallback', () => {
    const err = new AxiosError('Network Error', 'ERR_NETWORK')
    expect(getApiErrorMessage(err, 'E-mail ou senha inválidos.')).toBe(
      'Não foi possível conectar ao servidor. Tente novamente.',
    )
  })

  it('uses the fallback for non-axios errors', () => {
    expect(getApiErrorMessage(new Error('boom'), 'fallback')).toBe('fallback')
  })
})
