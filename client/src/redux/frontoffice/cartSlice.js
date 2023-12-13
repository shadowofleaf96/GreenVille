import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// Import your API client
import axios from "axios";

// Define cart action types
const ADD_TO_CART = "cart/addItem";
const REMOVE_ITEM_FROM_CART = "cart/removeItem";
const UPDATE_CART_ITEM = "cart/updateCartItem";
const SAVE_SHIPPING_INFO = "cart/saveShippingInfo";

// Create an async thunk for adding items to cart
export const addItemToCart = createAsyncThunk(
  ADD_TO_CART,
  async ({ id, quantity }) => {
    try {
      const response = await axios.get(`/v1/products/${id}`);
      const productData = response.data.data;
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
      console.log(error)
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
      state.cartItems = state.cartItems.filter((item) => item.product !== action.payload);
    },
    updateCartItemQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const existingItem = state.cartItems.find((item) => item.product === productId);
      if (existingItem) {
        existingItem.quantity = quantity;
      }
    },
    saveShippingInfo: (state, action) => {
      state.shippingInfo = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addItemToCart.fulfilled, (state, action) => {
        const isItemExist = state.cartItems.find((item) => item.product === action.payload.product);
        if (isItemExist) {
          state.cartItems = state.cartItems.map((item) =>
            item.product === isItemExist.product ? action.payload : item
          );
        } else {
          state.cartItems.push(action.payload);
        }
      })
  },
});

export const { removeItemFromCart, updateCartItemQuantity, saveShippingInfo } = cartSlice.actions;

export default cartSlice.reducer;
