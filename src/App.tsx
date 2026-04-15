import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { MainLayout } from "./layouts/MainLayout";
import { Home } from "./pages/Home";
import { Dashboard } from "./pages/Dashboard";
import { AuthLayout } from "./layouts/AuthLayout";
import { SignUp } from "./pages/SignUp";
import { Login } from "./pages/Login";
import { CreateSubscription } from "./pages/CreateSubscription";
import { PaymentDetails } from "./pages/PaymentDetails";
import { MySubscriptions } from "./pages/MySubscription";
import { PromotionalBanner } from "./pages/PromotionalBanner";
import { ManageSubscription } from "./pages/ManageSubscription";
import { SubscriberCheckout } from "./pages/SubscriberCheckout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />, // The Layout wraps everything
    children: [
      {
        path: "/", // The default page inside the layout
        element: <Home />,
      },
      {
        path: "/dashboard", // Renders Dashboard inside the Layout's <Outlet />
        element: <Dashboard />,
      },
    ],
  },

  {
    element: <AuthLayout />,
    children: [{ path: "/signup", element: <SignUp /> }],
  },

  {
    element: <AuthLayout />,
    children: [{ path: "/login", element: <Login /> }],
  },

  {
    element: <AuthLayout />,
    children: [
      { path: "/create-subscription", element: <CreateSubscription /> },
    ],
  },

  {
    element: <AuthLayout />,
    children: [{ path: "/payment", element: <PaymentDetails /> }],
  },

  {
    element: <AuthLayout />,
    children: [{ path: "/my-subscriptions", element: <MySubscriptions /> }],
  },

  {
    element: <AuthLayout />,
    children: [{ path: "/banner", element: <PromotionalBanner /> }],
  },

  {
    element: <AuthLayout />,
    children: [{ path: "/manage", element: <ManageSubscription /> }],
  },

  {
    element: <AuthLayout />,
    children: [{ path: "/checkout", element: <SubscriberCheckout /> }],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
