import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { claimCoupon } from "../../store/feature/offerSlice";
import "./HomeOffer.css";

const HomeOffer = () => {
  const dispatch = useDispatch();
  const { availableCoupons, claimedCoupons } = useSelector(
    (state) => state.offer,
  );

  // State to store time calculations for all coupons
  const [timeLeft, setTimeLeft] = useState({});

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const newTimeLeft = {};

      availableCoupons.forEach((coupon) => {
        const expiration = new Date(coupon.expirationDate).getTime();
        const distance = expiration - now;

        if (distance > 0) {
          newTimeLeft[coupon.id] = {
            days: Math.floor(distance / (1000 * 60 * 60 * 24)),
            hours: Math.floor(
              (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
            ),
            minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((distance % (1000 * 60)) / 1000),
            isExpired: false,
          };
        } else {
          // Marking as expired so the UI can hide it
          newTimeLeft[coupon.id] = {
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
            isExpired: true,
          };
        }
      });

      setTimeLeft(newTimeLeft);
    }, 1000);

    return () => clearInterval(timer);
  }, [availableCoupons]);

  const handleClaimCoupon = (couponId) => {
    dispatch(claimCoupon(couponId));
  };

  return (
    <div className="Homeoffer border-2 my-5 w-full md:w-[38.5%] rounded-md border-[#f97316] hover:border-[#10b981] mx-auto relative overflow-hidden">
      <div className="offer-title text-center p-3 bg-[#ffedd5] rounded-t-md font-bold text-[#c2410c] text-md uppercase tracking-wide">
        Latest Super Discount Active Coupon Codes
      </div>

      <div className="bg-[#ffffff] text-[#333] p-4 mx-auto w-full flex flex-col gap-4">
        {availableCoupons.map((coupon) => {
          const isClaimed = claimedCoupons.some((c) => c.id === coupon.id);
          const timer = timeLeft[coupon.id];

          // Logic: Only render if the coupon is active, not claimed, and hasn't expired yet
          if (!coupon.isActive || isClaimed || (timer && timer.isExpired)) {
            return null;
          }

          return (
            <div
              key={coupon.id}
              className="bg-gradient-to-r from-[#10b981] to-[#16a34a] text-white rounded-lg py-4 px-4 shadow-lg flex flex-col md:flex-row justify-between items-center w-full relative transition-all duration-300"
            >
              {/* Left Side: Coupon Info */}
              <div className="flex flex-col items-center md:items-start mb-4 md:mb-0 w-full md:w-[45%] text-center md:text-left">
                <h3 className="text-lg font-bold mb-1 tracking-tight">
                  {coupon.name}
                </h3>
                <p className="mb-1 text-sm font-medium text-white/90">
                  {coupon.description}
                </p>
                <div className="flex gap-2 items-center mt-2">
                  <span className="bg-white/20 border border-white/30 text-white rounded-full px-2 py-0.5 text-[10px] font-bold uppercase">
                    {coupon.isActive ? "Active" : "Inactive"}
                  </span>
                  <p className="text-[10px] text-[#ffedd5] font-semibold italic">
                    Limited time offer!
                  </p>
                </div>
              </div>

              {/* Dotted Divider Line */}
              <div className="hidden md:block border-l-2 border-dotted border-[#ffedd5]/50 mx-2 h-24"></div>

              {/* Right Side: Countdown and Action */}
              <div className="flex flex-col items-center w-full md:w-[50%]">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#ffedd5] mb-2">
                  Expires In:
                </h4>

                <div className="flex justify-center space-x-1 mb-3">
                  {[
                    { val: timer?.days, label: "d" },
                    { val: timer?.hours, label: "h" },
                    { val: timer?.minutes, label: "m" },
                    { val: timer?.seconds, label: "s" },
                  ].map((unit, idx) => (
                    <div key={idx} className="flex flex-col items-center">
                      <span className="bg-white text-[#10b981] rounded-md px-2 py-1 font-bold shadow-md text-sm min-w-[35px] text-center">
                        {unit.val ?? 0}
                        {unit.label}
                      </span>
                    </div>
                  ))}
                </div>

                <button
                  className="bg-[#16a34a] hover:bg-[#059669] text-white border border-white/20 rounded-full px-6 py-2 text-xs font-bold shadow-md transition-all active:scale-95"
                  onClick={() => handleClaimCoupon(coupon.id)}
                >
                  Claim This Coupon!
                </button>
              </div>
            </div>
          );
        })}

        {/* Fallback if no coupons are available */}
        {availableCoupons.every(
          (c) =>
            !c.isActive ||
            claimedCoupons.some((cc) => cc.id === c.id) ||
            timeLeft[c.id]?.isExpired,
        ) && (
          <div className="text-center py-6 text-gray-400 text-sm italic">
            No active coupons available at the moment. Check back later!
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeOffer;
