import { lazy, Suspense, useState, useEffect } from "react";
import { Outlet, Navigate, Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import DashboardLayout from "../backoffice/layouts/dashboard";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Slide, Zoom, Flip, Bounce } from 'react-toastify';

import Login from "../frontoffice/pages/auth/login/Login";
import Register from "../frontoffice/pages/auth/register/Register";
import ResetPassword from "../frontoffice/pages/auth/resetPassword/ResetPassword";
import SetGooglePassword from "../frontoffice/pages/auth/setGooglePassword/SetGooglePassword";
import CheckEmail from "../frontoffice/pages/auth/checkEmail/CheckEmail";
import SingleProduct from "../frontoffice/pages/singleProduct/SingleProduct";
import Cart from "../frontoffice/pages/cart/Cart";
import Shipping from "../frontoffice/pages/cart/shipping/Shipping";
import ConfirmOrder from "../frontoffice/pages/cart/confirmOrder/ConfirmOrder";
import Payment from "../frontoffice/pages/cart/payment/Payment";
import Success from "../frontoffice/pages/cart/success/Success";
import UpdateProfile from "../frontoffice/pages/user/updateProfile/UpdateProfile";
import MyOrders from "../frontoffice/pages/user/myOrders/MyOrders";
import About from "../frontoffice/pages/about/About";
import Home from "../frontoffice/pages/home/Home";
import Products from "../frontoffice/pages/products/Products";
import Category from "../frontoffice/pages/home/category/Category";
import Contact from "../frontoffice/pages/contact/Contact";

import ProtectedRoute from "../routes/components/ProtectedRoute";
import { LoginView } from "../backoffice/sections/login";
import FrontProtectedRoute from "./components/FrontProtectedRoute";
import MainLayout from "../frontoffice/pages/layout/Layout";
import TermsAndConditions from "../frontoffice/pages/policies/TermsConditions";
import ReturnsAndExchanges from "../frontoffice/pages/policies/ReturnsExchanges";
import ShippingAndDeliveryPolicy from "../frontoffice/pages/policies/ShippingDelivery";
import RefundPolicy from "../frontoffice/pages/policies/RefundPolicy";

export const IndexPage = lazy(() => import("../backoffice/pages/app"));
export const CategoryPage = lazy(() => import("../backoffice/pages/category"));
export const SubCategoryPage = lazy(() => import("../backoffice/pages/subcategory"));
export const CouponPage = lazy(() => import("../backoffice/pages/coupon"));
export const ProfilePage = lazy(() => import("../backoffice/pages/profile"));
export const PaymentListPage = lazy(() => import("../backoffice/pages/payment"));
export const CustomerPage = lazy(() => import("../backoffice/pages/customer"));
export const OrderPage = lazy(() => import("../backoffice/pages/order"));
export const UserPage = lazy(() => import("../backoffice/pages/user"));
export const LoginPage = lazy(() => import("../backoffice/pages/login"));
export const ProductPage = lazy(() => import("../backoffice/pages/product"));
export const Page404 = lazy(() => import("../backoffice/pages/page-not-found"));

const paypalClientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;

const initialOptions = {
  clientId: paypalClientId,
  currency: "USD",
  intent: "capture",
};

export default function Router() {

  return (
    <div>
      <ToastContainer autoClose={2000}
        hideProgressBar={true}
        position="bottom-left" transition={Slide}
      />
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/products" element={<Products />} />
          <Route path="/terms" element={<TermsAndConditions />} />
          <Route path="/return" element={<ReturnsAndExchanges />} />
          <Route path="/shippingpolicy" element={<ShippingAndDeliveryPolicy />} />
          <Route path="/refund" element={<RefundPolicy />} />
          <Route path="/categories" element={<Category />} />
          <Route path="/products/:subcategory/*" element={<Products />} />
          <Route path="/product/:id" element={<SingleProduct />} />
        </Route>

        <Route path="/register" element={<Register />} exact />
        <Route path="/reset-password/:token" element={<ResetPassword />} exact />
        <Route path="/set-password" element={<SetGooglePassword />} exact />
        <Route path="/check-email" element={<CheckEmail />} exact />
        <Route path="/login" element={<Login />} exact />
        <Route path="*" element={<Page404 />} />

        <Route path="/admin" element={<ProtectedRoute />}>
          <Route index element={<IndexPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="user" element={<UserPage />} />
          <Route path="category" element={<CategoryPage />} />
          <Route path="subcategory" element={<SubCategoryPage />} />
          <Route path="coupon" element={<CouponPage />} />
          <Route path="order" element={<OrderPage />} />
          <Route path="products" element={<ProductPage />} />
          <Route path="paymentlist" element={<PaymentListPage />} />
          <Route path="customer" element={<CustomerPage />} />
        </Route>
        <Route path="admin/login" element={<LoginView />} />

        <Route path="/" element={<FrontProtectedRoute />}>
          <Route path="/profile/update" element={<UpdateProfile />} />
          <Route path="/profile/orders" element={<MyOrders />} />
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
        </Route>
      </Routes>
    </div>
  );
}
