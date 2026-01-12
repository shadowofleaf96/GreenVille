import { createSlice } from "@reduxjs/toolkit";

const couponSlice = createSlice({
  name: "adminCoupon",
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
    deleteCoupon: (state, action) => {
      state.data = state.data.filter(
        (coupons) => !action.payload.includes(coupons._id),
      );
    },
  },
});

export const { setData, setLoading, setError, setFilterName, deleteCoupon } =
  couponSlice.actions;

export default couponSlice.reducer;
