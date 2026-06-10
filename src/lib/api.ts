import axios from 'axios'
import { getToken, removeToken } from './token'
import { queryClient } from './queryClient'

const baseURL = import.meta.env.VITE_API_URL
if (!baseURL) throw new Error('VITE_API_URL is not set')

export const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (axios.isAxiosError(err) && err.response?.status === 401) {
      // Auth endpoints legitimately return 401 for wrong credentials — do not
      // redirect there, or the login page would reload itself on every bad attempt.
      const isAuthEndpoint = err.config?.url?.includes('/auth/')
      if (!isAuthEndpoint) {
        removeToken()
        queryClient.clear()
        window.location.replace('/login')
      }
    }
    return Promise.reject(err)
  },
)
