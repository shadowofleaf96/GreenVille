import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import createAxiosInstance from "../../../utils/axiosConfig";
import { toast } from "react-toastify";

const axiosInstance = createAxiosInstance("admin");
export const fetchSettings = createAsyncThunk(
  "settings/fetchSettings",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get("/site-settings");
      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch settings",
      );
    }
  },
);

export const updateSettings = createAsyncThunk(
  "settings/updateSettings",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.put("/site-settings", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Settings updated successfully!");
      return data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update settings");
      return rejectWithValue(
        error.response?.data?.message || "Failed to update settings",
      );
    }
  },
);

const settingsSlice = createSlice({
  name: "settings",
  initialState: {
    data: {
      logo_url: "",
      website_title: { en: "", fr: "", ar: "" },
      home_categories: [],
    },
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update
      .addCase(updateSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(updateSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default settingsSlice.reducer;
