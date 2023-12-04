import { createSlice } from "@reduxjs/toolkit";

const languageSlice = createSlice({
  name: "language",
  initialState: {
    language: "en"
  },
  reducers: {
    setLanguage: (state, action) => {
      state.language = action.payload;
    },
    setLanguageaIcon: (state, action) => {
      state.icon = action.payload;
    }
  },
});

export const { setLanguage, setLanguageaIcon } = languageSlice.actions;
export default languageSlice.reducer;

