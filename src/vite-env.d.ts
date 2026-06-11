/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Core API base URL (e.g. http://localhost:3001). Required. */
  readonly VITE_API_URL: string
  /** Payments API base URL (e.g. http://localhost:3002). Required. */
  readonly VITE_PAYMENTS_API_URL: string
  /** Stripe publishable key; without it the payment page shows a demo fallback. */
  readonly VITE_STRIPE_PUBLISHABLE_KEY?: string
  /** Overrides the public-link origin in production (e.g. https://hobbyloop.app). */
  readonly VITE_PUBLIC_BASE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
