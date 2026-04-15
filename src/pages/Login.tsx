import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
      <div className="mb-12 flex flex-col items-center">
        <div className="from-brand-pink to-brand-blue mb-2 h-10 w-10 rounded-full bg-linear-to-tr shadow-lg"></div>
        <span className="text-xs font-bold tracking-widest text-white">
          Hoby Loop
        </span>
      </div>

      <h1 className="text-brand-gradient mb-8 text-xl font-bold">
        Entrar na sua conta
      </h1>

      <div className="border-brand-pink/60 bg-brand-input flex w-full flex-col divide-y divide-gray-800 overflow-hidden rounded-xl border shadow-2xl">
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-transparent p-4 text-sm text-gray-200 placeholder-gray-400 transition-colors outline-none focus:bg-white/5"
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          className="w-full bg-transparent p-4 text-sm text-gray-200 placeholder-gray-400 transition-colors outline-none focus:bg-white/5"
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
        className="from-brand-pink to-brand-blue shadow-brand-pink/20 hover:shadow-brand-pink/40 mt-6 w-full rounded-xl bg-linear-to-r py-4 text-sm font-bold text-white shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {mutation.isPending ? 'Entrando...' : 'Entrar'}
      </button>

      <div className="mt-10">
        <button
          onClick={() => navigate('/signup')}
          className="text-brand-blue text-sm transition-all hover:underline"
        >
          Não tem conta? Criar conta
        </button>
      </div>
    </div>
  )
}
