import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { claimCoupon } from "../../store/feature/offerSlice";
import "./HomeOffer.css";

const HomeOffer = () => {
  const dispatch = useDispatch();
  const { availableCoupons, claimedCoupons } = useSelector(
    (state) => state.offer,
  );
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
            hours: Math.floor(
              (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
            ),
            minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((distance % (1000 * 60)) / 1000),
            isExpired: false,
          };
        } else {
          newTimeLeft[coupon.id] = { isExpired: true };
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
    <div className="Homeoffer border-2 my-5 w-full md:w-[38.5%] rounded-xl border-[#6366f1] hover:border-[#8b5cf6] mx-auto relative overflow-hidden transition-all duration-300 shadow-lg">
      <div className="offer-title text-center p-3 bg-[#f5f3ff] font-black text-[#4338ca] text-sm uppercase tracking-widest border-b border-[#e0e7ff]">
        ⚡ Flash Sale Coupons
      </div>

      <div className="bg-white p-4 flex flex-col gap-4">
        {availableCoupons.map((coupon) => {
          const isClaimed = claimedCoupons.some((c) => c.id === coupon.id);
          const timer = timeLeft[coupon.id];

          if (!coupon.isActive || isClaimed || (timer && timer.isExpired))
            return null;

          return (
            <div key={coupon.id} className="coupon-ticket-wrapper">
              <div className="coupon-ticket-main">
                <div className="coupon-top-row">
                  <span className="coupon-category">PROMO</span>
                  <span className="coupon-status">
                    <span className="pulse-dot"></span> LIVE
                  </span>
                </div>
                <h3 className="coupon-ticket-title">{coupon.name}</h3>
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
                  <span>{timer?.hours || 0}h</span>:
                  <span>{timer?.minutes || 0}m</span>:
                  <span>{timer?.seconds || 0}s</span>
                </div>
                <button
                  className="claim-ticket-btn"
                  onClick={() => handleClaimCoupon(coupon.id)}
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
