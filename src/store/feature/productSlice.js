import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

// create product thunk
export const createProduct = createAsyncThunk(
  "product/createProduct",
  async (info, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/v2/createProduct",
        info,
        { withCredentials: true }
      );
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message);
      return rejectWithValue(
        error.response?.data?.message || "An unknown error occurred"
      );
    }
  }
);

// get all products thunk
export const getAllProducts = createAsyncThunk(
  "product/getAllProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/v2/getAllProducts",
        { withCredentials: true }
      );
      toast.success(response.data.message);
      return response.data.products;
    } catch (error) {
      toast.error(error.response?.data?.message);
      return rejectWithValue(
        error.response?.data?.message || "An unknown error occurred"
      );
    }
  }
);

// single product thunk
export const getSingleProduct = createAsyncThunk(
  "product/getSingleProduct",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/v2/singleproduct/${productId}`,
        { withCredentials: true }
      );
      toast.success(response.data.message);
      return response.data.product;
    } catch (error) {
      toast.error(error.response?.data?.message);
      return rejectWithValue(
        error.response?.data?.message || "An unknown error occurred"
      );
    }
  }
);

// product review thunk
export const productReview = createAsyncThunk(
  "product/productReview",
  async ({ productId, review }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/v2/Product/Review/${productId}`,
        { review },
        { withCredentials: true }
      );
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message);
      return rejectWithValue(
        error.response?.data?.message || "An unknown error occurred"
      );
    }
  }
);

// delete product review by user thunk
export const deleteProductReview = createAsyncThunk(
  "product/deleteProductReview",
  async (reviewId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/v2/review/delete/${reviewId}`,
        { withCredentials: true }
      );
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message);
      return rejectWithValue(
        error.response?.data?.message || "An unknown error occurred"
      );
    }
  }
);

// delete product review thunk
export const deleteReview = createAsyncThunk(
  "product/deleteReview",
  async (reviewId, productId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/v2/review/delete/${productId}/${reviewId}`,
        { withCredentials: true }
      );
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message);
      return rejectWithValue(
        error.response?.data?.message || "An unknown error occurred"
      );
    }
  }
);

const initialState = {
  product: null,
  isLoggedIn: false,
  error: null,
  loading: false,
  products: null,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    // deleteProduct: (state, action) => {
    //   const index = state.product.reviews.findIndex(
    //     (review) => review._id === action.payload
    //   );
    //   if (index!== -1) {
    //     state.product.reviews.splice(index, 1);
    //   }
    // },
  },
  extraReducers: (builder) => {
    builder
      // create product cases
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
        state.error = null;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.product = null;
        state.error = action.payload;
      })
      // get all products cases
      .addCase(getAllProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
        state.error = null;
      })
      .addCase(getAllProducts.rejected, (state, action) => {
        state.loading = false;
        state.products = null;
        state.error = action.payload;
      })
      // get single product cases
      .addCase(getSingleProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSingleProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
        state.error = null;
      })
      .addCase(getSingleProduct.rejected, (state, action) => {
        state.loading = false;
        state.product = null;
        state.error = action.payload;
      })
      // product review cases
      .addCase(productReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(productReview.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
        state.error = null;
      })
      .addCase(productReview.rejected, (state, action) => {
        state.loading = false;
        state.product = null;
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

// export const { deleteProduct } = productSlice.actions;
export default productSlice.reducer;
