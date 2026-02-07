import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  subcategories: [],
  error: null,
};

const subcategoriesSlice = createSlice({
  name: "subcategories",
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
  },
});

export const { clearErrors } = subcategoriesSlice.actions;

export default subcategoriesSlice.reducer;
