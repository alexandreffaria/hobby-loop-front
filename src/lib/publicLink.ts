// VITE_PUBLIC_BASE_URL overrides in production (e.g. https://hobbyloop.app);
// defaults to the current origin so dev QR codes point at the dev server.
const base = (): string =>
  import.meta.env.VITE_PUBLIC_BASE_URL ?? window.location.origin

export const buildPublicLink = (subscriptionId: string): string =>
  `${base()}/s/${subscriptionId}`

export const displayPublicLink = (subscriptionId: string): string =>
  buildPublicLink(subscriptionId).replace(/^https?:\/\//, '')
