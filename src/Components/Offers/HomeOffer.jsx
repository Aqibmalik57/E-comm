import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { claimCoupon } from "../../store/feature/offerSlice";
import "./HomeOffer.css";

const HomeOffer = () => {
  const dispatch = useDispatch();
  const { availableCoupons, claimedCoupons } = useSelector(
    (state) => state.offer,
  );

  // State for countdown timers
  const [timeLeft, setTimeLeft] = useState({});

  // Get coupons from Redux
  const coupon1 = availableCoupons.find((c) => c.id === "coupon1");
  const coupon2 = availableCoupons.find((c) => c.id === "coupon2");
  const isCoupon1Claimed = claimedCoupons.some((c) => c.id === "coupon1");
  const isCoupon2Claimed = claimedCoupons.some((c) => c.id === "coupon2");

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const newTimeLeft = {};

      if (coupon1) {
        const distance1 = new Date(coupon1.expirationDate) - now;
        if (distance1 > 0) {
          newTimeLeft.coupon1 = {
            days: Math.floor(distance1 / (1000 * 60 * 60 * 24)),
            hours: Math.floor(
              (distance1 % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
            ),
            minutes: Math.floor((distance1 % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((distance1 % (1000 * 60)) / 1000),
          };
        } else {
          newTimeLeft.coupon1 = { days: 0, hours: 0, minutes: 0, seconds: 0 };
        }
      }

      if (coupon2) {
        const distance2 = new Date(coupon2.expirationDate) - now;
        if (distance2 > 0) {
          newTimeLeft.coupon2 = {
            days: Math.floor(distance2 / (1000 * 60 * 60 * 24)),
            hours: Math.floor(
              (distance2 % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
            ),
            minutes: Math.floor((distance2 % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((distance2 % (1000 * 60)) / 1000),
          };
        } else {
          newTimeLeft.coupon2 = { days: 0, hours: 0, minutes: 0, seconds: 0 };
        }
      }

      setTimeLeft(newTimeLeft);
    }, 1000);

    return () => clearInterval(timer);
  }, [coupon1, coupon2]);

  const handleClaimCoupon = (couponId) => {
    dispatch(claimCoupon(couponId));
  };

  // New console logs to check if everything is working as expected
  // useEffect(() => {
  //   console.log('Current Date:', new Date());
  //   console.log('Coupon 1 Expiration Date:', coupon1.expirationDate);
  //   console.log('Coupon 2 Expiration Date:', coupon2.expirationDate);
  //   console.log('Coupon 1 Active:', coupon1.isActive);
  //   console.log('Coupon 2 Active:', coupon2.isActive);
  //   console.log('Coupon 1 Activation Delay:', coupon1.activationDelay);
  //   console.log('Coupon 2 Activation Delay:', coupon2.activationDelay);
  // }, [coupon1, coupon2]);

  return (
    <div className="Homeoffer border-2 my-5 w-[38.5%] rounded-md border-[#f97316] hover:border-[#10b981] m-h-auto relative">
      <div className="offer-title text-center p-3 bg-[#ffedd5] rounded-t-md font-medium text-md">
        Latest Super Discount Active Coupon Codes
      </div>
      <div className="bg-[#ffffff] text-[#333] rounded-xl shadow-xl p-4 mx-auto transition-transform duration-500 ease-in-out w-full">
        {/* First Coupon */}
        {coupon1 && coupon1.isActive && !isCoupon1Claimed && (
          <div className="bg-gradient-to-r from-[#10b981] to-[#16a34a] text-white rounded-lg py-4 px-4 shadow-lg flex flex-col md:flex-row justify-between items-center w-full relative">
            <div className="flex flex-col items-center mb-4 md:mb-0 w-[43.5%]">
              <h3 className="text-lg font-bold mb-1 tracking-tight text-start">
                {coupon1.name}
              </h3>
              <p className="mb-1 text-sm font-medium text-white">
                {coupon1.description}
              </p>
              <p className="text-xs text-center mt-2 text-[#ffedd5]">
                Limited time offer!
              </p>
              <span className="bg-green-500 text-white rounded-full px-2 py-1 mt-2 text-xs font-bold">
                {coupon1.isActive ? "Active" : "Inactive"}
              </span>
            </div>

            <div className="hidden md:block border-l-2 border-dotted border-[#ffedd5] mx-4 h-[145px]"></div>

            <div className="flex flex-col items-center w-[50%]">
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#ffedd5]">
                Expires In:
              </h4>
              <div className="flex justify-center mt-1 space-x-1 text-lg">
                <span className="bg-white text-[#10b981] rounded-full px-2 py-1 font-bold shadow-md">
                  {timeLeft.coupon1?.days ?? 0}d
                </span>
                <span className="bg-white text-[#10b981] rounded-full px-2 py-1 font-bold shadow-md">
                  {timeLeft.coupon1?.hours ?? 0}h
                </span>
                <span className="bg-white text-[#10b981] rounded-full px-2 py-1 font-bold shadow-md">
                  {timeLeft.coupon1?.minutes ?? 0}m
                </span>
                <span className="bg-white text-[#10b981] rounded-full px-2 py-1 font-bold shadow-md">
                  {timeLeft.coupon1?.seconds ?? 0}s
                </span>
              </div>

              <p className="text-xs text-center mt-2 text-[#ffedd5]">
                Hurry up!
              </p>

              <button
                className="mt-3 bg-[#16a34a] text-white rounded-full px-4 py-2 text-xs font-semibold shadow-lg hover:bg-[#10b981]"
                onClick={() => handleClaimCoupon("coupon1")}
              >
                Claim This Coupon!
              </button>
            </div>
          </div>
        )}

        {/* Second Coupon */}
        {coupon2 && coupon2.isActive && !isCoupon2Claimed && (
          <div className="bg-gradient-to-r from-[#10b981] to-[#16a34a] text-white rounded-lg py-4 px-4 shadow-lg flex flex-col md:flex-row justify-between items-center w-full relative mt-6">
            <div className="flex flex-col items-center mb-4 md:mb-0 w-[43.5%]">
              <h3 className="text-lg font-bold mb-1 tracking-tight text-start">
                {coupon2.name}
              </h3>
              <p className="mb-1 text-sm font-medium text-white">
                {coupon2.description}
              </p>
              <p className="text-xs text-center mt-2 text-[#ffedd5]">
                Limited to one-time use!
              </p>
              <span className="bg-green-500 text-white rounded-full px-2 py-1 mt-2 text-xs font-bold">
                {coupon2.isActive ? "Active" : "Inactive"}
              </span>
            </div>

            <div className="hidden md:block border-l-2 border-dotted border-[#ffedd5] mx-4 h-[145px]"></div>

            <div className="flex flex-col items-center w-[50%]">
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#ffedd5]">
                Expires In:
              </h4>
              <div className="flex justify-center mt-1 space-x-1 text-lg">
                <span className="bg-white text-[#10b981] rounded-full px-2 py-1 font-bold shadow-md">
                  {timeLeft.coupon2?.days ?? 0}d
                </span>
                <span className="bg-white text-[#10b981] rounded-full px-2 py-1 font-bold shadow-md">
                  {timeLeft.coupon2?.hours ?? 0}h
                </span>
                <span className="bg-white text-[#10b981] rounded-full px-2 py-1 font-bold shadow-md">
                  {timeLeft.coupon2?.minutes ?? 0}m
                </span>
                <span className="bg-white text-[#10b981] rounded-full px-2 py-1 font-bold shadow-md">
                  {timeLeft.coupon2?.seconds ?? 0}s
                </span>
              </div>

              <p className="text-xs text-center mt-2 text-[#ffedd5]">
                Hurry up!
              </p>

              <button
                className="mt-3 bg-[#16a34a] text-white rounded-full px-4 py-2 text-xs font-semibold shadow-lg hover:bg-[#10b981]"
                onClick={() => handleClaimCoupon("coupon2")}
              >
                Claim This Coupon!
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeOffer;
