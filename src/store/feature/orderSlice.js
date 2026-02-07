import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = process.env.REACT_APP_API_URL;

// Async thunk for checkout
export const checkoutOrder = createAsyncThunk(
  "order/checkoutOrder",
  async ({ customer, courier }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/checkout`,
        { customer, courier },
        { withCredentials: true },
      );
      toast.success("Order placed successfully");
      return response.data.order;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to checkout");
      return rejectWithValue(
        error.response?.data?.message || "Failed to checkout",
      );
    }
  },
);

// Async thunk for getting order invoice
export const getOrderInvoice = createAsyncThunk(
  "order/getOrderInvoice",
  async (oId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/invoice/${oId}`, {
        withCredentials: true,
      });
      return response.data.invoice;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to get invoice");
      return rejectWithValue(
        error.response?.data?.message || "Failed to get invoice",
      );
    }
  },
);

// Async thunk for getting my orders
export const getMyOrders = createAsyncThunk(
  "order/getMyOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/my-orders`, {
        withCredentials: true,
      });
      return response.data.orders;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to get orders");
      return rejectWithValue(
        error.response?.data?.message || "Failed to get orders",
      );
    }
  },
);

// Create the order slice
const orderSlice = createSlice({
  name: "order",
  initialState: {
    orders: [],
    order: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle checkout
      .addCase(checkoutOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkoutOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
        state.error = null;
      })
      .addCase(checkoutOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Handle get order invoice
      .addCase(getOrderInvoice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrderInvoice.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
        state.error = null;
      })
      .addCase(getOrderInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Handle get my orders
      .addCase(getMyOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
        state.error = null;
      })
      .addCase(getMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default orderSlice.reducer;
