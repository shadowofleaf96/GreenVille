import { createSlice } from "@reduxjs/toolkit";

const customerSlice = createSlice({
  name: "customer",
  initialState: {
    customer: null,
    token: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.isLoading = false;
      state.customer = action.payload.customer;
      state.token = action.payload.token;
    },
    loginFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.customer = null;
      state.token = null;
    },
    setCustomer: (state, action) => {
      state.customer = action.payload;
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, setCustomer, logout } =
customerSlice.actions;
export default customerSlice.reducer;
