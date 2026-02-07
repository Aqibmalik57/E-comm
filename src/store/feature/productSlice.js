import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = process.env.REACT_APP_API_URL;

// create product thunk
export const createProduct = createAsyncThunk(
  "product/createProduct",
  async (info, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/createProduct`, info, {
        withCredentials: true,
      });
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message);
      return rejectWithValue(
        error.response?.data?.message || "An unknown error occurred",
      );
    }
  },
);

// get all products thunk
export const getAllProducts = createAsyncThunk(
  "product/getAllProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/getAllProducts`, {
        withCredentials: true,
      });
      // Optional: success toast for fetching might be annoying, but kept per your original code
      return response.data.products;
    } catch (error) {
      toast.error(error.response?.data?.message);
      return rejectWithValue(
        error.response?.data?.message || "An unknown error occurred",
      );
    }
  },
);

// single product thunk
export const getSingleProduct = createAsyncThunk(
  "product/getSingleProduct",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/singleProduct/${productId}`,
        {
          withCredentials: true,
        },
      );
      return response.data.product;
    } catch (error) {
      toast.error(error.response?.data?.message);
      return rejectWithValue(
        error.response?.data?.message || "An unknown error occurred",
      );
    }
  },
);

// product review thunk
export const productReview = createAsyncThunk(
  "product/productReview",
  async ({ productId, text, rating }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/product/review/${productId}`,
        { text, rating },
        { withCredentials: true },
      );
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message);
      return rejectWithValue(
        error.response?.data?.message || "An unknown error occurred",
      );
    }
  },
);

// update product thunk
export const updateProduct = createAsyncThunk(
  "product/updateProduct",
  async ({ productId, updateData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_URL}/update/product/${productId}`,
        updateData,
        {
          withCredentials: true,
        },
      );
      toast.success(response.data.message);
      return response.data.product;
    } catch (error) {
      toast.error(error.response?.data?.message);
      return rejectWithValue(
        error.response?.data?.message || "An unknown error occurred",
      );
    }
  },
);

// delete product thunk
export const deleteProduct = createAsyncThunk(
  "product/deleteProduct",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${API_URL}/delete/product/${productId}`,
        {
          withCredentials: true,
        },
      );
      toast.success(response.data.message);
      return productId;
    } catch (error) {
      toast.error(error.response?.data?.message);
      return rejectWithValue(
        error.response?.data?.message || "An unknown error occurred",
      );
    }
  },
);

// delete product review by user thunk
export const deleteProductReview = createAsyncThunk(
  "product/deleteProductReview",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${API_URL}/review/delete/${productId}`,
        {
          withCredentials: true,
        },
      );
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message);
      return rejectWithValue(
        error.response?.data?.message || "An unknown error occurred",
      );
    }
  },
);

// delete product review (Admin or specific path) thunk
export const deleteReview = createAsyncThunk(
  "product/deleteReview",
  async ({ reviewId, productId }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${API_URL}/review/delete/${productId}/${reviewId}`,
        { withCredentials: true },
      );
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message);
      return rejectWithValue(
        error.response?.data?.message || "An unknown error occurred",
      );
    }
  },
);

const initialState = {
  product: null,
  error: null,
  loading: false,
  products: [],
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    clearProductErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // create product
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload.product;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // get all products
      .addCase(getAllProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(getAllProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // get single product
      .addCase(getSingleProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(getSingleProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
      })
      .addCase(getSingleProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // product review
      .addCase(productReview.pending, (state) => {
        state.loading = true;
      })
      .addCase(productReview.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload.product || state.product;
      })
      .addCase(productReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // delete product review by user cases
      .addCase(deleteProductReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProductReview.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
        state.error = null;
      })
      .addCase(deleteProductReview.rejected, (state, action) => {
        state.loading = false;
        state.product = null;
        state.error = action.payload;
      })
      // update product
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // delete product
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.filter(
          (product) => product._id !== action.payload,
        );
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // delete review cases
      .addCase(deleteReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
        state.error = null;
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.loading = false;
        state.product = null;
        state.error = action.payload;
      });
  },
});

export const { clearProductErrors } = productSlice.actions;
export default productSlice.reducer;
