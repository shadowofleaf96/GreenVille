import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import createAxiosInstance from "../../utils/axiosConfig";

const axiosInstance = createAxiosInstance("customer");
export const ordersList = createAsyncThunk(
  "orders/ordersList",
  async (userId, { rejectWithValue }) => {
    try {
      let orders;
      if (!orders) {
        const { data } = await axiosInstance.get(`/orders/${userId}`);
        orders = data.orders;
        return orders;
      }
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  },
);

export const getOrderDetails = createAsyncThunk(
  "orders/getOrderDetails",
  async (id, { rejectWithValue }) => {
    try {
      let order;
      if (!order) {
        const { data } = await axiosInstance.get(`/orders/${id}`);
        order = data.order;
        return order;
      }
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  },
);

const orderSlice = createSlice({
  name: "orders",
  initialState: {
    ordersList: { loading: false, orders: [], error: null },
    orderDetails: { loading: false, order: {}, error: null },
  },
  reducers: {
    clearErrors: (state) => {
      state.ordersList.error = null;
      state.orderDetails.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(ordersList.pending, (state) => {
        state.ordersList.loading = true;
      })
      .addCase(ordersList.fulfilled, (state, action) => {
        state.ordersList.loading = false;
        state.ordersList.orders = action.payload;
      })
      .addCase(ordersList.rejected, (state, action) => {
        state.ordersList.loading = false;
        state.ordersList.error = action.payload;
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
