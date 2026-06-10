import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import * as authService from '../services/auth.service'
import { setToken } from '../lib/token'

export function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const mutation = useMutation({
    mutationFn: () => authService.login({ email, password }),
    onSuccess: (data) => {
      setToken(data.token)
      navigate('/dashboard')
    },
  })

  const handleSubmit = () => {
    if (!email || !password) return
    mutation.mutate()
  }

  return (
    <div className="flex flex-col items-center">
      {/* Logo */}
      <div className="mb-10 flex flex-col items-center gap-2">
        <div className="from-brand-pink to-brand-blue h-12 w-12 rounded-full bg-linear-to-tr shadow-lg" />
        <span className="text-xs font-bold tracking-widest text-white/70 uppercase">
          Hoby Loop
        </span>
      </div>

      <h1 className="text-brand-gradient mb-8 text-xl font-bold tracking-tight">
        Bem-vindo de volta
      </h1>

      {/* Fields */}
      <div className="border-brand-pink/60 bg-brand-input w-full overflow-hidden rounded-xl border shadow-2xl">
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border-b border-gray-700/60 bg-transparent p-4 text-sm text-gray-200 placeholder-gray-500 outline-none transition-colors focus:bg-white/5"
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          className="w-full bg-transparent p-4 text-sm text-gray-200 placeholder-gray-500 outline-none transition-colors focus:bg-white/5"
        />
      </div>

      {mutation.isError && (
        <p className="mt-3 text-sm text-red-400">
          {axios.isAxiosError(mutation.error)
            ? (mutation.error.response?.data?.error ?? 'E-mail ou senha inválidos.')
            : 'E-mail ou senha inválidos.'}
        </p>
      )}

      <button
        onClick={handleSubmit}
        disabled={mutation.isPending}
        className="from-brand-pink to-brand-blue mt-6 w-full rounded-xl bg-linear-to-r py-4 text-sm font-bold text-white shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {mutation.isPending ? 'Entrando...' : 'Entrar'}
      </button>

      {/* Google button (non-functional) */}
      <button
        type="button"
        disabled
        className="mt-4 w-full rounded-xl border border-gray-700 bg-transparent py-3.5 text-sm text-gray-400 transition-colors hover:border-gray-500 hover:text-gray-300 disabled:cursor-not-allowed"
      >
        Entrar com a conta Google
      </button>

      <p className="mt-8 text-sm text-gray-500">
        Não tem conta?{' '}
        <Link to="/register" className="text-brand-blue hover:underline">
          Cadastre-se
        </Link>
      </p>
    </div>
  )
}
