import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import createAxiosInstance from "../../utils/axiosConfig";

export const fetchCustomerProfile = () => async (dispatch) => {
  dispatch(loginStart());

  try {
    const axiosInstance = createAxiosInstance("customer");
    const response = await axiosInstance.get("/customers/profile");
    dispatch(setCustomer(response.data));
  } catch (error) {
    dispatch(loginFailure(error.message));
  }
};

const customerSlice = createSlice({
  name: "customer",
  initialState: {
    customer: null,
    customerToken: null,
    loading: false,
    error: null,
  },
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.customer = action.payload.customer;
      state.customerToken = action.payload.token;
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.customer = null;
      state.customerToken = null;
    },
    setCustomer: (state, action) => {
      state.customer = action.payload;
      state.loading = false;
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, setCustomer, logout } =
  customerSlice.actions;

export default customerSlice.reducer;
