const KEY = 'hl_token'

export const getToken = (): string | null => localStorage.getItem(KEY)
export const setToken = (t: string): void => localStorage.setItem(KEY, t)
export const removeToken = (): void => localStorage.removeItem(KEY)
