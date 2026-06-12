import { QueryClient } from '@tanstack/react-query'
import axios from 'axios'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      // One retry for transient failures, but 4xx responses are definitive —
      // retrying a 404 only delays the error state the user needs to see.
      retry: (failureCount, error) => {
        if (
          axios.isAxiosError(error) &&
          error.response &&
          error.response.status >= 400 &&
          error.response.status < 500
        ) {
          return false
        }
        return failureCount < 1
      },
    },
  },
})
