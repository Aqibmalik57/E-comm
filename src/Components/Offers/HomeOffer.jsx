import React, { useEffect, useState } from 'react';
import './HomeOffer.css';

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
    expirationDate: getExpirationDate('expirationDate1', 7), // 7 days from now
    timeLeft: {},
    isActive: true,
    activationDelay: false,
    couponClaimed: false,
  });

  const [coupon2, setCoupon2] = useState({
    expirationDate: getExpirationDate('expirationDate2', 25), // 25 days from now
    timeLeft: {},
    isActive: true,
    activationDelay: false,
    couponClaimed: false,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();

      // Update countdown for each coupon
      handleCouponCountdown(now, coupon1, setCoupon1, 'expirationDate1', 7, 15);
      handleCouponCountdown(
        now,
        coupon2,
        setCoupon2,
        'expirationDate2',
        25,
        30
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [coupon1, coupon2]);

  const handleCouponCountdown = (
    now,
    coupon,
    setCoupon,
    storageKey,
    validDays,
    resetDays
  ) => {
    const distance = coupon.expirationDate - now;

    if (distance < 0) {
      // If expired, set activation delay to false and mark the coupon as inactive
      if (!coupon.activationDelay && !coupon.couponClaimed) {
        setCoupon((prev) => ({
          ...prev,
          activationDelay: true, // Start activation delay once expired
          isActive: false,
          timeLeft: { days: 0, hours: 0, minutes: 0, seconds: 0 },
        }));

        // Reset coupon after resetDays period
        setTimeout(() => {
          const newExpirationDate = new Date(
            now.getTime() + resetDays * 24 * 60 * 60 * 1000
          );
          localStorage.setItem(storageKey, newExpirationDate);
          setCoupon((prev) => ({
            ...prev,
            expirationDate: newExpirationDate,
            isActive: true,
            activationDelay: false,
            couponClaimed: false, // Reset coupon claimed status
          }));
        }, resetDays * 24 * 60 * 60 * 1000); // Delay the reset by resetDays
      }
    } else {
      // Calculate the time left for active coupons
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setCoupon((prev) => ({
        ...prev,
        timeLeft: { days, hours, minutes, seconds },
        isActive: true,
        activationDelay: false, // Ensure activation delay is reset when active
      }));
    }

    // Debugging logs to ensure the countdown logic works
    // console.log(`Coupon Expiration Date: ${coupon.expirationDate}`);
    // console.log(
    //   `Time left for coupon: ${coupon.timeLeft.days}d ${coupon.timeLeft.hours}h ${coupon.timeLeft.minutes}m ${coupon.timeLeft.seconds}s`
    // );
    // console.log(`Is Coupon Active: ${coupon.isActive}`);
    // console.log(`Is Activation Delay: ${coupon.activationDelay}`);
  };

  const handleClaimCoupon = (setCoupon) => {
    setCoupon((prev) => ({
      ...prev,
      couponClaimed: true,
    }));
    // Debugging log to confirm the coupon is claimed
    // console.log('Coupon Claimed:', true);
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
    <div className='Homeoffer border-2 my-5 w-[38.5%] rounded-md border-[#f97316] hover:border-[#10b981] m-h-auto relative'>
      <div className='offer-title text-center p-3 bg-[#ffedd5] rounded-t-md font-medium text-md'>
        Latest Super Discount Active Coupon Codes
      </div>
      <div className='bg-[#ffffff] text-[#333] rounded-xl shadow-xl p-4 mx-auto transition-transform duration-500 ease-in-out w-full'>
        {/* First Coupon */}
        {coupon1.isActive && !coupon1.couponClaimed && (
          <div className='bg-gradient-to-r from-[#10b981] to-[#16a34a] text-white rounded-lg py-4 px-4 shadow-lg flex flex-col md:flex-row justify-between items-center w-full relative'>
            <div className='flex flex-col items-center mb-4 md:mb-0 w-[43.5%]'>
              <h3 className='text-lg font-bold mb-1 tracking-tight text-start'>
                Winter Gift Voucher
              </h3>
              <p className='mb-1 text-sm font-medium text-white'>
                Unlock 20% off your next purchase!
              </p>
              <p className='text-xs text-center mt-2 text-[#ffedd5]'>
                Limited time offer!
              </p>
              <span className='bg-green-500 text-white rounded-full px-2 py-1 mt-2 text-xs font-bold'>
                {coupon1.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>

            <div className='hidden md:block border-l-2 border-dotted border-[#ffedd5] mx-4 h-[145px]'></div>

            <div className='flex flex-col items-center w-[50%]'>
              <h4 className='text-xs font-bold uppercase tracking-widest text-[#ffedd5]'>
                Expires In:
              </h4>
              <div className='flex justify-center mt-1 space-x-1 text-lg'>
                <span className='bg-white text-[#10b981] rounded-full px-2 py-1 font-bold shadow-md'>
                  {coupon1.timeLeft.days ?? '0'}d
                </span>
                <span className='bg-white text-[#10b981] rounded-full px-2 py-1 font-bold shadow-md'>
                  {coupon1.timeLeft.hours ?? '0'}h
                </span>
                <span className='bg-white text-[#10b981] rounded-full px-2 py-1 font-bold shadow-md'>
                  {coupon1.timeLeft.minutes ?? '0'}m
                </span>
                <span className='bg-white text-[#10b981] rounded-full px-2 py-1 font-bold shadow-md'>
                  {coupon1.timeLeft.seconds ?? '0'}s
                </span>
              </div>

              <p className='text-xs text-center mt-2 text-[#ffedd5]'>
                Hurry up!
              </p>

              <button
                className='mt-3 bg-[#16a34a] text-white rounded-full px-4 py-2 text-xs font-semibold shadow-lg hover:bg-[#10b981]'
                onClick={() => handleClaimCoupon(setCoupon1)}
              >
                Claim This Coupon!
              </button>
            </div>
          </div>
        )}

        {/* Second Coupon */}
        {coupon2.isActive && !coupon2.couponClaimed && (
          <div className='bg-gradient-to-r from-[#10b981] to-[#16a34a] text-white rounded-lg py-4 px-4 shadow-lg flex flex-col md:flex-row justify-between items-center w-full relative mt-6'>
            <div className='flex flex-col items-center mb-4 md:mb-0 w-[43.5%]'>
              <h3 className='text-lg font-bold mb-1 tracking-tight text-start'>
                Special Discount Code
              </h3>
              <p className='mb-1 text-sm font-medium text-white'>
                Save 10% on all items storewide.
              </p>
              <p className='text-xs text-center mt-2 text-[#ffedd5]'>
                Limited to one-time use!
              </p>
              <span className='bg-green-500 text-white rounded-full px-2 py-1 mt-2 text-xs font-bold'>
                {coupon2.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>

            <div className='hidden md:block border-l-2 border-dotted border-[#ffedd5] mx-4 h-[145px]'></div>

            <div className='flex flex-col items-center w-[50%]'>
              <h4 className='text-xs font-bold uppercase tracking-widest text-[#ffedd5]'>
                Expires In:
              </h4>
              <div className='flex justify-center mt-1 space-x-1 text-lg'>
                <span className='bg-white text-[#10b981] rounded-full px-2 py-1 font-bold shadow-md'>
                  {coupon2.timeLeft.days ?? '0'}d
                </span>
                <span className='bg-white text-[#10b981] rounded-full px-2 py-1 font-bold shadow-md'>
                  {coupon2.timeLeft.hours ?? '0'}h
                </span>
                <span className='bg-white text-[#10b981] rounded-full px-2 py-1 font-bold shadow-md'>
                  {coupon2.timeLeft.minutes ?? '0'}m
                </span>
                <span className='bg-white text-[#10b981] rounded-full px-2 py-1 font-bold shadow-md'>
                  {coupon2.timeLeft.seconds ?? '0'}s
                </span>
              </div>

              <p className='text-xs text-center mt-2 text-[#ffedd5]'>
                Hurry up!
              </p>

              <button
                className='mt-3 bg-[#16a34a] text-white rounded-full px-4 py-2 text-xs font-semibold shadow-lg hover:bg-[#10b981]'
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
