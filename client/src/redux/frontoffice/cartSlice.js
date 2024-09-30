import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import axios from "axios";
import createAxiosInstance from "../../utils/axiosConfig";

const ADD_TO_CART = "cart/addItem";

export const addItemToCart = createAsyncThunk(
  ADD_TO_CART,
  async ({ id, quantity }, { getState }) => {
    try {
      const state = getState();
      let productData;

      productData = state.products.products.find((item) => item._id === id);

      if (!productData) {
        const axiosInstance = createAxiosInstance("customer");
        const response = await axiosInstance.get(`/products/${id}`);
        productData = response.data.data;
        console.log("Using external API");
      } else {
        console.log("Using internal Redux state");
      }

      return {
        product: productData._id,
        name: productData.product_name,
        price: productData.price,
        discountPrice: productData.discount_price,
        option: productData.option,
        image: productData.product_image,
        stock: productData.quantity,
        quantity,
        subcategory: productData.subcategory,
      };
    } catch (error) {
      console.log(error);
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartItems: [],
    shippingInfo: {},
  },
  reducers: {
    removeItemFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(
        (item) => item.product !== action.payload
      );
    },
    updateCartItemQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const existingItem = state.cartItems.find(
        (item) => item.product === productId
      );

      if (existingItem) {
        existingItem.quantity = quantity;
      }
    },
    saveShippingInfo: (state, action) => {
      state.shippingInfo = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addItemToCart.fulfilled, (state, action) => {
      if (!action.payload) {
        console.error("Received undefined payload from addItemToCart");
        return;
      }

      const isItemExist = state.cartItems.find(
        (item) => item.product === action.payload.product
      );

      if (isItemExist) {
        state.cartItems = state.cartItems.map((item) =>
          item.product === isItemExist.product
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
      } else {
        state.cartItems.push(action.payload);
      }
    });
  },
});

export const { removeItemFromCart, updateCartItemQuantity, saveShippingInfo } =
  cartSlice.actions;

export default cartSlice.reducer;
