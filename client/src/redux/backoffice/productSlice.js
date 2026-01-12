import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
  name: "adminProduct",
  initialState: {
    data: null,
    loading: false,
    error: null,
    filterName: "",
    total: 0,
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
    setTotal: (state, action) => {
      state.total = action.payload;
    },
    deleteProduct: (state, action) => {
      state.data = state.data.filter(
        (product) => !action.payload.includes(product._id),
      );
    },
  },
});

export const {
  setData,
  setLoading,
  setError,
  setFilterName,
  setTotal,
  deleteProduct,
} = productSlice.actions;

export default productSlice.reducer;
