import { Navigate, createBrowserRouter, RouterProvider } from "react-router-dom";
import { MainLayout } from "./layouts/MainLayout";
import { AuthLayout } from "./layouts/AuthLayout";
import { DarkLayout } from "./layouts/DarkLayout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Dashboard } from "./pages/Dashboard";
import { Register } from "./pages/Register";
import { Login } from "./pages/Login";
import { Subscriptions } from "./pages/Subscriptions";
import { CreateSubscription } from "./pages/CreateSubscription";
import { PaymentDetails } from "./pages/PaymentDetails";
import { MySubscriptions } from "./pages/MySubscription";
import { PromotionalBanner } from "./pages/PromotionalBanner";
import { ManageSubscription } from "./pages/ManageSubscription";
import { SubscriberCheckout } from "./pages/SubscriberCheckout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },

  // Auth pages — centered card layout, no authentication required
  {
    element: <AuthLayout />,
    children: [
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
    ],
  },

  // Light-themed app pages — require authentication
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          { path: "/dashboard", element: <Dashboard /> },
          { path: "/subscriptions", element: <Subscriptions /> },
        ],
      },
    ],
  },

  // Dark-themed app pages — require authentication
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <DarkLayout />,
        children: [
          { path: "/create-subscription", element: <CreateSubscription /> },
          { path: "/payment", element: <PaymentDetails /> },
          { path: "/my-subscriptions", element: <MySubscriptions /> },
          { path: "/banner", element: <PromotionalBanner /> },
          { path: "/manage", element: <ManageSubscription /> },
          { path: "/checkout", element: <SubscriberCheckout /> },
        ],
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
