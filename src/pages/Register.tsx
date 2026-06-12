import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { IMaskInput } from 'react-imask'
import * as authService from '../services/auth.service'
import type { RegisterRequest } from '../services/auth.service'
import { setToken } from '../lib/token'
import { getApiErrorMessage } from '../lib/apiError'
import { BrandLogo } from '../components/BrandLogo'
import { GradientButton } from '../components/GradientButton'

export function Register() {
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [company, setCompany] = useState('')
  const [taxIdType, setTaxIdType] = useState<'CPF' | 'CNPJ'>('CPF')
  const [taxId, setTaxId] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [clientError, setClientError] = useState('')

  const mutation = useMutation({
    mutationFn: (vars: RegisterRequest) => authService.register(vars),
    onSuccess: (data) => {
      setToken(data.token)
      navigate('/subscriptions')
    },
  })

  const handleSubmit = () => {
    setClientError('')
    if (!name || !company || !taxId || !phone || !email || !address || !password || !confirmPassword) {
      setClientError('Preencha todos os campos.')
      return
    }
    const rawTaxId = taxId.replace(/\D/g, '')
    const expectedTaxIdLen = taxIdType === 'CPF' ? 11 : 14
    if (rawTaxId.length !== expectedTaxIdLen) {
      setClientError(`${taxIdType} incompleto.`)
      return
    }
    if (phone.replace(/\D/g, '').length !== 11) {
      setClientError('Telefone incompleto.')
      return
    }
    if (password.length < 8) {
      setClientError('A senha deve ter pelo menos 8 caracteres.')
      return
    }
    if (password !== confirmPassword) {
      setClientError('As senhas não coincidem.')
      return
    }
    mutation.mutate({
      name,
      email,
      password,
      company,
      tax_id: rawTaxId,
      tax_id_type: taxIdType,
      phone: phone.replace(/\D/g, ''),
      address,
    })
  }

  const serverError = mutation.isError
    ? getApiErrorMessage(mutation.error, 'Erro ao criar conta.')
    : null

  const inputClass =
    'w-full border-b border-gray-700/60 bg-transparent p-4 text-sm text-gray-200 placeholder-gray-500 outline-none transition-colors focus:bg-white/5'

  const switchTaxIdType = (type: 'CPF' | 'CNPJ') => {
    setTaxIdType(type)
    setTaxId('')
  }

  return (
    <div className="flex flex-col items-center">
      <BrandLogo className="mb-8" />

      <h1 className="text-brand-gradient mb-6 text-xl font-bold tracking-tight">
        Crie sua conta
      </h1>

      {/* Fields */}
      <form
        onSubmit={(e) => { e.preventDefault(); handleSubmit() }}
        className="flex w-full flex-col items-center"
      >
      <div className="border-brand-pink/60 bg-brand-input w-full overflow-hidden rounded-xl border shadow-2xl">
        <input
          type="text"
          placeholder="Seu nome"
          aria-label="Seu nome"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputClass}
        />

        <input
          type="text"
          placeholder="Sua empresa"
          aria-label="Sua empresa"
          autoComplete="organization"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className={inputClass}
        />

        {/* CPF / CNPJ toggle */}
        <div className="flex border-b border-gray-700/60">
          <button
            type="button"
            onClick={() => switchTaxIdType('CPF')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              taxIdType === 'CPF'
                ? 'text-brand-pink bg-white/5'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            CPF
          </button>
          <div className="w-px bg-gray-700/60" />
          <button
            type="button"
            onClick={() => switchTaxIdType('CNPJ')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              taxIdType === 'CNPJ'
                ? 'text-brand-pink bg-white/5'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            CNPJ
          </button>
        </div>

        {/* Masked doc number — key forces remount when mask changes */}
        <IMaskInput
          key={taxIdType}
          mask={taxIdType === 'CPF' ? '000.000.000-00' : '00.000.000/0000-00'}
          placeholder={taxIdType === 'CPF' ? '000.000.000-00' : '00.000.000/0000-00'}
          aria-label={taxIdType}
          value={taxId}
          onAccept={(value: string) => setTaxId(value)}
          className={inputClass}
        />

        <IMaskInput
          mask="(00) 00000-0000"
          placeholder="(00) 00000-0000"
          aria-label="Telefone"
          value={phone}
          onAccept={(value: string) => setPhone(value)}
          className={inputClass}
        />

        <input
          type="email"
          placeholder="E-mail"
          aria-label="E-mail"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
        />

        <input
          type="text"
          placeholder="Endereço"
          aria-label="Endereço"
          autoComplete="street-address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className={inputClass}
        />

        <input
          type="password"
          placeholder="Senha (mínimo 8 caracteres)"
          aria-label="Senha"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={inputClass}
        />

        <input
          type="password"
          placeholder="Confirmar senha"
          aria-label="Confirmar senha"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full bg-transparent p-4 text-sm text-gray-200 placeholder-gray-500 outline-none transition-colors focus:bg-white/5"
        />
      </div>

      {(clientError || serverError) && (
        <p role="alert" className="mt-3 text-sm text-red-400">{clientError || serverError}</p>
      )}

      <GradientButton type="submit" disabled={mutation.isPending} className="mt-6">
        {mutation.isPending ? 'Criando conta...' : 'Criar conta'}
      </GradientButton>
      </form>

      {/* Google button (non-functional) */}
      <button
        type="button"
        disabled
        className="mt-4 w-full rounded-xl border border-gray-700 bg-transparent py-3.5 text-sm text-gray-400 disabled:cursor-not-allowed"
      >
        Entrar com a conta Google
      </button>

      <p className="mt-8 mb-2 text-sm text-gray-500">
        Já tem conta?{' '}
        <Link to="/login" className="text-brand-blue hover:underline">
          Fazer login
        </Link>
      </p>
    </div>
  )
}
