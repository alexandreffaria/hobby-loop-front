import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import * as authService from '../services/auth.service'
import type { LoginRequest } from '../services/auth.service'
import { setToken } from '../lib/token'
import { getApiErrorMessage } from '../lib/apiError'
import { BrandLogo } from '../components/BrandLogo'
import { GradientButton } from '../components/GradientButton'

export function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [clientError, setClientError] = useState('')

  const mutation = useMutation({
    mutationFn: (vars: LoginRequest) => authService.login(vars),
    onSuccess: (data) => {
      setToken(data.token)
      navigate('/subscriptions')
    },
  })

  const handleSubmit = () => {
    setClientError('')
    if (!email || !password) {
      setClientError('Preencha todos os campos.')
      return
    }
    mutation.mutate({ email, password })
  }

  return (
    <div className="flex flex-col items-center">
      <BrandLogo />

      <h1 className="text-brand-gradient mb-8 text-xl font-bold tracking-tight">
        Bem-vindo de volta
      </h1>

      {/* Fields */}
      <form
        onSubmit={(e) => { e.preventDefault(); handleSubmit() }}
        className="flex w-full flex-col items-center"
      >
        <div className="border-brand-pink/60 bg-brand-input w-full overflow-hidden rounded-xl border shadow-2xl">
          <input
            type="email"
            placeholder="E-mail"
            aria-label="E-mail"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border-b border-gray-700/60 bg-transparent p-4 text-sm text-gray-200 placeholder-gray-500 outline-none transition-colors focus:bg-white/5"
          />
          <input
            type="password"
            placeholder="Senha"
            aria-label="Senha"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-transparent p-4 text-sm text-gray-200 placeholder-gray-500 outline-none transition-colors focus:bg-white/5"
          />
        </div>

        {(clientError || mutation.isError) && (
          <p className="mt-3 text-sm text-red-400">
            {clientError ||
              getApiErrorMessage(mutation.error, 'E-mail ou senha inválidos.')}
          </p>
        )}

        <GradientButton type="submit" disabled={mutation.isPending} className="mt-6">
          {mutation.isPending ? 'Entrando...' : 'Entrar'}
        </GradientButton>
      </form>

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
