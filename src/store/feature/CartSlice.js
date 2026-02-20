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

      // Backend returns: { success: true, cart: { items: [], subtotal, discount, total, appliedCoupon } }
      return response.data.cart;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to fetch cart data";

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
      toast.error(error.response?.data?.message || "Failed to add to cart");
      return rejectWithValue(error.response?.data);
    }
  },
);

// Async thunk for increasing item quantity in the cart
export const increaseCartQuantity = createAsyncThunk(
  "cart/increaseCartQuantity",
  async ({ productId }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_URL}/increase-quantity`,
        { productId },
        { withCredentials: true },
      );
      // Backend returns the updated cart with items, subtotal, discount, total
      return response.data.cart;
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to increase quantity",
      );
      return rejectWithValue(error.response?.data);
    }
  },
);

// Async thunk for decreasing item quantity in the cart
export const decreaseCartQuantity = createAsyncThunk(
  "cart/decreaseCartQuantity",
  async ({ productId }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_URL}/decrease-quantity`,
        { productId },
        { withCredentials: true },
      );
      // Backend returns the updated cart with items, subtotal, discount, total
      return response.data.cart;
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to decrease quantity",
      );
      return rejectWithValue(error.response?.data);
    }
  },
);

// Thunk to remove product from cart
export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async ({ productId }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${API_URL}/remove-item/${productId}`,
        {
          withCredentials: true,
        },
      );
      return response.data.cart;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to remove item");
      return rejectWithValue(error.response?.data);
    }
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
      toast.error(error.response?.data?.message || "Failed to apply coupon");
      return rejectWithValue(error.response?.data);
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
  reducers: {
    clearCart: (state) => {
      state.cart = {
        items: [],
        subtotal: 0,
        discount: 0,
        total: 0,
        appliedCoupon: null,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fetch cart success
      .addCase(fetchCart.fulfilled, (state, action) => {
        // Backend returns cart with flat product data in items
        // Items structure: { productObjectId, pId, title, price, imageUrl, quantity }
        state.cart = action.payload || {
          items: [],
          subtotal: 0,
          discount: 0,
          total: 0,
          appliedCoupon: null,
        };
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
        state.cart = action.payload;
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
        state.cart = action.payload;
        state.loading = false;
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
        state.cart = action.payload;
        state.loading = false;
      })
      .addCase(decreaseCartQuantity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Handle remove from cart
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.cart = action.payload;
        state.loading = false;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Handle apply coupon
      .addCase(applyCouponToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(applyCouponToCart.fulfilled, (state, action) => {
        state.cart = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(applyCouponToCart.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
