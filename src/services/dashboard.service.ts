import { api } from '../lib/api'

export interface DeliveriesSummary {
  preparing: number
  shipped: number
  delivered: number
  total: number
}

export interface DashboardMetrics {
  active_subscribers: number
  mrr_cents: number
  active_plans: number
  deliveries_this_month: DeliveriesSummary
  month: string // YYYY-MM
}

export const getDashboard = (): Promise<DashboardMetrics> =>
  api.get<{ data: DashboardMetrics }>('/api/v1/dashboard').then((r) => r.data.data)
