import { createSlice } from "@reduxjs/toolkit";

const categorySlice = createSlice({
  name: "adminCategory",
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
    deleteCategory: (state, action) => {
      state.data = state.data.filter(
        (category) => !action.payload.includes(category._id)
      );
    },
  },
});

export const {
  setData,
  setLoading,
  setError,
  setFilterName,
  deleteCategory,
} = categorySlice.actions;

export default categorySlice.reducer;
