import { api } from '../lib/api'

export interface Subscription {
  id: string
  name: string
  description: string
  price_cents: number
  created_at: string
}

export interface CreateSubscriptionRequest {
  name: string
  description: string
  price_cents: number
}

export const listSubscriptions = (): Promise<Subscription[]> =>
  api.get<{ data: Subscription[] }>('/api/v1/subscriptions').then((r) => r.data.data)

export const createSubscription = (body: CreateSubscriptionRequest): Promise<Subscription> =>
  api.post<{ data: Subscription }>('/api/v1/subscriptions', body).then((r) => r.data.data)
