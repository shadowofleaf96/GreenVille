import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "adminUser",
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
    deleteUser: (state, action) => {
      state.data = state.data.filter(
        (adminUser) => !action.payload.includes(adminUser._id)
      );
    },
  },
});

export const {
  setData,
  setLoading,
  setError,
  setFilterName,
  deleteUser,
} = userSlice.actions;

export default userSlice.reducer;
