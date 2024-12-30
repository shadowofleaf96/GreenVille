import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import createAxiosInstance from "../../utils/axiosConfig";

export const fetchUserProfile = () => async (dispatch) => {
  dispatch(loginStart());

  try {
    const axiosInstance = createAxiosInstance("admin");
    const response = await axiosInstance.get("/users/profile");
    dispatch(setUser(response.data));
    if(error.response.data.message === "This session has expired. Please login") {
      localStorage.removeItem("user_access_token")
    }
  } catch (error) {
    console.log(error);
  }
};

const authSlice = createSlice({
  name: "adminAuth",
  initialState: {
    admin: null,
    adminToken: null,
  },
  reducers: {
    loginStart: (state) => {
      state.admin = null;
      state.adminToken = null;
    },
    loginSuccess: (state, action) => {
      state.admin = action.payload.admin;
      state.adminToken = action.payload.adminToken;
    },
    logout: (state) => {
      state.admin = null;
      state.adminToken = null;
    },
    setUser: (state, action) => {
      state.admin = action.payload;
      state.loading = false;
    },
  },
});

export const { loginStart, loginSuccess, logout, setUser } = authSlice.actions;
export default authSlice.reducer;
