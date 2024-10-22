import React, { useEffect, useState } from "react";
import "./HomeOffer.css";

const HomeOffer = () => {
  // Helper function to get or set expiration dates in localStorage
  const getExpirationDate = (key, defaultDays) => {
    const savedDate = localStorage.getItem(key);
    if (savedDate) {
      return new Date(savedDate);
    } else {
      const newDate = new Date(Date.now() + defaultDays * 24 * 60 * 60 * 1000);
      localStorage.setItem(key, newDate);
      return newDate;
    }
  };

  // State management for both coupons
  const [coupon1, setCoupon1] = useState({
    expirationDate: getExpirationDate("expirationDate1", 7), // 7 days from now
    timeLeft: {},
    isActive: true,
    activationDelay: false,
    couponClaimed: false,
  });

  const [coupon2, setCoupon2] = useState({
    expirationDate: getExpirationDate("expirationDate2", 25), // 25 days from now
    timeLeft: {},
    isActive: true,
    activationDelay: false,
    couponClaimed: false,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();

      // Handle countdown for the first coupon
      handleCouponCountdown(
        now,
        coupon1.expirationDate,
        setCoupon1,
        7, // Valid for 7 days
        15 // Reset after 15 days
      );

      // Handle countdown for the second coupon
      handleCouponCountdown(
        now,
        coupon2.expirationDate,
        setCoupon2,
        25, // Valid for 25 days
        30 // Reset after 30 days
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [coupon1, coupon2]);

  const handleCouponCountdown = (
    now,
    expirationDate,
    setCoupon,
    validDays,
    resetDays
  ) => {
    const distance = expirationDate - now;

    if (distance < 0) {
      // Coupon expired
      if (!coupon1.activationDelay && setCoupon === setCoupon1) {
        setCoupon((prev) => ({
          ...prev,
          activationDelay: true,
          isActive: false,
        }));

        // Reset coupon after delay period
        setTimeout(() => {
          const newExpirationDate = new Date(
            now.getTime() + resetDays * 24 * 60 * 60 * 1000
          );
          localStorage.setItem("expirationDate1", newExpirationDate); // Save new expiration date to localStorage
          setCoupon((prev) => ({
            ...prev,
            expirationDate: newExpirationDate,
            isActive: true,
            activationDelay: false,
          }));
        }, resetDays * 24 * 60 * 60 * 1000); // Delay for resetDays
      } else if (!coupon2.activationDelay && setCoupon === setCoupon2) {
        setCoupon((prev) => ({
          ...prev,
          activationDelay: true,
          isActive: false,
        }));

        // Reset coupon after delay period
        setTimeout(() => {
          const newExpirationDate = new Date(
            now.getTime() + resetDays * 24 * 60 * 60 * 1000
          );
          localStorage.setItem("expirationDate2", newExpirationDate); // Save new expiration date to localStorage
          setCoupon((prev) => ({
            ...prev,
            expirationDate: newExpirationDate,
            isActive: true,
            activationDelay: false,
          }));
        }, resetDays * 24 * 60 * 60 * 1000); // Delay for resetDays
      }
    } else {
      // Calculate time left
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setCoupon((prev) => ({
        ...prev,
        timeLeft: { days, hours, minutes, seconds },
        isActive: true, // Ensure the coupon is active if there's time left
      }));
    }
  };

  const handleClaimCoupon = (setCoupon) => {
    setCoupon((prev) => ({
      ...prev,
      couponClaimed: true,
    }));
  };

  return (
    <div className="Homeoffer border-2 my-5 w-[38.5%] rounded-md border-[#f97316] hover:border-[#10b981] m-h-auto relative">
      <div className="offer-title text-center p-3 bg-[#ffedd5] rounded-t-md font-medium text-md">
        Latest Super Discount Active Coupon Codes
      </div>
      <div className="bg-[#ffffff] text-[#333] rounded-xl shadow-xl p-4 mx-auto transition-transform duration-500 ease-in-out w-full">
        {/* First Coupon */}
        {coupon1.isActive && !coupon1.couponClaimed && (
          <div className="bg-gradient-to-r from-[#10b981] to-[#16a34a] text-white rounded-lg py-4 px-4 shadow-lg flex flex-col md:flex-row justify-between items-center w-full relative">
            <div className="flex flex-col items-center mb-4 md:mb-0 w-[43.5%]">
              <h3 className="text-lg font-bold mb-1 tracking-tight text-start">
                Winter Gift Voucher
              </h3>
              <p className="mb-1 text-sm font-medium text-white">
                Unlock 20% off your next purchase!
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
                  {coupon1.timeLeft.days !== undefined ? coupon1.timeLeft.days : "0"}d
                </span>
                <span className="bg-white text-[#10b981] rounded-full px-2 py-1 font-bold shadow-md">
                  {coupon1.timeLeft.hours !== undefined ? coupon1.timeLeft.hours : "0"}h
                </span>
                <span className="bg-white text-[#10b981] rounded-full px-2 py-1 font-bold shadow-md">
                  {coupon1.timeLeft.minutes !== undefined ? coupon1.timeLeft.minutes : "0"}m
                </span>
                <span className="bg-white text-[#10b981] rounded-full px-2 py-1 font-bold shadow-md">
                  {coupon1.timeLeft.seconds !== undefined ? coupon1.timeLeft.seconds : "0"}s
                </span>
              </div>

              <p className="text-xs text-center mt-2 text-[#ffedd5]">
                Hurry up!
              </p>

              <button
                className={`mt-3 bg-[#16a34a] text-white rounded-full px-4 py-2 text-xs font-semibold shadow-lg hover:bg-[#10b981]`}
                onClick={() => handleClaimCoupon(setCoupon1)}
              >
                Claim This Coupon!
              </button>
            </div>
          </div>
        )}

        {/* Second Coupon */}
        {coupon2.isActive && !coupon2.couponClaimed && (
          <div className="bg-gradient-to-r from-[#10b981] to-[#16a34a] text-white rounded-lg py-4 px-4 shadow-lg flex flex-col md:flex-row justify-between items-center w-full relative mt-6">
            <div className="flex flex-col items-center mb-4 md:mb-0 w-[43.5%]">
              <h3 className="text-lg font-bold mb-1 tracking-tight text-start">
                Special Discount Code
              </h3>
              <p className="mb-1 text-sm font-medium text-white">
                Save 30% on your next order!
              </p>
              <p className="text-xs text-center mt-2 text-[#ffedd5]">
                Grab it before it expires!
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
                  {coupon2.timeLeft.days !== undefined ? coupon2.timeLeft.days : "0"}d
                </span>
                <span className="bg-white text-[#10b981] rounded-full px-2 py-1 font-bold shadow-md">
                  {coupon2.timeLeft.hours !== undefined ? coupon2.timeLeft.hours : "0"}h
                </span>
                <span className="bg-white text-[#10b981] rounded-full px-2 py-1 font-bold shadow-md">
                  {coupon2.timeLeft.minutes !== undefined ? coupon2.timeLeft.minutes : "0"}m
                </span>
                <span className="bg-white text-[#10b981] rounded-full px-2 py-1 font-bold shadow-md">
                  {coupon2.timeLeft.seconds !== undefined ? coupon2.timeLeft.seconds : "0"}s
                </span>
              </div>

              <p className="text-xs text-center mt-2 text-[#ffedd5]">
                Don't miss out!
              </p>

              <button
                className={`mt-3 bg-[#16a34a] text-white rounded-full px-4 py-2 text-xs font-semibold shadow-lg hover:bg-[#10b981]`}
                onClick={() => handleClaimCoupon(setCoupon2)}
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