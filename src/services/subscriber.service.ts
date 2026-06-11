import { api } from '../lib/api'
import { paymentsApi } from '../lib/paymentsApi'
import type { Subscription } from './subscription.service'

export interface CreateSubscriberRequest {
  name: string
  email: string
  phone: string
  address: string
  cep: string
  complement: string
}

export interface Subscriber {
  id: string
  name: string
  email: string
  status: 'pending_payment' | 'active'
  created_at: string
}

export interface SubscriberPayment {
  payment_id: string
  subscriber_id: string
  subscriber_status: 'pending_payment' | 'active'
  amount_cents: number
  currency: string
  status: string
}

export const getPublicSubscription = (id: string): Promise<Subscription> =>
  api.get<{ data: Subscription }>(`/api/v1/public/subscriptions/${id}`).then((r) => r.data.data)

export const createSubscriber = (
  subscriptionId: string,
  body: CreateSubscriberRequest,
): Promise<Subscriber> =>
  api
    .post<{ data: Subscriber }>(`/api/v1/public/subscriptions/${subscriptionId}/subscribers`, body)
    .then((r) => r.data.data)

export const paySubscriberCheckout = (subscriberId: string): Promise<SubscriberPayment> =>
  paymentsApi
    .post<{ data: SubscriberPayment }>('/api/v1/public/subscriber-payments', {
      subscriber_id: subscriberId,
    })
    .then((r) => r.data.data)

export const listSubscribers = (subscriptionId: string): Promise<Subscriber[]> =>
  api
    .get<{ data: Subscriber[] }>(`/api/v1/subscriptions/${subscriptionId}/subscribers`)
    .then((r) => r.data.data)
