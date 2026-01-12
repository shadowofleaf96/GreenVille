import { createSlice } from "@reduxjs/toolkit";

const reviewSlice = createSlice({
  name: "adminReview",
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
    deleteReview: (state, action) => {
      state.data = state.data.filter(
        (reviews) => !action.payload.includes(reviews._id),
      );
    },
  },
});

export const { setData, setLoading, setError, setFilterName, deleteReview } =
  reviewSlice.actions;

export default reviewSlice.reducer;
