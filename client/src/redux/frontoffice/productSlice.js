import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import createAxiosInstance from "../../utils/axiosConfig";
const axiosInstance = createAxiosInstance("customer");

export const getProducts = createAsyncThunk(
  "products/getProducts",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/products", { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch products",
      );
    }
  },
);

export const getProductDetails = createAsyncThunk(
  "products/getProductDetails",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/products/${id}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  },
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    product: {},
    products: [],
    loading: false,
    error: null,
    total: 0,
    page: 1,
    limit: 10,
    maxPrice: 10000,
  },
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getProducts.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getProducts.fulfilled, (state, action) => {
      state.loading = false;
      state.products = action.payload.data || [];
      state.total = action.payload.total || 0;
      state.page = action.payload.page || 1;
      state.limit = action.payload.limit || 10;
      state.maxPrice = action.payload.maxPrice || 10000;
    });
    builder.addCase(getProducts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    builder.addCase(getProductDetails.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getProductDetails.fulfilled, (state, action) => {
      state.loading = false;
      state.product = action.payload;
    });
    builder.addCase(getProductDetails.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const { clearErrors } = productSlice.actions;

export default productSlice.reducer;
