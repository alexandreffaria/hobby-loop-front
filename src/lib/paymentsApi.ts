import axios from 'axios'

const baseURL = import.meta.env.VITE_PAYMENTS_API_URL
if (!baseURL) throw new Error('VITE_PAYMENTS_API_URL is not set')

// Talks to the payments module. Only public subscriber-checkout endpoints
// for now, so no auth header and no 401 interceptor.
export const paymentsApi = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
})
