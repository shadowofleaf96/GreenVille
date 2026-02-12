import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
  name: "products",
  initialState: {
    product: {},
    products: [],
    loading: false,
    error: null,
    total: 0,
    page: 1,
    limit: 10,
    maxPrice: 10000,
  },
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
  },
});

export const { clearErrors } = productSlice.actions;

export default productSlice.reducer;
