import { createSlice } from "@reduxjs/toolkit";

const orderSlice = createSlice({
  name: "adminOrder",
  initialState: {
    data: null,
    loading: false,
    error: null,
    filterName: "",
  },
  reducers: {
    setData: (state, action) => {
      state.data = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setFilterName: (state, action) => {
      state.filterName = action.payload;
    },
    deleteOrder: (state, action) => {
      state.data = state.data.filter(
        (order) => !action.payload.includes(order._id)
      );
    },
  },
});

export const {
  setData,
  setLoading,
  setError,
  setFilterName,
  deleteOrder,
} = orderSlice.actions;

export default orderSlice.reducer;
