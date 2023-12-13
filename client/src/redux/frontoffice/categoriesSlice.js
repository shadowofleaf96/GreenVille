import { createSlice } from "@reduxjs/toolkit";
import axios from "axios"

const initialState = {
  loading: false,
  categories: [],
  error: null,
};

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    categoriesRequest: (state) => {
      state.loading = true;
      state.categories = [];
      state.error = null;
    },
    categoriesSuccess: (state, action) => {
      state.loading = false;
      state.categories = action.payload.data;
      state.error = null;
    },
    categoriesFail: (state, action) => {
      state.loading = false;
      state.categories = [];
      state.error = action.payload;
    },
    clearErrors: (state) => {
      state.error = null;
    },
  },
});

export const {
  categoriesRequest,
  categoriesSuccess,
  categoriesFail,
  clearErrors,
} = categoriesSlice.actions;

// Get all categories
export const getCategories = (category_Id) => async (dispatch) => {
  dispatch(categoriesRequest());

  try {
    let link = `/v1/categories`;

    if (category_Id) {
      link = `/${category_Id}`;
    }

    const { data } = await axios.get(link);

    dispatch(categoriesSuccess(data));
  } catch (error) {
    dispatch(categoriesFail(error.response.data.message));
  }
};

export default categoriesSlice.reducer;