import { lazy, Suspense, useState, useEffect } from "react";
import { Outlet, Navigate, Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import DashboardLayout from "../backoffice/layouts/dashboard";
import axios from "axios";

import Login from "../frontoffice/pages/auth/login/Login";
import Register from "../frontoffice/pages/auth/register/Register";
import ResetPassword from "../frontoffice/pages/auth/resetPassword/ResetPassword";
import SingleProduct from "../frontoffice/pages/singleProduct/SingleProduct";
import Cart from "../frontoffice/pages/cart/Cart";
import Shipping from "../frontoffice/pages/cart/shipping/Shipping";
import ConfirmOrder from "../frontoffice/pages/cart/confirmOrder/ConfirmOrder";
import Payment from "../frontoffice/pages/cart/payment/Payment";
import Success from "../frontoffice/pages/cart/success/Success";
import Profile from "../frontoffice/pages/user/Profile";
import UpdateProfile from "../frontoffice/pages/user/updateProfile/UpdateProfile";
import MyOrders from "../frontoffice/pages/user/myOrders/MyOrders";
import About from "../frontoffice/pages/about/About";
import Home from "../frontoffice/pages/home/Home";
import Products from "../frontoffice/pages/products/Products";
import Category from "../frontoffice/pages/home/category/Category";
import Contact from "../frontoffice/pages/contact/Contact";

export const IndexPage = lazy(() => import("../backoffice/pages/app"));
export const CategoryPage = lazy(() => import("../backoffice/pages/category"));
export const SubCategoryPage = lazy(() =>
  import("../backoffice/pages/subcategory")
);
export const ProfilePage = lazy(() => import("../backoffice/pages/profile"));
export const PaymentListPage = lazy(() =>
  import("../backoffice/pages/paymentlist")
);
export const CustomerPage = lazy(() => import("../backoffice/pages/customer"));
export const OrderPage = lazy(() => import("../backoffice/pages/order"));
export const UserPage = lazy(() => import("../backoffice/pages/user"));
export const LoginPage = lazy(() => import("../backoffice/pages/login"));
export const ProductPage = lazy(() => import("../backoffice/pages/product"));
export const Page404 = lazy(() => import("../backoffice/pages/page-not-found"));
export const ResetPasswordPage = lazy(() =>
  import("../backoffice/pages/reset-password")
);

const paypalClientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;

const initialOptions = {
  clientId: paypalClientId,
  currency: "USD",
  intent: "capture",
};

export default function Router() {

  const [customer, setCustomer] = useState({});
  const [user, setUser] = useState({});


  useEffect(() => {
    const userToken = localStorage.getItem("user_access_token");
    const customerToken = localStorage.getItem("customer_access_token")

    const fetchUserData = async () => {
      if (userToken) {
        try {
          const { data } = await axios.get("/v1/users/profile", {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          });
          setUser(data);
        } catch (err) {
          localStorage.removeItem("user_access_token");
        }
      }
    };

    const fetchCustomerData = async () => {
      if (customerToken) {
        try {
          const { data } = await axios.get("/v1/customers/profile", {
            headers: {
              Authorization: `Bearer ${customerToken}`,
            },
          });
          setCustomer(data);
        } catch (err) {
          localStorage.removeItem("customer_access_token");
        }
      }
    };

    fetchUserData();
    fetchCustomerData();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} exact />
      <Route path="/register" element={<Register />} exact />
      <Route path="/reset-password/:token" element={<ResetPassword />} exact />
      <Route path="/about" element={<About />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/products" element={<Products />} />
      <Route path="/categories" element={<Category />} />
      <Route path="/products/:categoryId/*" element={<Products />} />
      <Route path="/products/search/:keyword" element={<Products />} />
      <Route path="/product/:id" element={<SingleProduct />} />
      <Route path="*" element={<Page404 />} />

      {user ? (
        <Route
          path="/"
          element={
            <DashboardLayout>
              <Suspense>
                <Outlet />
              </Suspense>
            </DashboardLayout>
          }
        >
          <Route index element={<IndexPage />} />
          <Route path="/admin/profile" element={<ProfilePage />} />
          <Route path="/admin/user" element={<UserPage />} />
          <Route path="/admin/category" element={<CategoryPage />} />
          <Route path="/admin/subcategory" element={<SubCategoryPage />} />
          <Route path="/admin/order" element={<OrderPage />} />
          <Route path="/admin/products" element={<ProductPage />} />
          <Route path="/admin/paymentlist" element={<PaymentListPage />} />
          <Route path="/admin/customer" element={<CustomerPage />} />
        </Route>
      ) : (
        <Route path="/admin/login" element={<LoginPage />} />
      )}

      {customer ? (
        <>
          <Route path="/me" element={<Profile />} />
          <Route path="/me/update" element={<UpdateProfile />} />
          <Route path="/orders/me" element={<MyOrders />} />
          <Route path="/shipping" element={<Shipping />} />
          <Route path="/confirm" element={<ConfirmOrder />} />
          <Route
            path="/payment"
            element={
              <PayPalScriptProvider options={initialOptions}>
                <Payment />
              </PayPalScriptProvider>
            }
          />
          <Route path="/success" element={<Success />} />
        </>
      ) : null}
    </Routes>
  );
}
