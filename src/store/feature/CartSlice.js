import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

// Define a thunk for fetching the cart
export const fetchCartItems = createAsyncThunk(
  "cart/fetchCartItems",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/v2/cart/${userId}`,
        {
          withCredentials: true,
        }
      );
      return response.data.cart; // Return cart data
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Failed to fetch cart items. Please try again.";
      return rejectWithValue(message);
    }
  }
);

// Define a thunk for adding an item to the cart
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ userId, productId, quantity }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/v2/cart/add",
        { userId, productId, quantity },
        { withCredentials: true }
      );
      return response.data.cart; // Return updated cart
    } catch (error) {
      toast.error(error.response?.data?.message);
      const message =
        error.response?.data?.message ||
        "Failed to add to cart. Please try again.";
      return rejectWithValue(message);
    }
  }
);

// Define a thunk for updating an item in the cart
export const updateCartItem = createAsyncThunk(
  "cart/updateCartItem",
  async ({ userId, productId, quantity }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        "http://localhost:5000/api/v2/cart/update",
        { userId, productId, quantity },
        { withCredentials: true }
      );
      return response.data.cart; // Return updated cart
    } catch (error) {
      toast.error(error.response?.data?.message);
      const message =
        error.response?.data?.message ||
        "Failed to update cart item. Please try again.";
      return rejectWithValue(message);
    }
  }
);

// Define a thunk for removing an item from the cart
export const removeFromCartAPI = createAsyncThunk(
  "cart/removeFromCart",
  async ({ userId, productId }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/v2/cart/remove/${userId}/${productId}`,
        {
          withCredentials: true,
        }
      );
      return productId; // Return product ID to remove from state
    } catch (error) {
      toast.error(error.response?.data?.message);
      const message =
        error.response?.data?.message ||
        "Failed to remove item from cart. Please try again.";
      return rejectWithValue(message);
    }
  }
);

// Define a thunk for clearing the cart
export const clearCartAPI = createAsyncThunk(
  "cart/clearCart",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/v2/cart/clear/${userId}`,
        {
          withCredentials: true,
        }
      );
      return response.data.cart; // Return cleared cart
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Failed to clear the cart. Please try again.";
      return rejectWithValue(message);
    }
  }
);

// Create the cart slice
const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCartItems.pending, (state) => {
        state.loading = true; // Set loading state
        state.error = null; // Clear previous error
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.loading = false; // Reset loading state
        state.items = action.payload.items || action.payload; // Set fetched items
      })
      .addCase(fetchCartItems.rejected, (state, action) => {
        state.loading = false; // Reset loading state
        state.error = action.payload; // Set error message
      })
      .addCase(addToCart.pending, (state) => {
        state.loading = true; // Set loading state
        state.error = null; // Clear previous error
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false; // Reset loading state
        state.items = action.payload.items || action.payload; // Set updated items
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false; // Reset loading state
        state.error = action.payload; // Set error message
      })
      .addCase(updateCartItem.pending, (state) => {
        state.loading = true; // Set loading state
        state.error = null; // Clear previous error
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.loading = false; // Reset loading state
        state.items = action.payload.items || action.payload; // Set updated items
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.loading = false; // Reset loading state
        state.error = action.payload; // Set error message
      })
      .addCase(removeFromCartAPI.pending, (state) => {
        state.loading = true; // Set loading state
        state.error = null; // Clear previous error
      })
      .addCase(removeFromCartAPI.fulfilled, (state, action) => {
        state.loading = false; // Reset loading state
        state.items = state.items.filter(
          (item) => item.product._id !== action.payload
        ); // Remove item by ID
      })
      .addCase(removeFromCartAPI.rejected, (state, action) => {
        state.loading = false; // Reset loading state
        state.error = action.payload; // Set error message
      })
      .addCase(clearCartAPI.pending, (state) => {
        state.loading = true; // Set loading state
        state.error = null; // Clear previous error
      })
      .addCase(clearCartAPI.fulfilled, (state, action) => {
        state.loading = false; // Reset loading state
        state.items = []; // Clear cart items
      })
      .addCase(clearCartAPI.rejected, (state, action) => {
        state.loading = false; // Reset loading state
        state.error = action.payload; // Set error message
      });
  },
});

// Export actions and reducer
export default cartSlice.reducer;
