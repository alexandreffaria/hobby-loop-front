import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL
if (!baseURL) throw new Error('VITE_API_URL is not set')

// Core API client for PUBLIC (subscriber-facing) endpoints. Deliberately
// separate from `api`: no Bearer token is attached (visitors have no
// account) and no 401 interceptor — a stray 401 must never clear the
// company session or redirect a paying customer to /login.
export const publicApi = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
})
