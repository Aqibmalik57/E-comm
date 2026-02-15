import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  claimCoupon,
  getAllCoupons,
  getMyClaimedCoupons,
  updateCouponStatus,
} from "../../store/feature/offerSlice";
import { IoMdTime, IoIosLock, IoMdCheckmarkCircle } from "react-icons/io";
import { HiTicket } from "react-icons/hi2";
import "./offers.css";
import Veg1 from "../../Assets/Images/vecteezy_a-vibrant-assortment-of-fresh-fruits-and-vegetables-isolated_46822441.png";
import Veg2 from "../../Assets/Images/vecteezy_vegetable-png-transparent_22984730.png";

const Offers = () => {
  const dispatch = useDispatch();
  const { availableCoupons, claimedCoupons, loading } = useSelector(
    (state) => state.offer,
  );
  const [timeLeft, setTimeLeft] = useState({});
  const [activeTab, setActiveTab] = useState("available"); // "available" or "claimed"

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

  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView();
    }
  }, []);

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
    <div ref={ref} className="overflow-hidden">
      {/* Banner Section */}
      <div className="About-us flex justify-center sm:justify-between items-center h-32 lg:h-44 bg-[#fdf2f2] lg:bg-transparent px-4">
        <img src={Veg1} alt="" className="h-20 lg:h-auto sm:block hidden" />
        <h1 className="text-3xl lg:text-5xl font-medium">Mega Offer</h1>
        <img src={Veg2} alt="" className="h-20 lg:h-auto sm:block hidden" />
      </div>

      <div className="voucher-container py-8 lg:py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-8 lg:mb-10 border-l-4 border-indigo-600 pl-4 lg:pl-6">
            <div>
              <h2 className="text-2xl lg:text-3xl font-extrabold text-gray-900 tracking-tight">
                Voucher Center
              </h2>
              <p className="text-sm lg:text-base text-gray-500 font-medium">
                Exclusive rewards curated for you.
              </p>
            </div>
            <HiTicket className="text-4xl lg:text-5xl text-gray-200 hidden sm:block" />
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setActiveTab("available")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === "available"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Available Coupons
            </button>
            <button
              onClick={() => setActiveTab("claimed")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === "claimed"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              My Coupons ({claimedCoupons.length})
            </button>
          </div>

          {/* Available Coupons Tab */}
          {activeTab === "available" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {loading ? (
                <div className="col-span-full text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mx-auto"></div>
                  <p className="text-gray-500 mt-4">Loading coupons...</p>
                </div>
              ) : availableCoupons.length === 0 ? (
                <div className="col-span-full text-center py-12 bg-white rounded-xl">
                  <HiTicket className="mx-auto text-4xl text-gray-300 mb-3" />
                  <p className="text-gray-500">
                    No coupons available at the moment.
                  </p>
                </div>
              ) : (
                availableCoupons.map((coupon) => {
                  const status = timeLeft[coupon._id];
                  const claimed = isCouponClaimed(coupon._id);
                  const isLive = status?.state === "LIVE" && coupon.isActive;

                  return (
                    <div
                      key={coupon._id}
                      className={`premium-ticket flex flex-row items-stretch min-h-[120px] lg:min-h-[140px] ${!isLive ? "ticket-disabled opacity-75" : ""}`}
                    >
                      {/* Left Side: The "Value" */}
                      <div
                        className={`ticket-value w-24 sm:w-32 flex flex-col justify-center items-center shrink-0 ${isLive ? "bg-indigo-600" : "bg-gray-400"}`}
                      >
                        <div className="value-glare"></div>
                        <span className="text-2xl lg:text-3xl font-black text-white leading-none">
                          {coupon.discountPercent}
                          <small className="text-sm lg:text-lg">%</small>
                        </span>
                        <span className="text-[9px] lg:text-[10px] font-bold text-white/80 uppercase tracking-widest mt-1">
                          Discount
                        </span>
                      </div>

                      {/* Middle Side: Info */}
                      <div className="ticket-info flex-grow p-3 lg:p-4 bg-white flex flex-col justify-center">
                        <div className="flex items-center gap-2 mb-1 lg:mb-2">
                          <span
                            className={`status-pill-lite text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${status?.state?.toLowerCase()}`}
                          >
                            {status?.state || "UPCOMING"}
                          </span>
                        </div>
                        <h3 className="text-sm lg:text-base font-bold text-gray-800 line-clamp-1 mb-1 uppercase">
                          {coupon.title}
                        </h3>

                        {isLive && !claimed ? (
                          <div className="flex items-center gap-1.5 text-indigo-600 bg-indigo-50 self-start px-2 py-1 rounded-md text-[10px] lg:text-[11px] font-bold">
                            <IoMdTime className="text-xs lg:text-sm" />
                            <span>
                              {status?.h}H : {status?.m}M : {status?.s}S
                            </span>
                          </div>
                        ) : status?.state === "UPCOMING" && status?.h <= 48 ? (
                          <div className="flex items-center gap-1.5 text-amber-600 bg-amber-50 self-start px-2 py-1 rounded-md text-[10px] lg:text-[11px] font-bold">
                            <IoMdTime className="text-xs lg:text-sm" />
                            <span>
                              Starting in {status?.h}H : {status?.m}M
                            </span>
                          </div>
                        ) : (
                          <p className="text-gray-500 text-[11px] lg:text-xs line-clamp-2">
                            {coupon.description}
                          </p>
                        )}
                      </div>

                      {/* The "Tear" Effect */}
                      <div className="ticket-tear relative w-4 bg-white flex items-center justify-center">
                        <div className="notch top absolute -top-2 left-0 w-full h-4 bg-[#f9fafb] rounded-full"></div>
                        <div className="border-l-2 border-dashed border-gray-200 h-3/4"></div>
                        <div className="notch bottom absolute -bottom-2 left-0 w-full h-4 bg-[#f9fafb] rounded-full"></div>
                      </div>

                      {/* Right Side: Action */}
                      <div className="ticket-action w-20 lg:w-24 bg-white flex items-center justify-center shrink-0 border-l border-gray-50">
                        {isLive && !claimed ? (
                          <button
                            onClick={() => handleClaimCoupon(coupon._id)}
                            className="claim-btn-premium text-[10px] lg:text-xs font-bold bg-indigo-600 text-white px-3 py-2 rounded shadow-sm hover:bg-indigo-700 transition-colors"
                          >
                            CLAIM
                          </button>
                        ) : (
                          <div className="status-badge">
                            {claimed ? (
                              <div className="flex flex-col items-center text-emerald-600">
                                <IoMdCheckmarkCircle className="text-xl lg:text-2xl" />
                                <span className="text-[9px] lg:text-[10px] font-black mt-1">
                                  SAVED
                                </span>
                              </div>
                            ) : (
                              <IoIosLock className="text-gray-300 text-2xl lg:text-3xl" />
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* My Claimed Coupons Tab */}
          {activeTab === "claimed" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {claimedCoupons.length === 0 ? (
                <div className="col-span-full text-center py-12 bg-white rounded-xl">
                  <HiTicket className="mx-auto text-4xl text-gray-300 mb-3" />
                  <p className="text-gray-500">
                    You haven't claimed any coupons yet.
                  </p>
                  <button
                    onClick={() => setActiveTab("available")}
                    className="mt-4 text-indigo-600 hover:text-indigo-700 font-medium"
                  >
                    Browse available coupons
                  </button>
                </div>
              ) : (
                claimedCoupons.map((claimedCoupon) => {
                  const coupon = claimedCoupon.couponId || claimedCoupon;
                  return (
                    <div
                      key={claimedCoupon._id || coupon._id}
                      className="premium-ticket flex flex-row items-stretch min-h-[120px] lg:min-h-[140px]"
                    >
                      {/* Left Side: The "Value" */}
                      <div className="ticket-value w-24 sm:w-32 flex flex-col justify-center items-center shrink-0 bg-emerald-600">
                        <div className="value-glare"></div>
                        <span className="text-2xl lg:text-3xl font-black text-white leading-none">
                          {coupon.discountPercent ||
                            claimedCoupon.discountPercent}
                          <small className="text-sm lg:text-lg">%</small>
                        </span>
                        <span className="text-[9px] lg:text-[10px] font-bold text-white/80 uppercase tracking-widest mt-1">
                          Discount
                        </span>
                      </div>

                      {/* Middle Side: Info */}
                      <div className="ticket-info flex-grow p-3 lg:p-4 bg-white flex flex-col justify-center">
                        <div className="flex items-center gap-2 mb-1 lg:mb-2">
                          <span className="status-pill-lite text-[9px] px-2 py-0.5 rounded-full font-bold uppercase bg-emerald-100 text-emerald-600">
                            CLAIMED
                          </span>
                        </div>
                        <h3 className="text-sm lg:text-base font-bold text-gray-800 line-clamp-1 mb-1 uppercase">
                          {coupon.title || claimedCoupon.title}
                        </h3>
                        <p className="text-gray-500 text-[11px] lg:text-xs line-clamp-2">
                          {coupon.description || claimedCoupon.description}
                        </p>
                        <p className="text-[10px] text-gray-400 mt-2">
                          Claimed on:{" "}
                          {new Date(
                            claimedCoupon.claimedAt || Date.now(),
                          ).toLocaleDateString()}
                        </p>
                      </div>

                      {/* The "Tear" Effect */}
                      <div className="ticket-tear relative w-4 bg-white flex items-center justify-center">
                        <div className="notch top absolute -top-2 left-0 w-full h-4 bg-[#f9fafb] rounded-full"></div>
                        <div className="border-l-2 border-dashed border-gray-200 h-3/4"></div>
                        <div className="notch bottom absolute -bottom-2 left-0 w-full h-4 bg-[#f9fafb] rounded-full"></div>
                      </div>

                      {/* Right Side: Action */}
                      <div className="ticket-action w-20 lg:w-24 bg-white flex items-center justify-center shrink-0 border-l border-gray-50">
                        <div className="flex flex-col items-center text-emerald-600">
                          <IoMdCheckmarkCircle className="text-xl lg:text-2xl" />
                          <span className="text-[9px] lg:text-[10px] font-black mt-1">
                            READY
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Offers;
