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
      const message = error.response?.data?.message || "Checkout failed";
      toast.error(message);
      return rejectWithValue(message);
    }
  },
);

// 2. Get Single Invoice (User/Admin) - GET /invoice/:oId
export const getOrderInvoice = createAsyncThunk(
  "order/getOrderInvoice",
  async (oId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/invoice/${oId}`, {
        withCredentials: true,
      });
      return response.data.invoice;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to load invoice";
      toast.error(message);
      return rejectWithValue(message);
    }
  },
);

// 3. Get Personal Orders (User) - GET /my-orders
export const getMyOrders = createAsyncThunk(
  "order/getMyOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/my-orders`, {
        withCredentials: true,
      });
      return response.data.orders;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to fetch your orders";
      return rejectWithValue(message);
    }
  },
);

// 4. Get All Orders (Admin) - GET /allOrders
export const getAllOrders = createAsyncThunk(
  "order/getAllOrders",
  async ({ status, sort } = {}, { rejectWithValue }) => {
    try {
      const params = {};
      if (status && status !== "all") params.status = status;
      if (sort) params.sort = sort;

      const response = await axios.get(`${API_URL}/allOrders`, {
        params,
        withCredentials: true,
      });
      // Backend returns: { success, counts, totalRevenue, orders }
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Admin: Access Denied";
      return rejectWithValue(message);
    }
  },
);

// 5. Update Order Status (Admin) - PUT /updateOrderStatus/:orderId
export const updateOrderStatus = createAsyncThunk(
  "order/updateOrderStatus",
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_URL}/updateOrderStatus/${orderId}`,
        { status },
        { withCredentials: true },
      );
      toast.success(`Order updated to ${status}`);
      return response.data.order;
    } catch (error) {
      const message = error.response?.data?.message || "Update failed";
      toast.error(message);
      return rejectWithValue(message);
    }
  },
);

// 6. Delete Order (Admin) - DELETE /deleteOrder/:orderId
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
      const message = error.response?.data?.message || "Delete failed";
      toast.error(message);
      return rejectWithValue(message);
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
    // Admin specific
    counts: {
      total: 0,
      pending: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    },
    totalRevenue: 0,
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
        // Backend returns: { success: true, counts, totalRevenue, orders }
        state.orders = action.payload.orders || [];
        state.counts = action.payload.counts || {
          total: 0,
          pending: 0,
          processing: 0,
          shipped: 0,
          delivered: 0,
          cancelled: 0,
        };
        state.totalRevenue = action.payload.totalRevenue || 0;
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
        // Also update the counts based on new status
        if (state.counts && action.payload.status) {
          // Recalculate counts based on current orders
          state.counts = {
            total: state.orders.length,
            pending: state.orders.filter((o) => o.status === "Pending").length,
            processing: state.orders.filter((o) => o.status === "Processing")
              .length,
            shipped: state.orders.filter((o) => o.status === "Shipped").length,
            delivered: state.orders.filter((o) => o.status === "Delivered")
              .length,
            cancelled: state.orders.filter((o) => o.status === "Cancelled")
              .length,
          };
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
        // Recalculate counts
        state.counts = {
          total: state.orders.length,
          pending: state.orders.filter((o) => o.status === "Pending").length,
          processing: state.orders.filter((o) => o.status === "Processing")
            .length,
          shipped: state.orders.filter((o) => o.status === "Shipped").length,
          delivered: state.orders.filter((o) => o.status === "Delivered")
            .length,
          cancelled: state.orders.filter((o) => o.status === "Cancelled")
            .length,
        };
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
