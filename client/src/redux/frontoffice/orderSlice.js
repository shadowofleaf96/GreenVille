import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const myOrdersList = createAsyncThunk(
  "orders/myOrdersList",
  async (userId, { rejectWithValue }) => {
    try {
      let orders;
      if (!orders) {
        const { data } = await axios.get(`/v1/orders/${userId}`);
        orders = data.orders;
        return data.orders;
      }
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const getOrderDetails = createAsyncThunk(
  "orders/getOrderDetails",
  async (id, { rejectWithValue }) => {
    try {
      let order;
      if (!order) {
        const { data } = await axios.get(`/v1/orders/${id}`);
        order = data.order;
        return data.order;
      }
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const orderSlice = createSlice({
  name: "orders",
  initialState: {
    myOrdersList: { loading: false, orders: [], error: null },
    orderDetails: { loading: false, order: {}, error: null },
  },
  reducers: {
    clearErrors: (state) => {
      state.myOrdersList.error = null;
      state.orderDetails.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(myOrdersList.pending, (state) => {
        state.myOrdersList.loading = true;
      })
      .addCase(myOrdersList.fulfilled, (state, action) => {
        state.myOrdersList.loading = false;
        state.myOrdersList.orders = action.payload;
      })
      .addCase(myOrdersList.rejected, (state, action) => {
        state.myOrdersList.loading = false;
        state.myOrdersList.error = action.payload;
      })
      .addCase(getOrderDetails.pending, (state) => {
        state.orderDetails.loading = true;
      })
      .addCase(getOrderDetails.fulfilled, (state, action) => {
        state.orderDetails.loading = false;
        state.orderDetails.order = action.payload;
      })
      .addCase(getOrderDetails.rejected, (state, action) => {
        state.orderDetails.loading = false;
        state.orderDetails.error = action.payload;
      });
  },
});

export const { clearErrors } = orderSlice.actions;

export default orderSlice.reducer;
