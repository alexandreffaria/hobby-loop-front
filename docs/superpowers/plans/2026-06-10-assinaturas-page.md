# Assinaturas Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace Dashboard with Subscriptions as the post-login landing page; build a 2-column grid of live plan cards with hover-edit, an add-new slot, and smooth page transitions.

**Architecture:** Login/Register redirect to `/subscriptions`; Dashboard and MainLayout are deleted; the Subscriptions page fetches live data from `GET /api/v1/subscriptions` via TanStack Query and renders a 2-column grid of brand-styled `PlanCard` components; `DarkLayout` gains a fade-in CSS animation applied on every mount; hover on a card reveals a pencil-icon overlay that navigates to `/manage/:id`.

**Tech Stack:** React 19, TanStack Query v5, React Router v7, Tailwind CSS 4, inline SVG icons (no icon library), `src/services/subscription.service.ts`

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `src/pages/Login.tsx` | Modify | Change post-login navigate target |
| `src/pages/Register.tsx` | Modify | Change post-register navigate target |
| `src/pages/Dashboard.tsx` | **Delete** | No longer used |
| `src/layouts/MainLayout.tsx` | **Delete** | No longer used once Dashboard gone |
| `src/App.tsx` | Modify | Remove Dashboard/MainLayout, move `/subscriptions` to DarkLayout, add `/manage/:id` |
| `src/index.css` | Modify | Add `page-enter` keyframe animation |
| `src/layouts/DarkLayout.tsx` | Modify | Apply `animate-page-enter` class |
| `src/lib/formatters.ts` | **Create** | `formatCurrency(cents: number): string` helper |
| `src/pages/Subscriptions.tsx` | **Rewrite** | 2-column grid, live data, add-slot card |
| `src/components/PlanCard.tsx` | **Create** | Branded plan card with hover-edit overlay (replaces old SubscriptionCard usage on this page) |

> `SubscriptionCard.tsx` and `QRCodePlaceholder.tsx` are kept — they're still used by other pages. `PlanCard` is the new, data-driven card for Subscriptions.

---

### Task 1: Update post-login redirects and delete unused files

**Files:**
- Modify: `src/pages/Login.tsx`
- Modify: `src/pages/Register.tsx`
- Delete: `src/pages/Dashboard.tsx`
- Delete: `src/layouts/MainLayout.tsx`

- [ ] **Step 1: Change Login.tsx navigate target**

In `src/pages/Login.tsx`, change line inside `onSuccess`:

```tsx
// Before
navigate('/dashboard')

// After
navigate('/subscriptions')
```

- [ ] **Step 2: Change Register.tsx navigate target**

In `src/pages/Register.tsx`, change the same line inside `onSuccess`:

```tsx
// Before
navigate('/dashboard')

// After
navigate('/subscriptions')
```

- [ ] **Step 3: Delete unused files**

```bash
rm src/pages/Dashboard.tsx
rm src/layouts/MainLayout.tsx
```

- [ ] **Step 4: Verify TypeScript compiles**

```bash
npm run build 2>&1 | tail -20
```

Expected: no errors about missing Dashboard or MainLayout imports (those will be fixed in the next task when App.tsx is updated).

---

### Task 2: Update App.tsx routing

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: Rewrite App.tsx**

Replace the entire file with:

```tsx
import { Navigate, createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AuthLayout } from './layouts/AuthLayout'
import { DarkLayout } from './layouts/DarkLayout'
import { ProtectedRoute } from './components/ProtectedRoute'
import { Register } from './pages/Register'
import { Login } from './pages/Login'
import { Subscriptions } from './pages/Subscriptions'
import { CreateSubscription } from './pages/CreateSubscription'
import { PaymentDetails } from './pages/PaymentDetails'
import { MySubscriptions } from './pages/MySubscription'
import { PromotionalBanner } from './pages/PromotionalBanner'
import { ManageSubscription } from './pages/ManageSubscription'
import { SubscriberCheckout } from './pages/SubscriberCheckout'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },

  // Auth pages — centered card layout, no authentication required
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: <Login /> },
      { path: '/register', element: <Register /> },
    ],
  },

  // Dark-themed app pages — require authentication
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <DarkLayout />,
        children: [
          { path: '/subscriptions', element: <Subscriptions /> },
          { path: '/create-subscription', element: <CreateSubscription /> },
          { path: '/payment', element: <PaymentDetails /> },
          { path: '/my-subscriptions', element: <MySubscriptions /> },
          { path: '/banner', element: <PromotionalBanner /> },
          { path: '/manage/:id', element: <ManageSubscription /> },
          { path: '/checkout', element: <SubscriberCheckout /> },
        ],
      },
    ],
  },
])

function App() {
  return <RouterProvider router={router} />
}

export default App
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npm run build 2>&1 | tail -20
```

Expected: clean build with no import errors.

- [ ] **Step 3: Commit**

```bash
git add src/pages/Login.tsx src/pages/Register.tsx src/pages/Dashboard.tsx src/layouts/MainLayout.tsx src/App.tsx
git commit -m "feat: post-login lands on /subscriptions; remove Dashboard and MainLayout"
```

---

### Task 3: Add page-enter animation

**Files:**
- Modify: `src/index.css`
- Modify: `src/layouts/DarkLayout.tsx`

- [ ] **Step 1: Add keyframes to index.css**

Append to `src/index.css` after the existing `@utility` block:

```css
@keyframes page-enter {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@utility animate-page-enter {
  animation: page-enter 0.35s ease-out both;
}
```

- [ ] **Step 2: Apply animation to DarkLayout**

Replace `src/layouts/DarkLayout.tsx` with:

```tsx
import { Outlet } from 'react-router-dom'

export function DarkLayout() {
  return (
    <div className="bg-brand-bg animate-page-enter min-h-screen font-sans text-white">
      <Outlet />
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/index.css src/layouts/DarkLayout.tsx
git commit -m "feat: add page-enter fade+slide animation to DarkLayout"
```

---

### Task 4: Create formatCurrency helper

**Files:**
- Create: `src/lib/formatters.ts`

- [ ] **Step 1: Create the file**

```ts
// src/lib/formatters.ts
export const formatCurrency = (cents: number): string => {
  return (cents / 100).toFixed(2).replace('.', ',')
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npm run build 2>&1 | tail -5
```

Expected: clean.

---

### Task 5: Create PlanCard component

**Files:**
- Create: `src/components/PlanCard.tsx`

The card design matches the image:
- White inner card on dark `bg-brand-input` outer shell with `rounded-[40px]`
- Product image: 96×96 SVG box icon placeholder (open-source inline, no external URL)
- Title (plan name), items (description), "Receba Mensalmente / Por 1 ano", price banner, QR placeholder, share link footer
- Outer dark shell has a teal "Compartilhar ✈" pill button below it
- Hover state: semi-transparent dark overlay on the outer card + white pencil icon top-right

- [ ] **Step 1: Create PlanCard.tsx**

```tsx
// src/components/PlanCard.tsx
import { useState } from 'react'
import { QRCodePlaceholder } from './QRCodePlaceholder'
import { formatCurrency } from '../lib/formatters'

interface PlanCardProps {
  id: string
  name: string
  description: string
  priceCents: number
  onEdit: () => void
}

function ProductImagePlaceholder() {
  return (
    <svg
      width="96"
      height="96"
      viewBox="0 0 96 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mb-4"
    >
      <rect x="28" y="12" width="40" height="64" rx="6" fill="#e5e7eb" />
      <rect x="33" y="18" width="30" height="10" rx="2" fill="#d1d5db" />
      <rect x="36" y="32" width="24" height="3" rx="1" fill="#9ca3af" />
      <rect x="38" y="38" width="20" height="3" rx="1" fill="#9ca3af" />
      <rect x="40" y="44" width="16" height="3" rx="1" fill="#9ca3af" />
      <rect x="33" y="58" width="30" height="12" rx="2" fill="#d93b8c" opacity="0.2" />
      <circle cx="48" cy="64" r="4" fill="#d93b8c" opacity="0.4" />
    </svg>
  )
}

function PencilIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  )
}

export function PlanCard({ id, name, description, priceCents, onEdit }: PlanCardProps) {
  const [hovered, setHovered] = useState(false)

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Outer shell */}
      <div
        className="bg-brand-input relative w-full cursor-pointer overflow-hidden rounded-[40px] border border-white/10 shadow-2xl transition-transform duration-200 hover:scale-[1.02]"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Hover edit overlay */}
        {hovered && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onEdit()
            }}
            className="absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-gray-800 shadow-lg transition-all hover:bg-white hover:scale-110"
            aria-label="Editar assinatura"
          >
            <PencilIcon />
          </button>
        )}

        {/* White inner card */}
        <div className="text-brand-bg mx-4 mt-4 flex flex-col items-center rounded-[30px] bg-white p-4 text-center">
          <h3 className="text-[10px] font-bold tracking-tighter uppercase opacity-70">
            {name}
          </h3>
          <p className="mb-3 text-[8px] text-gray-500 leading-tight">{description}</p>

          <ProductImagePlaceholder />

          <p className="text-[10px] leading-tight text-gray-600">
            Receba <span className="font-bold">Mensalmente</span>
          </p>
          <p className="mb-3 text-sm text-gray-700">
            Por <span className="text-brand-pink font-black">1 ano</span>
          </p>

          {/* Price banner */}
          <div className="w-full rounded-sm bg-gray-100 py-2">
            <p className="text-brand-bg text-[11px] font-bold">
              R$ {formatCurrency(priceCents)} ao mes
            </p>
            <p className="text-brand-pink text-[7px] font-bold tracking-widest uppercase">
              Receba em casa
            </p>
          </div>

          {/* QR code */}
          <div className="border-brand-bg/10 text-brand-bg mt-4 flex h-20 w-20 items-center justify-center rounded-lg border-2 p-2">
            <QRCodePlaceholder />
          </div>
        </div>

        {/* Link footer */}
        <span className="text-brand-blue my-3 block truncate text-center font-mono text-[7px] px-4">
          www.meulink de assinantes.com.br
        </span>
      </div>

      {/* Share button */}
      <button className="flex w-full items-center justify-center gap-2 rounded-full bg-blue-600 py-2 text-xs font-bold text-white shadow-lg transition-transform active:scale-95 hover:bg-blue-700">
        Compartilhar
        <span className="text-[10px]">✈</span>
      </button>
    </div>
  )
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
npm run build 2>&1 | tail -10
```

Expected: clean.

---

### Task 6: Rewrite Subscriptions page

**Files:**
- Rewrite: `src/pages/Subscriptions.tsx`

The page:
- Full-width dark page (already wrapped in DarkLayout)
- Heading "Minhas assinaturas" in `text-brand-gradient`, centered
- `useQuery` fetching `listSubscriptions()` with queryKey `['subscriptions']`
- 2-column CSS grid, `gap-4`, `px-4` padding
- Maps `Subscription[]` to `<PlanCard>` with `onEdit={() => navigate('/manage/' + sub.id)}`
- Final slot: dark rounded card with a `+` sign, navigates to `/create-subscription` on click
- Loading state: 2-column skeleton shimmer
- Error state: inline message

- [ ] **Step 1: Rewrite Subscriptions.tsx**

```tsx
// src/pages/Subscriptions.tsx
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { listSubscriptions } from '../services/subscription.service'
import { PlanCard } from '../components/PlanCard'

function SkeletonCard() {
  return (
    <div className="bg-brand-input h-96 w-full animate-pulse rounded-[40px] border border-white/5" />
  )
}

function AddSlotCard({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="bg-brand-input/50 flex h-full min-h-96 w-full flex-col items-center justify-center rounded-[40px] border border-white/5 shadow-xl transition-all hover:border-white/20 hover:bg-brand-input"
      aria-label="Adicionar nova assinatura"
    >
      <span className="text-brand-pink text-4xl font-thin leading-none">+</span>
      <span className="mt-2 text-xs text-gray-500">Nova assinatura</span>
    </button>
  )
}

export function Subscriptions() {
  const navigate = useNavigate()
  const { data: subscriptions, isPending, isError } = useQuery({
    queryKey: ['subscriptions'],
    queryFn: listSubscriptions,
  })

  return (
    <div className="mx-auto w-full max-w-md px-4 pb-12 pt-10">
      <h1 className="text-brand-gradient mb-8 text-center text-xl font-bold tracking-tight">
        Minhas assinaturas
      </h1>

      {isError && (
        <p className="text-center text-sm text-red-400">
          Erro ao carregar assinaturas. Tente novamente.
        </p>
      )}

      <div className="grid grid-cols-2 gap-4">
        {isPending && (
          <>
            <SkeletonCard />
            <SkeletonCard />
          </>
        )}

        {subscriptions?.map((sub) => (
          <PlanCard
            key={sub.id}
            id={sub.id}
            name={sub.name}
            description={sub.description}
            priceCents={sub.price_cents}
            onEdit={() => navigate(`/manage/${sub.id}`)}
          />
        ))}

        <AddSlotCard onClick={() => navigate('/create-subscription')} />
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
npm run build 2>&1 | tail -10
```

Expected: clean.

- [ ] **Step 3: Commit**

```bash
git add src/lib/formatters.ts src/components/PlanCard.tsx src/pages/Subscriptions.tsx
git commit -m "feat: Subscriptions page — 2-column plan grid with live data, hover-edit, add-slot"
```

---

### Task 7: Manual QA

- [ ] **Step 1: Start the dev server**

```bash
npm run dev
```

- [ ] **Step 2: Test the happy path**

1. Navigate to `http://localhost:5173` → should redirect to `/login`
2. Log in with valid credentials → should land on `/subscriptions` with fade-in animation
3. If subscriptions exist: cards render with name, description, price, QR, share button
4. If no subscriptions: only the `+` slot card is visible
5. Hover a card: pencil icon appears top-right; clicking navigates to `/manage/<id>`
6. Click `+` slot card: navigates to `/create-subscription`
7. Register a new account → lands on `/subscriptions`

- [ ] **Step 3: Test responsive layout**

Resize browser to 375px — 2-column grid still visible; cards readable without horizontal scroll.

- [ ] **Step 4: Final commit**

```bash
git add .
git commit -m "feat: wire Subscriptions as post-login landing page with transitions"
```

---

## Self-Review

**Spec coverage check:**
- ✅ After login → redirect to assinaturas page (Tasks 1–2)
- ✅ Smooth transition (Task 3 — DarkLayout fade-in)
- ✅ Show all created assinaturas (Task 6 — live `listSubscriptions()` query)
- ✅ Open-source image placeholder (Task 5 — inline SVG, no external URL)
- ✅ QR code as visual placeholder only (existing `QRCodePlaceholder` SVG, no generation)
- ✅ "+ Add more" button → `/create-subscription` (Task 6 — `AddSlotCard`)
- ✅ Hover shows edit icon top-right (Task 5 — `PlanCard` hover state)
- ✅ Clicking edit icon → edit page `/manage/:id` (Tasks 2 + 5)
- ✅ Remove Dashboard (Tasks 1–2)

**Placeholder scan:** None found — all steps have full code.

**Type consistency check:**
- `PlanCard` receives `id, name, description, priceCents, onEdit` — matches `Subscription` shape via mapping in `Subscriptions.tsx` ✅
- `formatCurrency(cents: number)` defined in Task 4, used in Task 5 ✅
- `listSubscriptions()` returns `Subscription[]` — `sub.id`, `sub.name`, `sub.description`, `sub.price_cents` all valid ✅
- `/manage/:id` route added in Task 2, `navigate('/manage/' + sub.id)` used in Task 6 ✅
