import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  categories: [],
  error: null,
};

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
  },
});

export const { clearErrors } = categoriesSlice.actions;

export default categoriesSlice.reducer;
