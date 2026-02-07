import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = process.env.REACT_APP_API_URL;

// create category thunk
export const createCategory = createAsyncThunk(
  "category/createCategory",
  async (info, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/create-category`, info, {
        withCredentials: true,
      });
      toast.success(response.data.message);
      return response.data.category;
    } catch (error) {
      toast.error(error.response?.data?.message);
      return rejectWithValue(
        error.response?.data?.message || "An unknown error occurred",
      );
    }
  },
);

// get all categories thunk
export const getAllCategories = createAsyncThunk(
  "category/getAllCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/allCategories`, {
        withCredentials: true,
      });
      return response.data.categories;
    } catch (error) {
      toast.error(error.response?.data?.message);
      return rejectWithValue(
        error.response?.data?.message || "An unknown error occurred",
      );
    }
  },
);

// update category thunk
export const updateCategory = createAsyncThunk(
  "category/updateCategory",
  async ({ categoryId, updateData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_URL}/update-categ/${categoryId}`,
        updateData,
        {
          withCredentials: true,
        },
      );
      toast.success(response.data.message);
      return response.data.category;
    } catch (error) {
      toast.error(error.response?.data?.message);
      return rejectWithValue(
        error.response?.data?.message || "An unknown error occurred",
      );
    }
  },
);

// delete category thunk
export const deleteCategory = createAsyncThunk(
  "category/deleteCategory",
  async (categoryId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${API_URL}/delete-categ/${categoryId}`,
        {
          withCredentials: true,
        },
      );
      toast.success(response.data.message);
      return categoryId;
    } catch (error) {
      toast.error(error.response?.data?.message);
      return rejectWithValue(
        error.response?.data?.message || "An unknown error occurred",
      );
    }
  },
);

const initialState = {
  category: null,
  error: null,
  loading: false,
  categories: [],
};

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    clearCategoryErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // create category
      .addCase(createCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories.push(action.payload);
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // get all categories
      .addCase(getAllCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(getAllCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // update category
      .addCase(updateCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.categories.findIndex(
          (cat) => cat._id === action.payload._id,
        );
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // delete category
      .addCase(deleteCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = state.categories.filter(
          (category) => category._id !== action.payload,
        );
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCategoryErrors } = categorySlice.actions;
export default categorySlice.reducer;
