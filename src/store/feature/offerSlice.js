import { createSlice } from "@reduxjs/toolkit";

const getAvailableCoupons = () => {
  const newCoupons = [
    {
      id: "flash_sale_01",
      name: "Midnight Flash Deal",
      discountType: "percentage",
      discountValue: 40,
      description: "Massive 40% off for night owls!",
      startDate: new Date(Date.now()).toISOString(),
      expirationDate: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
      isActive: true,
    },
    {
      id: "weekend_bonanza",
      name: "Weekend Bonanza",
      discountType: "fixed",
      discountValue: 50,
      description: "Get $50 off on high-end electronics.",
      startDate: new Date(Date.now()).toISOString(),
      expirationDate: new Date(
        Date.now() + 2 * 24 * 60 * 60 * 1000,
      ).toISOString(),
      isActive: true,
    },
    {
      id: "upcoming_mega",
      name: "Upcoming Mega Deal",
      discountType: "percentage",
      discountValue: 70,
      description: "This deal is locked! It activates in 1 hour.",
      startDate: new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString(),
      expirationDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      isActive: false,
    },
    {
      id: "holiday_15",
      name: "Holiday Special",
      discountType: "percentage",
      discountValue: 15,
      description: "Get 15% off on all festive items.",
      startDate: new Date(Date.now()).toISOString(),
      expirationDate: new Date(
        Date.now() + 10 * 24 * 60 * 60 * 1000,
      ).toISOString(),
      isActive: true,
    },
    {
      id: "black_friday_retro",
      name: "Black Friday Offer",
      discountType: "percentage",
      discountValue: 30,
      description: "This offer has unfortunately ended.",
      startDate: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      expirationDate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      isActive: false,
    },
    {
      id: "new_year_25",
      name: "New Year Promo",
      discountType: "percentage",
      discountValue: 25,
      description: "Starts in 2 hours! Get ready.",
      startDate: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
      expirationDate: new Date(
        Date.now() + 20 * 24 * 60 * 60 * 1000,
      ).toISOString(),
      isActive: false,
    },
  ];

  const stored = localStorage.getItem("availableCoupons");
  // Overwrite if count differs to ensure your new 6 coupons show up
  if (!stored || JSON.parse(stored).length !== newCoupons.length) {
    localStorage.setItem("availableCoupons", JSON.stringify(newCoupons));
    return newCoupons;
  }

  return JSON.parse(stored);
};

const initialState = {
  availableCoupons: getAvailableCoupons(),
  claimedCoupons: JSON.parse(localStorage.getItem("claimedCoupons")) || [],
  selectedCoupons: JSON.parse(localStorage.getItem("selectedCoupons")) || [],
};

const offerSlice = createSlice({
  name: "offer",
  initialState,
  reducers: {
    claimCoupon: (state, action) => {
      const couponId = action.payload;
      const coupon = state.availableCoupons.find((c) => c.id === couponId);
      if (coupon && !state.claimedCoupons.some((c) => c.id === couponId)) {
        const claimedCoupon = {
          ...coupon,
          claimDate: new Date().toISOString(),
          // Valid for 3 days after claiming
          expirationDate: new Date(
            Date.now() + 3 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        };
        state.claimedCoupons.push(claimedCoupon);
        localStorage.setItem(
          "claimedCoupons",
          JSON.stringify(state.claimedCoupons),
        );
      }
    },
    updateCouponStatus: (state) => {
      const now = new Date().getTime();
      state.availableCoupons.forEach((coupon) => {
        const start = new Date(coupon.startDate).getTime();
        const end = new Date(coupon.expirationDate).getTime();
        coupon.isActive = now >= start && now <= end;
      });
      localStorage.setItem(
        "availableCoupons",
        JSON.stringify(state.availableCoupons),
      );
    },
    // ADDED BACK FOR YOUR CART COMPONENT
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
  },
});

export const { claimCoupon, updateCouponStatus, selectCoupon, deselectCoupon } =
  offerSlice.actions;

export default offerSlice.reducer;
