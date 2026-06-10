import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { getMe } from '../services/auth.service'

export function Dashboard() {
  const { data, isPending, isError } = useQuery({
    queryKey: ['me'],
    queryFn: getMe,
  })

  return (
    <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-8 shadow-sm">
      <h1 className="mb-4 text-3xl font-bold text-indigo-900">
        Your Dashboard
      </h1>

      {isPending && (
        <p className="animate-pulse text-indigo-500">Loading...</p>
      )}

      {isError && (
        <p className="text-red-500">
          Could not load user data. Please{' '}
          <Link to="/login" className="underline">
            log in
          </Link>
          .
        </p>
      )}

      {data && (
        <div className="space-y-1">
          <p className="text-indigo-700">
            Welcome back, <span className="font-semibold">{data.name}</span>!
          </p>
          <p className="text-sm text-indigo-500">{data.email}</p>
        </div>
      )}
    </div>
  )
}
