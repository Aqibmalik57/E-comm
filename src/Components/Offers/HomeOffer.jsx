import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  claimCoupon,
  getAllCoupons,
  getMyClaimedCoupons,
  updateCouponStatus,
} from "../../store/feature/offerSlice";
import "./HomeOffer.css";

const HomeOffer = () => {
  const dispatch = useDispatch();
  const { availableCoupons, claimedCoupons } = useSelector(
    (state) => state.offer,
  );
  const [timeLeft, setTimeLeft] = useState({});

  // Load coupons and claimed coupons on mount
  useEffect(() => {
    dispatch(getAllCoupons());
    dispatch(getMyClaimedCoupons());
  }, [dispatch]);

  useEffect(() => {
    const timer = setInterval(() => {
      dispatch(updateCouponStatus());
      const now = new Date().getTime();
      const newTimeLeft = {};

      availableCoupons.forEach((coupon) => {
        const start = new Date(coupon.startDate).getTime();
        const end = new Date(coupon.expireDate).getTime();

        if (now < start) {
          const diff = start - now;
          newTimeLeft[coupon._id] = {
            label: "Starts in",
            h: Math.floor(diff / 3600000),
            m: Math.floor((diff % 3600000) / 60000),
            s: Math.floor((diff % 60000) / 1000),
            state: "UPCOMING",
          };
        } else if (now <= end) {
          const diff = end - now;
          newTimeLeft[coupon._id] = {
            label: "Ends in",
            h: Math.floor(diff / 3600000),
            m: Math.floor((diff % 3600000) / 60000),
            s: Math.floor((diff % 60000) / 1000),
            state: "LIVE",
          };
        } else {
          newTimeLeft[coupon._id] = { state: "EXPIRED" };
        }
      });
      setTimeLeft(newTimeLeft);
    }, 1000);
    return () => clearInterval(timer);
  }, [availableCoupons, dispatch]);

  const handleClaimCoupon = async (couponId) => {
    try {
      await dispatch(claimCoupon(couponId)).unwrap();
      // Refresh claimed coupons after successful claim
      dispatch(getMyClaimedCoupons());
    } catch (error) {
      // Error is already handled in the thunk with toast
    }
  };

  const isCouponClaimed = (couponId) => {
    return claimedCoupons.some(
      (c) => c.couponId?._id === couponId || c.couponId === couponId,
    );
  };

  return (
    <div className="Homeoffer border-2 my-5 w-[99%] lg:w-[37.5%] rounded-xl border-[#6366f1] hover:border-[#8b5cf6] mx-auto lg:mx-0 relative overflow-hidden transition-all duration-300 shadow-lg">
      <div className="offer-title text-center p-3 bg-[#f5f3ff] font-black text-[#4338ca] text-xs lg:text-sm uppercase tracking-widest border-b border-[#e0e7ff]">
        ⚡ Flash Sale Coupons
      </div>

      <div className="bg-white p-4 flex flex-col gap-4">
        {availableCoupons.map((coupon) => {
          const status = timeLeft[coupon._id];
          const claimed = isCouponClaimed(coupon._id);
          const isLive = status?.state === "LIVE" && coupon.isActive;

          if (!isLive || claimed || status?.state === "EXPIRED") return null;

          return (
            <div key={coupon._id} className="coupon-ticket-wrapper">
              <div className="coupon-ticket-main">
                <div className="coupon-top-row">
                  <span className="coupon-category">PROMO</span>
                  <span className="coupon-status">
                    <span className="pulse-dot"></span> LIVE
                  </span>
                </div>
                <h3 className="coupon-ticket-title">
                  {coupon.title}{" "}
                  <span className="discount-badge-small">
                    {coupon.discountPercent}% OFF
                  </span>
                </h3>
                <p className="coupon-ticket-desc">{coupon.description}</p>
              </div>

              {/* Corrected Divider Section */}
              <div className="coupon-ticket-divider">
                <div className="scallop top"></div>
                <div className="divider-line-full"></div>
                <div className="scallop bottom"></div>
              </div>

              <div className="coupon-ticket-action">
                <div className="countdown-minimal">
                  <span>{status?.h || 0}h</span>:<span>{status?.m || 0}m</span>:
                  <span>{status?.s || 0}s</span>
                </div>
                <button
                  className="claim-ticket-btn"
                  onClick={() => handleClaimCoupon(coupon._id)}
                >
                  CLAIM
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HomeOffer;
