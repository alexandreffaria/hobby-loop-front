import { api } from '../lib/api'

export interface RegisterRequest {
  name: string
  email: string
  password: string
  company: string
  tax_id: string
  tax_id_type: 'CPF' | 'CNPJ'
  phone: string
  address: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface AuthUser {
  id: string
  name: string
  email: string
  company: string
  tax_id: string
  tax_id_type: 'CPF' | 'CNPJ'
  phone: string
  address: string
}

export interface AuthResponse {
  token: string
  user: AuthUser
}

export const register = (body: RegisterRequest): Promise<AuthResponse> =>
  api
    .post<{ data: AuthResponse }>('/api/v1/auth/register', body)
    .then((r) => r.data.data)

export const login = (body: LoginRequest): Promise<AuthResponse> =>
  api
    .post<{ data: AuthResponse }>('/api/v1/auth/login', body)
    .then((r) => r.data.data)
