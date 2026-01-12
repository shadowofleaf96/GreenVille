import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import createAxiosInstance from "../../utils/axiosConfig";

const ADD_TO_CART = "cart/addItem";

export const addItemToCart = createAsyncThunk(
  ADD_TO_CART,
  async ({ id, quantity, variantId }, { getState }) => {
    try {
      const state = getState();
      let productData = state.products.products.find((item) => item._id === id);

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

      return {
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
        // If product ID matches, check variant
        if (variantId) {
          // If we want to remove a specific variant, keep other variants or the base product
          return item.variant?._id !== variantId;
        } else {
          // If we want to remove a base product (no variant), keep variant items
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
      if (!action.payload) {
        console.error("Received undefined payload from addItemToCart");
        return;
      }

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
