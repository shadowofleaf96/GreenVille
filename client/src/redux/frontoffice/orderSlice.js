import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from "axios"

export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (order, { getState, rejectWithValue }) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const { data } = await axios.post('/api/v1/order/new', order, config);

      return data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const myOrders = createAsyncThunk('orders/myOrders', async (_, { rejectWithValue }) => {
  try {
    const { data } = await axios.get('/api/v1/orders/me');
    return data.orders;
  } catch (error) {
    return rejectWithValue(error.response.data.message);
  }
});

export const allOrders = createAsyncThunk('orders/allOrders', async (_, { rejectWithValue }) => {
  try {
    const { data } = await axios.get('/api/v1/admin/orders');
    return data;
  } catch (error) {
    return rejectWithValue(error.response.data.message);
  }
});

export const updateOrder = createAsyncThunk(
  'orders/updateOrder',
  async ({ id, orderData }, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const { data } = await axios.put(`/api/v1/admin/order/${id}`, orderData, config);
      return data.success;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const deleteOrder = createAsyncThunk('orders/deleteOrder', async (id, { rejectWithValue }) => {
  try {
    const { data } = await axios.delete(`/api/v1/admin/order/${id}`);
    return data.success;
  } catch (error) {
    return rejectWithValue(error.response.data.message);
  }
});

export const getOrderDetails = createAsyncThunk(
  'orders/getOrderDetails',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/api/v1/order/${id}`);
      return data.order;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    createOrder: { loading: false, order: null, error: null },
    myOrders: { loading: false, orders: [], error: null },
    allOrders: { loading: false, orders: [], totalAmount: 0, error: null },
    updateOrder: { loading: false, isUpdated: false, error: null },
    deleteOrder: { loading: false, isDeleted: false, error: null },
    orderDetails: { loading: false, order: {}, error: null },
  },
  reducers: {
    clearErrors: (state) => {
      state.createOrder.error = null;
      state.myOrders.error = null;
      state.allOrders.error = null;
      state.updateOrder.error = null;
      state.deleteOrder.error = null;
      state.orderDetails.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.createOrder.loading = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.createOrder.loading = false;
        state.createOrder.order = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.createOrder.loading = false;
        state.createOrder.error = action.payload;
      })
      .addCase(myOrders.pending, (state) => {
        state.myOrders.loading = true;
      })
      .addCase(myOrders.fulfilled, (state, action) => {
        state.myOrders.loading = false;
        state.myOrders.orders = action.payload;
      })
      .addCase(myOrders.rejected, (state, action) => {
        state.myOrders.loading = false;
        state.myOrders.error = action.payload;
      })
      .addCase(allOrders.pending, (state) => {
        state.allOrders.loading = true;
      })
      .addCase(allOrders.fulfilled, (state, action) => {
        state.allOrders.loading = false;
        state.allOrders.orders = action.payload.orders;
        state.allOrders.totalAmount = action.payload.totalAmount;
      })
      .addCase(allOrders.rejected, (state, action) => {
        state.allOrders.loading = false;
        state.allOrders.error = action.payload;
      })
      .addCase(updateOrder.pending, (state) => {
        state.updateOrder.loading = true;
      })
      .addCase(updateOrder.fulfilled, (state, action) => {
        state.updateOrder.loading = false;
        state.updateOrder.isUpdated = action.payload;
      })
      .addCase(updateOrder.rejected, (state, action) => {
        state.updateOrder.loading = false;
        state.updateOrder.error = action.payload;
      })
      .addCase(deleteOrder.pending, (state) => {
        state.deleteOrder.loading = true;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.deleteOrder.loading = false;
        state.deleteOrder.isDeleted = action.payload;
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.deleteOrder.loading = false;
        state.deleteOrder.error = action.payload;
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
