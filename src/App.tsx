import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { MainLayout } from "./layouts/MainLayout";
import { Home } from "./pages/Home";
import { Dashboard } from "./pages/Dashboard";
import { AuthLayout } from "./layouts/AuthLayout";
import { SignUp } from "./pages/SignUp";
import { CreateSubscription } from "./pages/CreateSubscription";
import { PaymentDetails } from "./pages/PaymentDetails";

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
    children: [
      { path: "/create-subscription", element: <CreateSubscription /> },
    ],
  },

  {
    element: <AuthLayout />,
    children: [{ path: "/payment", element: <PaymentDetails /> }],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
