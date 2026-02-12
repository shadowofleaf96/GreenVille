import { createSlice } from "@reduxjs/toolkit";
import createAxiosInstance from "@/utils/axiosConfig";

export const fetchUserProfile = () => async (dispatch) => {
  dispatch(loginStart());

  try {
    const axiosInstance = createAxiosInstance("admin");
    const response = await axiosInstance.get("/users/profile");
    const user = response.data;
    dispatch(setUser(user));

    if (user.role === "vendor" && user._id) {
      dispatch(fetchVendorProfile(user._id));
    }
  } catch (error) {
    console.error(error);
    if (
      error.response?.data?.message === "This session has expired. Please login"
    ) {
      localStorage.removeItem("user_access_token");
    }
  }
};

export const fetchVendorProfile = (userId) => async (dispatch) => {
  try {
    const axiosInstance = createAxiosInstance("admin");
    const response = await axiosInstance.get(`/vendors/profile/${userId}`);
    dispatch(setVendor(response.data.data));
  } catch (error) {
    console.error("Error fetching vendor profile", error);
  }
};

export const updateVendorProfile = (userId, formData) => async (dispatch) => {
  try {
    const axiosInstance = createAxiosInstance("admin");
    const response = await axiosInstance.put(
      `/vendors/profile/${userId}`,
      formData,
    );
    dispatch(setVendor(response.data.data));
    return response.data.data;
  } catch (error) {
    console.error("Error updating vendor profile", error);
    throw error;
  }
};

const authSlice = createSlice({
  name: "adminAuth",
  initialState: {
    admin: null,
    adminToken: null,
    vendor: null,
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
    setVendor: (state, action) => {
      state.vendor = action.payload;
    },
  },
});

export const { loginStart, loginSuccess, logout, setUser, setVendor } =
  authSlice.actions;
export default authSlice.reducer;
