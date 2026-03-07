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
      toast.success("Order placed successfully!");
      return response.data.order;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to checkout";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
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

// Async thunk for getting all orders (Admin)
export const getAllOrders = createAsyncThunk(
  "order/getAllOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/allOrders`, {
        withCredentials: true,
      });
      return response.data.orders;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to get all orders");
      return rejectWithValue(
        error.response?.data?.message || "Failed to get all orders",
      );
    }
  },
);

// Async thunk for updating order status (Admin)
export const updateOrderStatus = createAsyncThunk(
  "order/updateOrderStatus",
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_URL}/updateOrderStatus/${orderId}`,
        { status },
        { withCredentials: true },
      );
      toast.success(response.data.message);
      return response.data.order;
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update order status",
      );
      return rejectWithValue(
        error.response?.data?.message || "Failed to update order status",
      );
    }
  },
);

// Async thunk for deleting an order (Admin)
export const deleteOrder = createAsyncThunk(
  "order/deleteOrder",
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${API_URL}/deleteOrder/${orderId}`, {
        withCredentials: true,
      });
      toast.success(response.data.message);
      return orderId;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete order");
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete order",
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
    invoice: null,
    loading: false,
    error: null,
    checkoutSuccess: false,
  },
  reducers: {
    clearOrderState: (state) => {
      state.order = null;
      state.invoice = null;
      state.error = null;
      state.checkoutSuccess = false;
    },
    resetCheckoutSuccess: (state) => {
      state.checkoutSuccess = false;
    },
  },
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
        state.invoice = {
          orderNumber: action.payload.oId,
          date: action.payload.createdAt,
          customer: action.payload.customer,
          items: action.payload.items,
          pricing: {
            subtotal: action.payload.subtotal,
            discount: action.payload.discount,
            shipping: action.payload.shippingCost,
            total: action.payload.total,
          },
          status: action.payload.status,
        };
        state.error = null;
        state.checkoutSuccess = true;
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
        state.invoice = action.payload;
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
      })
      // Handle get all orders (Admin)
      .addCase(getAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
        state.error = null;
      })
      .addCase(getAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Handle update order status (Admin)
      .addCase(updateOrderStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.orders.findIndex(
          (order) => order._id === action.payload._id,
        );
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Handle delete order (Admin)
      .addCase(deleteOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = state.orders.filter(
          (order) => order._id !== action.payload,
        );
        state.error = null;
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearOrderState, resetCheckoutSuccess } = orderSlice.actions;
export default orderSlice.reducer;
