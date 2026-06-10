import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { IMaskInput } from 'react-imask'
import axios from 'axios'
import * as authService from '../services/auth.service'
import type { RegisterRequest } from '../services/auth.service'
import { setToken } from '../lib/token'
import { BrandLogo } from '../components/BrandLogo'

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
      navigate('/dashboard')
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
    ? axios.isAxiosError(mutation.error)
      ? (mutation.error.response?.data?.error ?? 'Erro ao criar conta.')
      : 'Erro ao criar conta.'
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
      <div className="border-brand-pink/60 bg-brand-input w-full overflow-hidden rounded-xl border shadow-2xl">
        <input
          type="text"
          placeholder="Seu nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputClass}
        />

        <input
          type="text"
          placeholder="Sua empresa"
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
          value={taxId}
          onAccept={(value: string) => setTaxId(value)}
          className={inputClass}
        />

        <IMaskInput
          mask="(00) 00000-0000"
          placeholder="(00) 00000-0000"
          value={phone}
          onAccept={(value: string) => setPhone(value)}
          className={inputClass}
        />

        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
        />

        <input
          type="text"
          placeholder="Endereço"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className={inputClass}
        />

        <input
          type="password"
          placeholder="Senha (mínimo 8 caracteres)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={inputClass}
        />

        <input
          type="password"
          placeholder="Confirmar senha"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          className="w-full bg-transparent p-4 text-sm text-gray-200 placeholder-gray-500 outline-none transition-colors focus:bg-white/5"
        />
      </div>

      {(clientError || serverError) && (
        <p className="mt-3 text-sm text-red-400">{clientError || serverError}</p>
      )}

      <button
        onClick={handleSubmit}
        disabled={mutation.isPending}
        className="from-brand-pink to-brand-blue mt-6 w-full rounded-xl bg-linear-to-r py-4 text-sm font-bold text-white shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {mutation.isPending ? 'Criando conta...' : 'Criar conta'}
      </button>

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
