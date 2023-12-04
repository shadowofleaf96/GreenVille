import { lazy, Suspense } from "react";
import { Outlet, Navigate, useRoutes } from "react-router-dom";
import { useSelector } from "react-redux"; // Import the useSelector hook

import DashboardLayout from "../layouts/dashboard";

export const IndexPage = lazy(() => import("../pages/app"));
export const CategoryPage = lazy(() => import("../pages/category"));
export const SubCategoryPage = lazy(() => import("../pages/subcategory"));
export const ProfilePage = lazy(() => import("../pages/profile"));
export const PaymentListPage = lazy(() => import("../pages/paymentlist"));
export const CustomerPage = lazy(() => import("../pages/customer"));
export const OrderPage = lazy(() => import("../pages/order"));
export const UserPage = lazy(() => import("../pages/user"));
export const LoginPage = lazy(() => import("../pages/login"));
export const ProductPage = lazy(() => import("../pages/product"));
export const Page404 = lazy(() => import("../pages/page-not-found"));
export const ResetPasswordPage = lazy(() => import("../pages/reset-password"));
import { useCookies } from "react-cookie";
import { isExpired } from "react-jwt";
const SECRETKEY =
  "eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTY5ODEwMDMwNiwiaWF0IjoxNjk4MTAwMzA2fQ.pJOmvZtsuqKBEtBP20f6ygSC8zbiSNcLVAmaLlEhdGW";

// ----------------------------------------------------------------------

export default function Router() {
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const [cookies] = useCookies(["user_access_token"]);
  const tokenCookies = cookies.user_access_token;

  const isTokenValid = () => {
    if (tokenCookies) {
      try {
        return !isExpired(tokenCookies, SECRETKEY);
      } catch (error) {
        return false;
      }
    }
    return false;
  };

const routes = useRoutes([
    {
      element:
        isTokenValid() && token && user ? (
          <DashboardLayout>
            <Suspense>
              <Outlet />
            </Suspense>
          </DashboardLayout>
        ) : (
          <Navigate to="/login" replace />
        ),
      children: [
        { element: <IndexPage />, index: true },
        { path: "profile", element: <ProfilePage /> },
        { path: "user", element: <UserPage /> },
        { path: "category", element: <CategoryPage /> },
        { path: "subcategory", element: <SubCategoryPage /> },
        { path: "order", element: <OrderPage /> },
        { path: "products", element: <ProductPage /> },
        { path: "paymentlist", element: <PaymentListPage /> },
        { path: "customer", element: <CustomerPage /> },
      ],
    },
    {
      path: "reset-password/:token",
      element: <ResetPasswordPage />,
    },
    {
      path: "login",
      element:
        isTokenValid() && token && user ? (
          <Navigate to="/" replace /> 
        ) : (
          <LoginPage />
        ),
    },
    {
      path: "404",
      element: <Page404 />,
    },
    {
      path: "*",
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
