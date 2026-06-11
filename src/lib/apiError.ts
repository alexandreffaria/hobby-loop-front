import axios from 'axios'

interface ApiErrorBody {
  error?: string
}

// Maps an unknown error (usually from a TanStack Query mutation) to a
// user-facing pt-BR message: the API's own error message when present, a
// connectivity message when the request never got a response, otherwise
// the caller's fallback.
export const getApiErrorMessage = (error: unknown, fallback: string): string => {
  if (axios.isAxiosError<ApiErrorBody>(error)) {
    if (!error.response) {
      return 'Não foi possível conectar ao servidor. Tente novamente.'
    }
    return error.response.data?.error ?? fallback
  }
  return fallback
}
