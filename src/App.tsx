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
import { EditSubscription } from './pages/EditSubscription'
import { SubscriberCheckout } from './pages/SubscriberCheckout'
import { ErrorBoundary } from './components/ErrorBoundary'

const router = createBrowserRouter([
  {
    ErrorBoundary: ErrorBoundary,
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
              { path: '/banner/:id', element: <PromotionalBanner /> },
              { path: '/manage/:id', element: <ManageSubscription /> },
              { path: '/edit/:id', element: <EditSubscription /> },
              { path: '/checkout', element: <SubscriberCheckout /> },
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
