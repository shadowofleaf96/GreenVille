import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import adminAuthReducer from "./backoffice/authSlice";
import adminUserReducer from "./backoffice/userSlice";
import adminProductReducer from "./backoffice/productSlice";
import adminPaymentListReducer from "./backoffice/paymentListSlice";
import adminCategoryReducer from "./backoffice/categorySlice";
import adminSubCategoryReducer from "./backoffice/subCategorySlice";
import adminCouponReducer from "./backoffice/couponSlice";
import adminReviewReducer from "./backoffice/reviewSlice";
import adminCustomerReducer from "./backoffice/customerSlice";
import adminOrderReducer from "./backoffice/orderSlice";
import cartReducer from "./frontoffice/cartSlice";
import categoriesReducer from "./frontoffice/categoriesSlice";
import subcategoriesReducer from "./frontoffice/subcategoriesSlice";
import orderReducer from "./frontoffice/orderSlice";
import productReducer from "./frontoffice/productSlice";
import customerReducer from "./frontoffice/customerSlice";

const cartPersistConfig = {
  key: "cart",
  storage,
};

const persistedCartReducer = persistReducer(cartPersistConfig, cartReducer);

const store = configureStore({
  reducer: {
    adminAuth: adminAuthReducer,
    adminUser: adminUserReducer,
    adminProduct: adminProductReducer,
    adminCoupon: adminCouponReducer,
    adminReview: adminReviewReducer,
    adminCategory: adminCategoryReducer,
    adminSubcategory: adminSubCategoryReducer,
    adminCustomer: adminCustomerReducer,
    adminOrder: adminOrderReducer,
    adminPaymentList: adminPaymentListReducer,
    carts: persistedCartReducer,
    categories: categoriesReducer,
    subcategories: subcategoriesReducer,
    orders: orderReducer,
    products: productReducer,
    customers: customerReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

const persistor = persistStore(store);

export { store, persistor };
