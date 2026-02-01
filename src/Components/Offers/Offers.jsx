import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  claimCoupon,
  updateCouponStatus,
} from "../../store/feature/offerSlice";
import { IoMdTime, IoIosLock, IoMdCheckmarkCircle } from "react-icons/io";
import { HiTicket } from "react-icons/hi2";
import "./offers.css";
import Veg1 from "../../Assets/Images/vecteezy_a-vibrant-assortment-of-fresh-fruits-and-vegetables-isolated_46822441.png";
import Veg2 from "../../Assets/Images/vecteezy_vegetable-png-transparent_22984730.png";

const Offers = () => {
  const dispatch = useDispatch();
  const { availableCoupons, claimedCoupons } = useSelector(
    (state) => state.offer,
  );
  const [timeLeft, setTimeLeft] = useState({});

  useEffect(() => {
    const timer = setInterval(() => {
      dispatch(updateCouponStatus());
      const now = new Date().getTime();
      const newTimeLeft = {};

      availableCoupons.forEach((coupon) => {
        const start = new Date(coupon.startDate).getTime();
        const end = new Date(coupon.expirationDate).getTime();

        if (now < start) {
          const diff = start - now;
          newTimeLeft[coupon.id] = {
            label: "Starts in",
            h: Math.floor(diff / 3600000),
            m: Math.floor((diff % 3600000) / 60000),
            s: Math.floor((diff % 60000) / 1000),
            state: "UPCOMING",
          };
        } else if (now <= end) {
          const diff = end - now;
          newTimeLeft[coupon.id] = {
            label: "Ends in",
            h: Math.floor(diff / 3600000),
            m: Math.floor((diff % 3600000) / 60000),
            s: Math.floor((diff % 60000) / 1000),
            state: "LIVE",
          };
        } else {
          newTimeLeft[coupon.id] = { state: "EXPIRED" };
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

  return (
    <div ref={ref}>
      <div className="About-us flex justify-between items-center h-44">
        <img src={Veg1} alt="" />
        <h1 className="text-5xl font-medium">Mega Offer</h1>
        <img src={Veg2} alt="" />
      </div>
      <div className="voucher-container py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-10 border-l-4 border-indigo-600 pl-6">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                Voucher Center
              </h2>
              <p className="text-gray-500 font-medium">
                Exclusive rewards curated for you.
              </p>
            </div>
            <HiTicket className="text-5xl text-gray-100 hidden sm:block" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {availableCoupons.map((coupon) => {
              const status = timeLeft[coupon.id];
              const isClaimed = claimedCoupons.some((c) => c.id === coupon.id);
              const isLive = status?.state === "LIVE" && coupon.isActive;

              return (
                <div
                  key={coupon.id}
                  className={`premium-ticket ${!isLive ? "ticket-disabled" : ""}`}
                >
                  {/* Left Side: The "Value" */}
                  <div
                    className={`ticket-value ${isLive ? "bg-indigo-600" : "bg-gray-400"}`}
                  >
                    <div className="value-glare"></div>
                    <span className="text-3xl font-black text-white leading-none">
                      {coupon.discountValue}
                      <small className="text-lg">
                        {coupon.discountType === "percentage" ? "%" : "$"}
                      </small>
                    </span>
                    <span className="text-[10px] font-bold text-white/80 uppercase tracking-widest mt-1">
                      Discount
                    </span>
                  </div>

                  {/* Middle Side: Info */}
                  <div className="ticket-info">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`status-pill-lite ${status?.state.toLowerCase()}`}
                      >
                        {status?.state}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-gray-800 line-clamp-1 mb-1">
                      {coupon.name}
                    </h3>

                    {isLive && !isClaimed ? (
                      <div className="flex items-center gap-1.5 text-indigo-600 bg-indigo-50 self-start px-2 py-1 rounded-md text-[11px] font-bold">
                        <IoMdTime className="text-sm" />
                        <span>
                          {status?.h}H : {status?.m}M : {status?.s}S
                        </span>
                      </div>
                    ) : (
                      <p className="text-gray-500 text-xs line-clamp-1">
                        {coupon.description}
                      </p>
                    )}
                  </div>

                  {/* The "Tear" Effect */}
                  <div className="ticket-tear">
                    <div className="notch top"></div>
                    <div className="notch bottom"></div>
                  </div>

                  {/* Right Side: Action */}
                  <div className="ticket-action">
                    {isLive && !isClaimed ? (
                      <button
                        onClick={() => dispatch(claimCoupon(coupon.id))}
                        className="claim-btn-premium"
                      >
                        CLAIM
                      </button>
                    ) : (
                      <div className="status-badge">
                        {isClaimed ? (
                          <div className="flex flex-col items-center text-emerald-600">
                            <IoMdCheckmarkCircle className="text-xl" />
                            <span className="text-[10px] font-black mt-1">
                              SAVED
                            </span>
                          </div>
                        ) : (
                          <IoIosLock className="text-gray-300 text-2xl" />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Offers;
