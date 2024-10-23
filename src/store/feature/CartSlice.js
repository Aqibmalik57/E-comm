import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = '/api/v2';

// Async thunk to fetch cart data
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:5000${API_URL}/cart/${userId}`
      );
      return response.data.cart; // Assuming response.data.cart contains the cart items
    } catch (error) {
      toast.error(error.response.data.message || 'Failed to fetch cart data');
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for adding an item to the cart
export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ userId, productId, quantity }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `http://localhost:5000${API_URL}/add-to-cart`,
        { userId, productId, quantity }
      );
      toast.success('Item added to cart successfully');
      return response.data.cart;
    } catch (error) {
      toast.error(error.response.data.message || 'Failed to add to cart');
      return rejectWithValue(error.response.data);
    }
  }
);

// Create the cart slice
const cartSlice = createSlice({
  name: 'cart',
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
        state.items = action.payload.items;
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
      .addCase(addToCart.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.loading = false;
        state.error = null;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export default cartSlice.reducer;
