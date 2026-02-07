import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import createAxiosInstance from "../../../utils/axiosConfig";
import { toast } from "react-toastify";

const axiosInstance = createAxiosInstance("admin");

export const fetchLocalizations = createAsyncThunk(
  "localization/fetchLocalizations",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get("/localization");
      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch translations",
      );
    }
  },
);

export const upsertLocalization = createAsyncThunk(
  "localization/upsertLocalization",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.put("/localization", formData);
      toast.success(data.message || "Translation saved successfully!");
      return data.data;
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to save translation",
      );
      return rejectWithValue(
        error.response?.data?.message || "Failed to save translation",
      );
    }
  },
);

export const deleteLocalization = createAsyncThunk(
  "localization/deleteLocalization",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/localization/${id}`);
      toast.success("Translation deleted successfully!");
      return id;
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to delete translation",
      );
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete translation",
      );
    }
  },
);

const localizationSlice = createSlice({
  name: "localization",
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchLocalizations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLocalizations.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchLocalizations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Upsert
      .addCase(upsertLocalization.fulfilled, (state, action) => {
        const index = state.data.findIndex(
          (item) => item.key === action.payload.key,
        );
        if (index !== -1) {
          state.data[index] = action.payload;
        } else {
          state.data.unshift(action.payload);
        }
      })
      // Delete
      .addCase(deleteLocalization.fulfilled, (state, action) => {
        state.data = state.data.filter((item) => item._id !== action.payload);
      });
  },
});

export default localizationSlice.reducer;
