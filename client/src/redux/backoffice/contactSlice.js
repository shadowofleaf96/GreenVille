import { createSlice } from "@reduxjs/toolkit";

const contactSlice = createSlice({
  name: "adminContact",
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
    deleteContact: (state, action) => {
      state.data = state.data.filter(
        (contacts) => !action.payload.includes(contacts._id)
      );
    },
  },
});

export const {
  setData,
  setLoading,
  setError,
  setFilterName,
  deleteContact,
} = contactSlice.actions;

export default contactSlice.reducer;
