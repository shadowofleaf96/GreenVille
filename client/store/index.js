import { configureStore, createListenerMiddleware } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";
import adminAuthReducer from "./slices/admin/authSlice";
import adminUserReducer from "./slices/admin/userSlice";
import adminProductReducer from "./slices/admin/productSlice";
import adminContactReducer from "./slices/admin/contactSlice";
import adminPaymentListReducer from "./slices/admin/paymentListSlice";
import adminCategoryReducer from "./slices/admin/categorySlice";
import adminSubCategoryReducer from "./slices/admin/subCategorySlice";
import adminNotificationReducer from "./slices/admin/notificationSlice";
import adminCouponReducer from "./slices/admin/couponSlice";
import adminReviewReducer from "./slices/admin/reviewSlice";
import adminCustomerReducer from "./slices/admin/customerSlice";
import adminOrderReducer from "./slices/admin/orderSlice";
import adminSettingsReducer from "./slices/admin/settingsSlice";
import adminLocalizationReducer from "./slices/admin/localizationSlice";
import cartReducer, {
  addItemToCart,
  removeItemFromCart,
  updateCartItemQuantity,
  clearCart,
  syncCart,
  mergeCart,
  fetchCart,
} from "./slices/shop/cartSlice";
import categoriesReducer from "./slices/shop/categoriesSlice";
import subcategoriesReducer from "./slices/shop/subcategoriesSlice";
import orderReducer from "./slices/shop/orderSlice";
import productReducer from "./slices/shop/productSlice";
import customerReducer, {
  loginSuccess,
  logout,
  setCustomer,
} from "./slices/shop/customerSlice";

const createNoopStorage = () => {
  return {
    getItem(_key) {
      return Promise.resolve(null);
    },
    setItem(_key, value) {
      return Promise.resolve(value);
    },
    removeItem(_key) {
      return Promise.resolve();
    },
  };
};

const storage =
  typeof window !== "undefined"
    ? createWebStorage("local")
    : createNoopStorage();

const cartPersistConfig = {
  key: "cart",
  storage,
  whitelist: ["cartItems", "cartCount", "coupon"], // Explicitly whitelist properties
};

const persistedCartReducer = persistReducer(cartPersistConfig, cartReducer);

const listenerMiddleware = createListenerMiddleware();

listenerMiddleware.startListening({
  matcher: (action) => {
    return (
      addItemToCart.fulfilled.match(action) ||
      removeItemFromCart.match(action) ||
      updateCartItemQuantity.match(action) ||
      clearCart.match(action)
    );
  },
  effect: async (action, listenerApi) => {
    const state = listenerApi.getState();
    if (state.customers.customer) {
      listenerApi.dispatch(syncCart());
    }
  },
});

listenerMiddleware.startListening({
  actionCreator: loginSuccess,
  effect: async (action, listenerApi) => {
    listenerApi.dispatch(mergeCart());
  },
});

listenerMiddleware.startListening({
  actionCreator: setCustomer,
  effect: async (action, listenerApi) => {
    listenerApi.dispatch(fetchCart());
  },
});

const store = configureStore({
  reducer: {
    adminAuth: adminAuthReducer,
    adminUser: adminUserReducer,
    adminNotification: adminNotificationReducer,
    adminProduct: adminProductReducer,
    adminCoupon: adminCouponReducer,
    adminReview: adminReviewReducer,
    adminContact: adminContactReducer,
    adminCategory: adminCategoryReducer,
    adminSubcategory: adminSubCategoryReducer,
    adminCustomer: adminCustomerReducer,
    adminOrder: adminOrderReducer,
    adminPaymentList: adminPaymentListReducer,
    adminSettings: adminSettingsReducer,
    adminLocalization: adminLocalizationReducer,
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
    }).prepend(listenerMiddleware.middleware),
});

const persistor = persistStore(store);

export { store, persistor };
