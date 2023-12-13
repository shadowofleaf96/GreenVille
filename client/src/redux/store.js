import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import adminAuthReducer from "./backoffice/authSlice";
import adminUserReducer from "./backoffice/userSlice";
import adminProductReducer from "./backoffice/productSlice";
import adminCategoryReducer from "./backoffice/categorySlice";
import adminSubCategoryReducer from "./backoffice/subCategorySlice";
import adminCustomerReducer from "./backoffice/customerSlice";
import adminOrderReducer from "./backoffice/orderSlice";
import cartReducer from "./frontoffice/cartSlice";
import categoriesReducer from "./frontoffice/categoriesSlice";
import subcategoriesReducer from "./frontoffice/subcategoriesSlice";
import orderReducer from "./frontoffice/orderSlice";
import productReducer from "./frontoffice/productSlice";
import customerReducer from "./frontoffice/customerSlice";

const authPersistConfig = {
  key: "adminAuth",
  storage,
};

const customerAuthPersistConfig = {
  key: "customerAuth",
  storage,
};

const cartPersistConfig = {
  key: "cart",
  storage,
};

const persistedAuthReducer = persistReducer(authPersistConfig, adminAuthReducer);
const persistedCustomerAuthReducer = persistReducer(customerAuthPersistConfig, customerReducer);
const persistedCartReducer = persistReducer(cartPersistConfig, cartReducer);


const store = configureStore({
  reducer: {
    adminAuth: persistedAuthReducer,
    adminUser: adminUserReducer,
    adminProduct: adminProductReducer,
    adminCategory: adminCategoryReducer,
    adminSubcategory: adminSubCategoryReducer,
    adminCustomer: adminCustomerReducer,
    adminOrder: adminOrderReducer,
    carts: persistedCartReducer,
    categories: categoriesReducer,
    subcategories: subcategoriesReducer,
    orders: orderReducer,
    products: productReducer,
    customers: persistedCustomerAuthReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

const persistor = persistStore(store);

export { store, persistor };
