import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = process.env.REACT_APP_API_URL;

// create coupon thunk
export const createCoupon = createAsyncThunk(
  "offer/createCoupon",
  async (couponData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/create-coupon`,
        couponData,
        {
          withCredentials: true,
        },
      );
      toast.success(response.data.message);
      return response.data.coupon;
    } catch (error) {
      toast.error(error.response?.data?.message);
      return rejectWithValue(
        error.response?.data?.message || "An unknown error occurred",
      );
    }
  },
);

// get all coupons thunk
export const getAllCoupons = createAsyncThunk(
  "offer/getAllCoupons",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/get-coupons`, {
        withCredentials: true,
      });
      return response.data.coupons;
    } catch (error) {
      toast.error(error.response?.data?.message);
      return rejectWithValue(
        error.response?.data?.message || "An unknown error occurred",
      );
    }
  },
);

// claim coupon thunk
export const claimCoupon = createAsyncThunk(
  "offer/claimCoupon",
  async (couponId, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/claim-coupon/${couponId}`,
        {},
        {
          withCredentials: true,
        },
      );
      toast.success(response.data.message);
      return response.data; // Assuming it returns the claimed coupon or relevant data
    } catch (error) {
      toast.error(error.response?.data?.message);
      return rejectWithValue(
        error.response?.data?.message || "An unknown error occurred",
      );
    }
  },
);

// get my claimed coupons thunk
export const getMyClaimedCoupons = createAsyncThunk(
  "offer/getMyClaimedCoupons",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/my-claimed-coupons`, {
        withCredentials: true,
      });
      return response.data.claimedCoupons;
    } catch (error) {
      toast.error(error.response?.data?.message);
      return rejectWithValue(
        error.response?.data?.message || "An unknown error occurred",
      );
    }
  },
);

const initialState = {
  availableCoupons: [],
  claimedCoupons: [],
  selectedCoupons: JSON.parse(localStorage.getItem("selectedCoupons")) || [],
  loading: false,
  error: null,
};

const offerSlice = createSlice({
  name: "offer",
  initialState,
  reducers: {
    updateCouponStatus: (state) => {
      const now = new Date().getTime();
      state.availableCoupons.forEach((coupon) => {
        const start = new Date(coupon.startDate).getTime();
        const end = new Date(coupon.expireDate).getTime();
        coupon.isActive = now >= start && now <= end;
      });
    },
    selectCoupon: (state, action) => {
      const couponId = action.payload;
      if (!state.selectedCoupons.includes(couponId)) {
        state.selectedCoupons.push(couponId);
        localStorage.setItem(
          "selectedCoupons",
          JSON.stringify(state.selectedCoupons),
        );
      }
    },
    deselectCoupon: (state, action) => {
      const couponId = action.payload;
      state.selectedCoupons = state.selectedCoupons.filter(
        (id) => id !== couponId,
      );
      localStorage.setItem(
        "selectedCoupons",
        JSON.stringify(state.selectedCoupons),
      );
    },
    clearOfferErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // create coupon
      .addCase(createCoupon.pending, (state) => {
        state.loading = true;
      })
      .addCase(createCoupon.fulfilled, (state, action) => {
        state.loading = false;
        state.availableCoupons.push(action.payload);
      })
      .addCase(createCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // get all coupons
      .addCase(getAllCoupons.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllCoupons.fulfilled, (state, action) => {
        state.loading = false;
        state.availableCoupons = action.payload;
      })
      .addCase(getAllCoupons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // claim coupon
      .addCase(claimCoupon.pending, (state) => {
        state.loading = true;
      })
      .addCase(claimCoupon.fulfilled, (state, action) => {
        state.loading = false;
        // Assuming the response includes the claimed coupon details
        // You may need to adjust based on actual API response
        // For now, trigger a refetch or update claimedCoupons
        // Since getMyClaimedCoupons sets claimedCoupons, perhaps dispatch it separately
      })
      .addCase(claimCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // get my claimed coupons
      .addCase(getMyClaimedCoupons.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMyClaimedCoupons.fulfilled, (state, action) => {
        state.loading = false;
        state.claimedCoupons = action.payload;
      })
      .addCase(getMyClaimedCoupons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  updateCouponStatus,
  selectCoupon,
  deselectCoupon,
  clearOfferErrors,
} = offerSlice.actions;

export default offerSlice.reducer;
