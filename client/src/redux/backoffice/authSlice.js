import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "adminAuth",
  initialState: {
    adminUser: null,
    adminToken: null,
  },
  reducers: {
    loginSuccess: (state, action) => {
      state.adminUser = action.payload.adminUser;
      state.adminToken = action.payload.adminToken;
    },
    logout: (state) => {
      state.adminUser = null;
      state.adminToken = null;
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
