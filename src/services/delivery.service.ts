import { api } from '../lib/api'

export type DeliveryStatus = 'preparing' | 'shipped' | 'delivered'

export interface DeliveryPeriod {
  start: string // inclusive, YYYY-MM-DD
  end: string // exclusive, YYYY-MM-DD
  offset: number
  has_previous: boolean
  is_future: boolean
}

export interface DeliverySubscriber {
  id: string
  name: string
  email: string
  phone: string
  address: string
  cep: string
  complement: string
  status: 'pending_payment' | 'active' | 'canceled'
  delivery_status: DeliveryStatus
}

export interface Deliveries {
  period: DeliveryPeriod
  subscribers: DeliverySubscriber[]
}

export const getDeliveries = (subscriptionId: string, offset: number): Promise<Deliveries> =>
  api
    .get<{ data: Deliveries }>(`/api/v1/subscriptions/${subscriptionId}/deliveries`, {
      params: { offset },
    })
    .then((r) => r.data.data)

export interface SetDeliveryStatusVars {
  subscriptionId: string
  subscriberId: string
  periodStart: string
  status: DeliveryStatus
}

export const setDeliveryStatus = ({
  subscriptionId,
  subscriberId,
  periodStart,
  status,
}: SetDeliveryStatusVars): Promise<void> =>
  api
    .patch(`/api/v1/subscriptions/${subscriptionId}/subscribers/${subscriberId}/deliveries`, {
      period_start: periodStart,
      status,
    })
    .then(() => undefined)
