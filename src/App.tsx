import { Navigate, createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AuthLayout } from './layouts/AuthLayout'
import { DarkLayout } from './layouts/DarkLayout'
import { PublicLayout } from './layouts/PublicLayout'
import { ProtectedRoute } from './components/ProtectedRoute'
import { Register } from './pages/Register'
import { Login } from './pages/Login'
import { Subscriptions } from './pages/Subscriptions'
import { CreateSubscription } from './pages/CreateSubscription'
import { PaymentDetails } from './pages/PaymentDetails'
import { MySubscriptions } from './pages/MySubscription'
import { ManageSubscription } from './pages/ManageSubscription'
import { EditSubscription } from './pages/EditSubscription'
import { SubscribePage } from './pages/SubscribePage'
import { SubscribeSuccess } from './pages/SubscribeSuccess'
import { SubscriberPortal } from './pages/SubscriberPortal'
import { ErrorBoundary } from './components/ErrorBoundary'

// Shown while an initially-matched lazy route's chunk loads (hard refresh /
// direct entry on /banner/:id or /s/:id/pagamento) — without it the router
// renders nothing until the chunk arrives.
function HydrateFallback() {
  return (
    <div className="bg-brand-bg flex min-h-screen items-center justify-center">
      <div className="from-brand-pink to-brand-blue h-8 w-8 animate-pulse rounded-full bg-linear-to-tr" />
    </div>
  )
}

const router = createBrowserRouter([
  {
    ErrorBoundary: ErrorBoundary,
    HydrateFallback: HydrateFallback,
    children: [
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

      // Public subscriber checkout — customers have no account
      {
        element: <PublicLayout />,
        children: [
          { path: '/s/:id', element: <SubscribePage /> },
          {
            path: '/s/:id/pagamento',
            // Lazy: keeps the Stripe SDK out of the company-app bundle.
            lazy: () =>
              import('./pages/SubscribePayment').then((m) => ({
                Component: m.SubscribePayment,
              })),
          },
          { path: '/s/:id/sucesso', element: <SubscribeSuccess /> },
          { path: '/assinatura/:token', element: <SubscriberPortal /> },
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
              { path: '/subscriptions/new', element: <CreateSubscription /> },
              { path: '/payment', element: <PaymentDetails /> },
              { path: '/my-subscriptions', element: <MySubscriptions /> },
              {
                path: '/banner/:id',
                // Lazy: html-to-image is only needed by the banner exporter.
                lazy: () =>
                  import('./pages/PromotionalBanner').then((m) => ({
                    Component: m.PromotionalBanner,
                  })),
              },
              { path: '/manage/:id', element: <ManageSubscription /> },
              { path: '/edit/:id', element: <EditSubscription /> },
            ],
          },
        ],
      },
    ],
  },
])

function App() {
  return <RouterProvider router={router} />
}

export default App
