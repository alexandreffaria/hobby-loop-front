import { api } from '../lib/api'

export interface Product {
  id: string
  name: string
  is_system: boolean
}

export const listProducts = (): Promise<Product[]> =>
  api.get<{ data: Product[] }>('/api/v1/products').then((r) => r.data.data)
