import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = process.env.REACT_APP_API_URL;

// Async thunk to fetch cart data
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/cart`, {
        withCredentials: true,
      });

      // We return response.data.cart because that's where the items are
      return response.data.cart;
    } catch (error) {
      // If error is 404 (Not Found), it might just mean the cart is empty
      const message =
        error.response?.data?.message || "Failed to fetch cart data";

      // Only show toast if it's a real server error (500), not just an empty cart
      if (error.response?.status !== 404) {
        toast.error(message);
      }

      return rejectWithValue(message);
    }
  },
);

// Async thunk for adding an item to the cart
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/add/cart`,
        {
          productId,
          quantity,
        },
        { withCredentials: true },
      );
      toast.success("Product added to cart");
      return response.data.cart;
    } catch (error) {
      toast.error(error.response.data.message || "Failed to add to cart");
      return rejectWithValue(error.response.data);
    }
  },
);

// Async thunk for increasing item quantity in the cart
export const increaseCartQuantity = createAsyncThunk(
  "cart/increaseCartQuantity",
  async ({ productId }, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.put(
        `${API_URL}/increase-quantity`,
        { productId },
        { withCredentials: true },
      );
      console.log(response.data.cart.items);
      dispatch(fetchCart()); // Re-fetch the cart to ensure full product data
      return response.data.cart.items; // Assuming the response contains the updated cart
    } catch (error) {
      toast.error(error.response.data.message || "Failed to increase quantity");
      return rejectWithValue(error.response.data);
    }
  },
);

// Async thunk for decreasing item quantity in the cart

export const decreaseCartQuantity = createAsyncThunk(
  "cart/decreaseCartQuantity",
  async ({ productId }, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.put(
        `${API_URL}/decrease-quantity`,
        { productId },
        { withCredentials: true },
      );
      dispatch(fetchCart()); // Re-fetch the cart to ensure full product data
      return response.data.cart; // Assuming the response contains the updated cart
    } catch (error) {
      toast.error(error.response.data.message || "Failed to decrease quantity");
      return rejectWithValue(error.response.data);
    }
  },
);

// Thunk to remove product from cart
export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async ({ productId }) => {
    const response = await axios.delete(`${API_URL}/remove-item/${productId}`, {
      withCredentials: true,
    });
    return response.data;
  },
);

// Async thunk for applying coupon to cart
export const applyCouponToCart = createAsyncThunk(
  "cart/applyCouponToCart",
  async ({ couponTitle }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/apply-coupon`,
        { couponTitle },
        { withCredentials: true },
      );
      toast.success(response.data.message);
      return response.data.cart;
    } catch (error) {
      toast.error(error.response.data.message || "Failed to apply coupon");
      return rejectWithValue(error.response.data);
    }
  },
);

// Create the cart slice
const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: {
      items: [],
      subtotal: 0,
      discount: 0,
      total: 0,
      appliedCoupon: null,
    },
    loading: false,
    initialLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle fetch cart success
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.cart = action.payload; // Update the full cart object
        state.loading = false;
        state.initialLoading = false;
        state.error = null;
      })
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.initialLoading = true;
        state.error = null;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
        state.initialLoading = false;
      })
      // Handle add to cart success
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.cart = action.payload; // Update the full cart object
        state.loading = false;
        state.error = null;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      // Handle increase quantity
      .addCase(increaseCartQuantity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(increaseCartQuantity.fulfilled, (state, action) => {
        state.loading = false;
        // Cart will be updated by fetchCart dispatch
      })
      .addCase(increaseCartQuantity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Handle decrease quantity
      .addCase(decreaseCartQuantity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(decreaseCartQuantity.fulfilled, (state, action) => {
        state.loading = false;
        // Cart will be updated by fetchCart dispatch
      })
      .addCase(decreaseCartQuantity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.cart = action.payload.cart; // Update the full cart object
        state.loading = false;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Handle apply coupon
      .addCase(applyCouponToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(applyCouponToCart.fulfilled, (state, action) => {
        state.cart = action.payload; // Update the full cart object
        state.loading = false;
        state.error = null;
      })
      .addCase(applyCouponToCart.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export default cartSlice.reducer;
