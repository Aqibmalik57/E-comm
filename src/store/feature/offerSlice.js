import { createSlice } from "@reduxjs/toolkit";

// Define available coupons
const availableCoupons = [
  {
    id: "coupon1",
    name: "Winter Gift Voucher",
    discountType: "percentage", // 'percentage' or 'fixed'
    discountValue: 20, // 20% off
    description: "Unlock 20% off your next purchase!",
    expirationDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    isActive: true,
    oneTimeUse: false, // Can be used multiple times? For now, false
  },
  {
    id: "coupon2",
    name: "Special Discount Code",
    discountType: "percentage",
    discountValue: 10, // 10% off
    description: "Save 10% on all items storewide.",
    expirationDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000), // 25 days
    isActive: true,
    oneTimeUse: true, // One-time use
  },
];

const initialState = {
  availableCoupons,
  claimedCoupons: JSON.parse(localStorage.getItem("claimedCoupons")) || [],
};

const offerSlice = createSlice({
  name: "offer",
  initialState,
  reducers: {
    claimCoupon: (state, action) => {
      const couponId = action.payload;
      const coupon = state.availableCoupons.find((c) => c.id === couponId);
      if (coupon && !state.claimedCoupons.some((c) => c.id === couponId)) {
        state.claimedCoupons.push(coupon);
        localStorage.setItem(
          "claimedCoupons",
          JSON.stringify(state.claimedCoupons),
        );
      }
    },
    unclaimCoupon: (state, action) => {
      const couponId = action.payload;
      state.claimedCoupons = state.claimedCoupons.filter(
        (c) => c.id !== couponId,
      );
      localStorage.setItem(
        "claimedCoupons",
        JSON.stringify(state.claimedCoupons),
      );
    },
    updateCouponStatus: (state) => {
      const now = new Date();
      state.availableCoupons.forEach((coupon) => {
        if (coupon.expirationDate < now) {
          coupon.isActive = false;
        }
      });
      // Remove expired claimed coupons
      state.claimedCoupons = state.claimedCoupons.filter(
        (coupon) => coupon.isActive,
      );
      localStorage.setItem(
        "claimedCoupons",
        JSON.stringify(state.claimedCoupons),
      );
    },
  },
});

export const { claimCoupon, unclaimCoupon, updateCouponStatus } =
  offerSlice.actions;
export default offerSlice.reducer;
