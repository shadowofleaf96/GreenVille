import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for the web
import authReducer from "./authSlice";
import userReducer from "./userSlice";
import productReducer from "./productSlice";
import categoryReducer from "./categorySlice";
import subCategoryReducer from "./subCategorySlice";
import customerReducer from "./customerSlice"
import orderReducer from "./orderSlice"


const authPersistConfig = {
  key: "auth",
  storage,
};

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);

const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    user: userReducer,
    product: productReducer,
    category: categoryReducer,
    subcategory: subCategoryReducer,
    customer: customerReducer,
    order: orderReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

const persistor = persistStore(store);

export { store, persistor };
