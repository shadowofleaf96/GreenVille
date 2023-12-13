import { createSlice } from "@reduxjs/toolkit";
import axios from "axios"

const initialState = {
  loading: false,
  subcategories: [],
  error: null,
};

const subcategoriesSlice = createSlice({
  name: "subcategories",
  initialState,
  reducers: {
    subcategoriesRequest: (state) => {
      state.loading = true;
      state.subcategories = [];
      state.error = null;
    },
    subcategoriesSuccess: (state, action) => {
      state.loading = false;
      state.subcategories = action.payload.data;
      state.error = null;
    },
    subcategoriesFail: (state, action) => {
      state.loading = false;
      state.subcategories = [];
      state.error = action.payload;
    },
    clearErrors: (state) => {
      state.error = null;
    },
  },
});

export const {
  subcategoriesRequest,
  subcategoriesSuccess,
  subcategoriesFail,
  clearErrors,
} = subcategoriesSlice.actions;

// Get all categories
export const getSubcategories = (category_Id) => async (dispatch) => {
  dispatch(subcategoriesRequest());

  try {
    let link = `/v1/subcategories`;

    if (category_Id) {
      link = `/${category_Id}`;
    }

    const { data } = await axios.get(link);

    dispatch(subcategoriesSuccess(data));
  } catch (error) {
    dispatch(subcategoriesFail(error.response.data.message));
  }
};

export default subcategoriesSlice.reducer;