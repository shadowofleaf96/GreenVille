import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import createAxiosInstance from "@/utils/axiosConfig";

const ADD_TO_CART = "cart/addItem";
const FETCH_CART = "cart/fetchCart";
const SYNC_CART = "cart/syncCart";
const MERGE_CART = "cart/mergeCart";

// Helper to check auth
const isLoggedIn = (state) => !!state.customers.customer;

// Fetch cart from server
export const fetchCart = createAsyncThunk(
  FETCH_CART,
  async (_, { getState, rejectWithValue }) => {
    try {
      if (!isLoggedIn(getState())) return [];
      const axiosInstance = createAxiosInstance("customer");
      const response = await axiosInstance.get("/cart");
      return response.data.items;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  },
);

// Sync current cart state to server
export const syncCart = createAsyncThunk(SYNC_CART, async (_, { getState }) => {
  const state = getState();
  if (!isLoggedIn(state)) return;

  const cartItems = state.carts.cartItems.map((item) => ({
    product: item.product,
    quantity: item.quantity,
    variant: item.variant,
  }));

  const axiosInstance = createAxiosInstance("customer");
  await axiosInstance.post("/cart/sync", { items: cartItems });
});

// Merge local cart with server cart (on login)
export const mergeCart = createAsyncThunk(
  MERGE_CART,
  async (_, { getState, dispatch }) => {
    try {
      const state = getState();
      // We assume this is called right after login, so auth might not be in state yet if not updated,
      // but usually it is. If not, the API endpoint needs auth token header.
      // Ideally, pass items explicitly if possible, or rely on state.

      const cartItems = state.carts.cartItems.map((item) => ({
        product: item.product,
        quantity: item.quantity,
        variant: item.variant,
      }));

      const axiosInstance = createAxiosInstance("customer");
      // If we have items, merge. If not, just fetch.
      // Actually strictly merge endpoint handles both.
      const response = await axiosInstance.post("/cart/merge", {
        items: cartItems,
      });
      return response.data.items;
    } catch (error) {
      console.error("Merge error", error);
      // If merge fails, at least try to fetch existing
      dispatch(fetchCart());
      return [];
    }
  },
);

export const addItemToCart = createAsyncThunk(
  ADD_TO_CART,
  async ({ id, quantity, variantId, product }, { getState, dispatch }) => {
    try {
      const state = getState();
      let productData =
        product || state.products.products.find((item) => item._id === id);

      if (!productData) {
        const axiosInstance = createAxiosInstance("customer");
        const response = await axiosInstance.get(`/products/${id}`);
        productData = response.data.data;
      }

      // Find variant if variantId is provided
      let variant = null;
      if (variantId && productData.variants) {
        variant = productData.variants.find((v) => v._id === variantId);
      }

      const isOnSale = productData.on_sale;
      const price = variant
        ? variant.price
        : isOnSale
          ? productData.discount_price || productData.price
          : productData.price;
      const stock = variant ? variant.quantity : productData.quantity;

      const newItem = {
        product: productData._id,
        name: productData.product_name,
        price: price,
        discountPrice: variant
          ? null
          : isOnSale
            ? null
            : productData.discount_price,
        onSale: isOnSale,
        option: productData.option,
        image: productData.product_images,
        stock: stock,
        quantity,
        subcategory: productData.subcategory,
        variant: variant || null,
      };

      // Dispatch sync after a short delay to allow reducer to update first
      // Or rely on the extraReducer below to trigger sync?
      // Actually, we can't trigger sync in extraReducer easily without a thunk or middleware.
      // So we'll dispatch it here, but we need the STATE to be updated first.
      // The reducer runs *after* this fulfilled action.
      // So we can't sync *here* if we rely on getState().

      // Better strategy: Simple optimistic update here (return data),
      // and in the UI component, we usually just dispatch addItemToCart.

      return newItem;
    } catch (error) {
      console.error(error);
    }
  },
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartItems: [],
    cartCount: 0,
    shippingInfo: {},
    coupon: null,
  },
  reducers: {
    removeItemFromCart: (state, action) => {
      const { productId, variantId } = action.payload;
      state.cartItems = state.cartItems.filter((item) => {
        if (item.product !== productId) return true;
        if (variantId) {
          return item.variant?._id !== variantId;
        } else {
          return !!item.variant;
        }
      });
      state.cartCount = state.cartItems.reduce(
        (acc, item) => acc + item.quantity,
        0,
      );
    },
    updateCartItemQuantity: (state, action) => {
      const { productId, quantity, variantId } = action.payload;
      const existingItem = state.cartItems.find(
        (item) =>
          item.product === productId &&
          ((!item.variant && !variantId) ||
            (item.variant && item.variant._id === variantId)),
      );

      if (existingItem) {
        existingItem.quantity = quantity;
      }

      state.cartCount = state.cartItems.reduce(
        (acc, item) => acc + item.quantity,
        0,
      );
    },
    saveShippingInfo: (state, action) => {
      state.shippingInfo = action.payload;
    },
    applyCouponCode: (state, action) => {
      state.coupon = action.payload;
    },
    clearCart: (state) => {
      state.cartItems = [];
      state.cartCount = 0;
      state.shippingInfo = {};
      state.coupon = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addItemToCart.fulfilled, (state, action) => {
      if (!action.payload) return;

      const isItemExist = state.cartItems.find(
        (item) =>
          item.product === action.payload.product &&
          ((!item.variant && !action.payload.variant) ||
            (item.variant &&
              action.payload.variant &&
              item.variant._id === action.payload.variant._id)),
      );

      if (isItemExist) {
        state.cartItems = state.cartItems.map((item) =>
          item.product === isItemExist.product &&
          ((!item.variant && !isItemExist.variant) ||
            (item.variant &&
              isItemExist.variant &&
              item.variant._id === isItemExist.variant._id))
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item,
        );
      } else {
        state.cartItems.push(action.payload);
      }

      state.cartCount = state.cartItems.reduce(
        (acc, item) => acc + item.quantity,
        0,
      );
    });

    // Handle Fetch Cart
    builder.addCase(fetchCart.fulfilled, (state, action) => {
      if (action.payload) {
        state.cartItems = action.payload;

        // Re-calculate cart count
        state.cartCount = state.cartItems.reduce(
          (acc, item) => acc + item.quantity,
          0,
        );
      }
    });

    // Handle Merge Cart
    builder.addCase(mergeCart.fulfilled, (state, action) => {
      if (action.payload) {
        state.cartItems = action.payload;
        state.cartCount = state.cartItems.reduce(
          (acc, item) => acc + item.quantity,
          0,
        );
      }
    });

    builder.addCase("customer/logout", (state) => {
      state.cartItems = [];
      state.cartCount = 0;
      state.shippingInfo = {};
      state.coupon = null;
    });
  },
});

export const {
  removeItemFromCart,
  updateCartItemQuantity,
  saveShippingInfo,
  applyCouponCode,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
