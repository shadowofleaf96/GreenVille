import { createSlice } from "@reduxjs/toolkit";

const subCategorySlice = createSlice({
  name: "adminSubcategory",
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
    deleteSubCategory: (state, action) => {
      state.data = state.data.filter(
        (subcategories) => !action.payload.includes(subcategories._id)
      );
    },
  },
});

export const {
  setData,
  setLoading,
  setError,
  setFilterName,
  deleteSubCategory,
} = subCategorySlice.actions;

export default subCategorySlice.reducer;
