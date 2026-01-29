import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = "/api/v2";

// Async thunk to fetch cart data
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:5000${API_URL}/cart/${userId}`,
      );
      return response.data.cart; // Assuming response.data.cart contains the cart items
    } catch (error) {
      toast.error(error.response.data.message || "Failed to fetch cart data");
      return rejectWithValue(error.response.data);
    }
  },
);

// Async thunk for adding an item to the cart
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ userId, productId, quantity }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `http://localhost:5000${API_URL}/add-to-cart`,
        { userId, productId, quantity },
      );
      toast.success("Item added to cart successfully");
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
  async ({ userId, productId }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `http://localhost:5000${API_URL}/increase-quantity`,
        { userId, productId },
        { withCredentials: true },
      );
      console.log(response.data.cart.items);
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
  async ({ userId, productId }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `http://localhost:5000${API_URL}/decrease-quantity`,
        { userId, productId },
        { withCredentials: true },
      );
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
  async ({ userId, productId }) => {
    const response = await axios.delete(
      `http://localhost:5000${API_URL}/remove/${userId}/${productId}`,
    );
    return response.data; // Returns the updated cart
  },
);

// Create the cart slice
const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle fetch cart success
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.items = action.payload?.items || []; // Adjust this according to your response structure
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      // Handle add to cart success
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.items = action.payload?.items || []; // Adjust this according to your response structure
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
        if (action.payload) {
          state.items = action.payload;
        }
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
        state.items = action.payload?.items || []; // Adjust this according to your response structure
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
        state.loading = false;
        state.items = action.payload?.items || []; // Update the items with the new cart
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default cartSlice.reducer;
