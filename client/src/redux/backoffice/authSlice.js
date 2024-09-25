import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "adminAuth",
  initialState: {
    adminToken: null,
  },
  reducers: {
    loginSuccess: (state, action) => {
      state.adminToken = action.payload.adminToken;
    },
    logout: (state) => {
      state.adminToken = null;
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
