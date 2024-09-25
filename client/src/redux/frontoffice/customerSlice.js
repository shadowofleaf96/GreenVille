import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const login = (credentials) => async (dispatch) => {
  dispatch(loginStart());
  try {
    const response = await axios.post('/v1/customers/login', credentials);
    const { token, customer } = response.data;

    localStorage.setItem('customer_access_token', token);
    
    dispatch(loginSuccess({ token, customer }));
  } catch (error) {
    dispatch(loginFailure(error.response ? error.response.data : error.message));
  }
};

export const fetchCustomerProfile = () => async (dispatch) => {
  const token = localStorage.getItem('customer_access_token');
  if (!token) {
    return;
  }
  
  dispatch(loginStart());
  
  try {
    const response = await axios.get('/v1/customers/profile', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });

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
