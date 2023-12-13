import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
  name: "adminCustomer",
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
    deleteCustomer: (state, action) => {
      state.data = state.data.filter(
        (product) => !action.payload.includes(product._id)
      );
    },
  },
});

export const {
  setData,
  setLoading,
  setError,
  setFilterName,
  deleteCustomer,
} = productSlice.actions;

export default productSlice.reducer;
