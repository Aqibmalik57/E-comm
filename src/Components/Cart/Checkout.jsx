import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  FaShieldHalved,
  FaCreditCard,
  FaPaypal,
  FaLock,
  FaChevronRight,
  FaPercent,
} from "react-icons/fa6";
import { applyCouponToCart } from "../../store/feature/CartSlice";
import { getMyClaimedCoupons } from "../../store/feature/offerSlice";
import { toast } from "react-toastify";
import { FaTicketAlt, FaTimes } from "react-icons/fa";

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { cart, loading: cartLoading } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);
  const { claimedCoupons } = useSelector((state) => state.offer);

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [showCouponModal, setShowCouponModal] = useState(false);

  const deliveryOptions = {
    standard: { name: "Standard", price: 0, provider: "FedEx" },
    express: { name: "Express", price: 15.0, provider: "DHL" },
    overnight: { name: "Priority", price: 35.0, provider: "UPS" },
  };

  // Load claimed coupons on mount
  useEffect(() => {
    dispatch(getMyClaimedCoupons());
  }, [dispatch]);

  // Set selected coupon from cart if exists
  useEffect(() => {
    if (cart?.appliedCoupon) {
      setSelectedCoupon(cart.appliedCoupon);
    }
  }, [cart?.appliedCoupon]);

  const items = cart?.items || [];
  const subtotal = cart?.subtotal || 0;
  const discount = cart?.discount || 0;

  const handleApplyCoupon = async (coupon) => {
    try {
      await dispatch(applyCouponToCart({ couponTitle: coupon.title })).unwrap();
      setSelectedCoupon(coupon);
      setShowCouponModal(false);
      toast.success(`Coupon "${coupon.title}" applied successfully!`);
    } catch (error) {
      // Error is handled in the thunk
    }
  };

  const handleRemoveCoupon = () => {
    setSelectedCoupon(null);
    toast.info("Coupon removed");
  };

  if (cartLoading && !cart) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="w-10 h-10 border-4 border-teal-500/20 border-t-teal-500 rounded-full animate-spin mb-4" />
        <p className="text-slate-500 animate-pulse text-sm font-medium">
          Loading cart...
        </p>
      </div>
    );
  }

  if (!user || Object.keys(user).length === 0) {
    navigate("/login");
    return null;
  }

  if (!items || items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 gap-4 text-center">
        <div className="bg-slate-100 p-6 rounded-full mb-2">
          <FaLock className="text-4xl text-slate-300" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">Your cart is empty</h2>
        <p className="text-slate-500 max-w-xs">
          Add some items to your cart before proceeding to checkout.
        </p>
        <button
          onClick={() => navigate("/")}
          className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors"
        >
          Go Shopping
        </button>
      </div>
    );
  }

  const shippingCost = deliveryOptions[shippingMethod]?.price || 0;
  const total = Math.max(0, subtotal - discount + shippingCost);

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    const formData = new FormData(e.currentTarget);
    const customerDetails = {
      name: formData.get("fullName") || user?.name,
      email: formData.get("email") || user?.email,
      phone: formData.get("phone"),
      address: `${formData.get("address")}, ${formData.get("city")}, ${formData.get("state")} ${formData.get("zip")}`,
    };

    setTimeout(() => {
      setIsProcessing(false);
      navigate("/Invoice-order-success", {
        state: {
          orderData: {
            items,
            total,
            subtotal,
            shippingCost,
            discount,
            customer: customerDetails,
            orderId:
              "ORD-" + Math.random().toString(36).toUpperCase().substring(2, 9),
            date: new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
          },
        },
      });
    }, 2000);
  };

  const sectionClass =
    "bg-white border border-slate-200 rounded-xl p-4 md:p-6 mb-6 shadow-sm";
  const inputClass =
    "w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all bg-white";
  const labelClass = "text-xs font-semibold text-slate-600 mb-1.5 block";

  if (!items || items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 gap-4 text-center">
        <p className="text-slate-500">Your cart is empty</p>
        <button
          onClick={() => navigate("/")}
          className="bg-slate-900 text-white px-6 py-2 rounded-lg"
        >
          Go Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FBFC] font-sans text-slate-900">
      <header className="bg-white border-b border-slate-200 z-50">
        <div className="max-w-6xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FaLock className="text-teal-600 text-sm" />
            <span className="font-bold text-slate-800 tracking-tight">
              Checkout
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-10">
        <form
          onSubmit={handlePlaceOrder}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10"
        >
          <div className="order-2 lg:order-1 lg:col-span-7">
            {/* 1. Contact */}
            <div className={sectionClass}>
              <h3 className="text-[11px] md:text-sm font-bold uppercase tracking-wider text-slate-400 mb-6 flex items-center gap-2">
                <span className="w-5 h-5 bg-slate-900 text-white rounded-full flex items-center justify-center text-[10px]">
                  1
                </span>
                Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Full Name</label>
                  <input
                    required
                    name="fullName"
                    type="text"
                    defaultValue={user?.name}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Phone Number</label>
                  <input
                    required
                    name="phone"
                    type="tel"
                    className={inputClass}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className={labelClass}>Email Address</label>
                  <input
                    required
                    name="email"
                    type="email"
                    defaultValue={user?.email}
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            {/* 2. Shipping */}
            <div className={sectionClass}>
              <h3 className="text-[11px] md:text-sm font-bold uppercase tracking-wider text-slate-400 mb-6 flex items-center gap-2">
                <span className="w-5 h-5 bg-slate-900 text-white rounded-full flex items-center justify-center text-[10px]">
                  2
                </span>
                Shipping Address
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className={labelClass}>Street Address</label>
                  <input
                    required
                    name="address"
                    type="text"
                    placeholder="123 Main St"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Town / City</label>
                  <input
                    required
                    name="city"
                    type="text"
                    className={inputClass}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>State</label>
                    <input
                      required
                      name="state"
                      type="text"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>ZIP Code</label>
                    <input
                      required
                      name="zip"
                      type="text"
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Delivery */}
            <div className={sectionClass}>
              <h3 className="text-[11px] md:text-sm font-bold uppercase tracking-wider text-slate-400 mb-6 flex items-center gap-2">
                <span className="w-5 h-5 bg-slate-900 text-white rounded-full flex items-center justify-center text-[10px]">
                  3
                </span>
                Delivery Method
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {Object.entries(deliveryOptions).map(([key, opt]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setShippingMethod(key)}
                    className={`p-4 rounded-lg border text-left transition-all flex sm:flex-col justify-between sm:justify-start gap-2 ${shippingMethod === key ? "border-teal-600 bg-teal-50/30" : "border-slate-200 hover:border-slate-300 bg-white"}`}
                  >
                    <div className="flex justify-between items-center w-full">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">
                        {opt.provider}
                      </span>
                      {shippingMethod === key && (
                        <div className="w-2 h-2 bg-teal-600 rounded-full" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">
                        {opt.name}
                      </p>
                      <p className="text-xs font-semibold text-teal-700 mt-1">
                        {opt.price === 0 ? "Free" : `$${opt.price.toFixed(2)}`}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Coupon Section */}
            <div className={sectionClass}>
              <h3 className="text-[11px] md:text-sm font-bold uppercase tracking-wider text-slate-400 mb-6 flex items-center gap-2">
                <span className="w-5 h-5 bg-slate-900 text-white rounded-full flex items-center justify-center text-[10px]">
                  4
                </span>
                Apply Coupon
              </h3>

              {selectedCoupon ? (
                <div className="flex items-center justify-between bg-teal-50 border border-teal-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center">
                      <FaPercent className="text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 uppercase">
                        {selectedCoupon.title}
                      </p>
                      <p className="text-sm text-teal-600">
                        {selectedCoupon.discountPercent}% OFF
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <FaTimes />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowCouponModal(true)}
                  className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 hover:border-teal-500 hover:text-teal-600 transition-all"
                >
                  <FaTicketAlt />
                  <span>Select a coupon</span>
                </button>
              )}
            </div>

            {/* 5. Payment */}
            <div className={sectionClass}>
              <h3 className="text-[11px] md:text-sm font-bold uppercase tracking-wider text-slate-400 mb-6 flex items-center gap-2">
                <span className="w-5 h-5 bg-slate-900 text-white rounded-full flex items-center justify-center text-[10px]">
                  5
                </span>
                Payment
              </h3>

              <div className="flex gap-3 md:gap-4 mb-6">
                <PaymentTab
                  active={paymentMethod === "card"}
                  onClick={() => setPaymentMethod("card")}
                  icon={<FaCreditCard />}
                  label="Card"
                />
                <PaymentTab
                  active={paymentMethod === "paypal"}
                  onClick={() => setPaymentMethod("paypal")}
                  icon={<FaPaypal />}
                  label="PayPal"
                />
              </div>
              {paymentMethod === "card" && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className={labelClass}>Card Number</label>
                    <input
                      type="text"
                      placeholder="0000 0000 0000 0000"
                      className={inputClass}
                    />
                  </div>
                  <div className="col-span-1">
                    <label className={labelClass}>Expiry</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className={inputClass}
                    />
                  </div>
                  <div className="col-span-1">
                    <label className={labelClass}>CVC</label>
                    <input
                      type="text"
                      placeholder="123"
                      className={inputClass}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Summary */}
          <div className="order-1 lg:order-2 lg:col-span-5">
            <div className="bg-white border border-slate-200 rounded-xl p-4 md:p-6 shadow-sm lg:sticky lg:top-24">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-6">
                Order Summary
              </h3>
              <div className="divide-y divide-slate-100 max-h-[300px] lg:max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {items.map((item, idx) => (
                  <div key={idx} className="py-4 flex gap-4 items-center group">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-50 border border-slate-100 rounded-lg p-2 flex-shrink-0 flex items-center justify-center transition-transform group-hover:scale-105">
                      <img
                        src={item.productId?.imageUrl}
                        alt={item.productId?.title}
                        className="max-w-full max-h-full object-contain mix-blend-multiply"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs md:text-sm font-bold text-slate-800 leading-tight mb-1 truncate">
                        {item.productId?.title}
                      </h4>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-medium px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded">
                          Qty: {item.quantity}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          ${(item.productId?.price || 0).toFixed(2)} / unit
                        </span>
                      </div>
                    </div>
                    <div className="text-sm font-black text-slate-900 whitespace-nowrap">
                      $
                      {((item.productId?.price || 0) * item.quantity).toFixed(
                        2,
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-slate-100 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Subtotal</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-teal-600">
                    <span>Discount</span>
                    <span className="font-semibold">
                      -${discount.toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between pb-4">
                  <span className="text-slate-500">Shipping</span>
                  <span className="font-semibold">
                    {shippingCost === 0
                      ? "Free"
                      : `$${shippingCost.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                  <span className="text-base font-bold text-slate-900">
                    Total
                  </span>
                  <span className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-lg font-bold text-sm transition-all mt-6 md:mt-8 disabled:bg-slate-300 flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Complete Purchase <FaChevronRight className="text-[10px]" />
                  </>
                )}
              </button>

              <div className="mt-6 flex items-center justify-center gap-2 text-slate-400">
                <FaShieldHalved className="text-teal-600 text-xs" />
                <span className="text-[10px] font-bold uppercase tracking-widest">
                  Secure Checkout
                </span>
              </div>
            </div>
          </div>
        </form>
      </main>

      {/* Coupon Selection Modal */}
      {showCouponModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-bold text-slate-800">Select Coupon</h3>
              <button
                onClick={() => setShowCouponModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600"
              >
                <FaTimes />
              </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[60vh] space-y-3">
              {claimedCoupons.length === 0 ? (
                <div className="text-center py-8">
                  <FaTicketAlt className="mx-auto text-4xl text-slate-300 mb-3" />
                  <p className="text-slate-500">No coupons available</p>
                  <button
                    onClick={() => {
                      setShowCouponModal(false);
                      navigate("/offers");
                    }}
                    className="mt-4 text-teal-600 hover:text-teal-700 font-medium text-sm"
                  >
                    Go claim some coupons
                  </button>
                </div>
              ) : (
                claimedCoupons.map((claimedCoupon) => {
                  const coupon = claimedCoupon.couponId || claimedCoupon;
                  return (
                    <button
                      key={claimedCoupon._id || coupon._id}
                      onClick={() => handleApplyCoupon(coupon)}
                      className="w-full flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:border-teal-500 hover:bg-teal-50/30 transition-all text-left"
                    >
                      <div className="w-12 h-12 bg-teal-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FaPercent className="text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-800 uppercase truncate">
                          {coupon.title || claimedCoupon.title}
                        </p>
                        <p className="text-sm text-teal-600">
                          {coupon.discountPercent ||
                            claimedCoupon.discountPercent}
                          % OFF
                        </p>
                        {claimedCoupon.claimedInCycle && (
                          <p className="text-xs text-slate-400">
                            Cycle {claimedCoupon.claimedInCycle}
                          </p>
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const PaymentTab = ({ active, onClick, icon, label }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg border-2 transition-all ${
      active
        ? "border-slate-900 bg-slate-900 text-white"
        : "border-slate-100 text-slate-500 hover:border-slate-200 bg-white"
    }`}
  >
    <span className="text-sm">{icon}</span>
    <span className="text-[10px] md:text-xs font-bold tracking-wide">
      {label}
    </span>
  </button>
);

export default Checkout;
