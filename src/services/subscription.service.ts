import { api } from '../lib/api'

export interface ProductRef {
  id: string
  name: string
}

export interface Subscription {
  id: string
  name: string
  description: string
  price_cents: number
  products: ProductRef[]
  active_subscribers: number
  created_at: string
  archived: boolean
}

export interface CreateSubscriptionRequest {
  name: string
  description: string
  price_cents: number
  product_ids: string[]
}

export const listSubscriptions = (): Promise<Subscription[]> =>
  api.get<{ data: Subscription[] }>('/api/v1/subscriptions').then((r) => r.data.data)

export const createSubscription = (body: CreateSubscriptionRequest): Promise<Subscription> =>
  api.post<{ data: Subscription }>('/api/v1/subscriptions', body).then((r) => r.data.data)

export type UpdateSubscriptionRequest = CreateSubscriptionRequest

export const getSubscription = (id: string): Promise<Subscription> =>
  api.get<{ data: Subscription }>(`/api/v1/subscriptions/${id}`).then((r) => r.data.data)

export const updateSubscription = (id: string, body: UpdateSubscriptionRequest): Promise<Subscription> =>
  api.patch<{ data: Subscription }>(`/api/v1/subscriptions/${id}`, body).then((r) => r.data.data)

export interface CancelSubscriptionResult {
  deleted: boolean
  archived: boolean
}

// Cancel a plan: the backend hard-deletes it when there are no active
// subscribers, or archives it (closed to new signups, still manageable) when
// there are.
export const cancelSubscription = (id: string): Promise<CancelSubscriptionResult> =>
  api
    .post<{ data: CancelSubscriptionResult }>(`/api/v1/subscriptions/${id}/cancel`)
    .then((r) => r.data.data)
