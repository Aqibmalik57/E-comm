import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  FaShieldHalved,
  FaCreditCard,
  FaPaypal,
  FaLock,
  FaChevronRight,
} from "react-icons/fa6";

const Checkout = () => {
  const navigate = useNavigate();

  const { items = [] } = useSelector((state) => state.cart || {});
  const { user = {} } = useSelector((state) => state.user || {});
  const { claimedCoupons = [], selectedCoupons = [] } = useSelector(
    (state) => state.offer || {},
  );

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [isProcessing, setIsProcessing] = useState(false);

  const deliveryOptions = {
    standard: { name: "Standard", price: 0, provider: "FedEx" },
    express: { name: "Express", price: 15.0, provider: "DHL" },
    overnight: { name: "Priority", price: 35.0, provider: "UPS" },
  };

  // Safe Calculation Logic
  const subtotal = items.reduce((acc, item) => {
    const price = item.productId?.price || 0;
    return acc + price * item.quantity;
  }, 0);

  const discount = selectedCoupons.reduce((acc, couponId) => {
    const coupon = claimedCoupons.find(
      (c) => c.id === couponId || c._id === couponId,
    );
    if (coupon) {
      return coupon.discountType === "percentage"
        ? acc + subtotal * (coupon.discountValue / 100)
        : acc + coupon.discountValue;
    }
    return acc;
  }, 0);

  const shippingCost = deliveryOptions[shippingMethod]?.price || 0;
  const total = Math.max(0, subtotal - discount + shippingCost);

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    // Capture form data for the invoice
    const formData = new FormData(e.currentTarget);
    const customerDetails = {
      name: formData.get("fullName") || user?.name,
      email: formData.get("email") || user?.email,
      phone: formData.get("phone"),
      address: `${formData.get("address")}, ${formData.get("city")}, ${formData.get("state")} ${formData.get("zip")}`,
    };

    setTimeout(() => {
      setIsProcessing(false);
      // Navigate and pass the compiled order data
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
    "bg-white border border-slate-200 rounded-xl p-6 mb-6 shadow-sm";
  const inputClass =
    "w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all bg-white";
  const labelClass = "text-xs font-semibold text-slate-600 mb-1.5 block";

  // If cart is empty, show a fallback instead of a blank screen or error
  if (!items || items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
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
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FaLock className="text-teal-600 text-sm" />
            <span className="font-bold text-slate-800 tracking-tight">
              Checkout
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <form
          onSubmit={handlePlaceOrder}
          className="grid grid-cols-1 lg:grid-cols-12 gap-10"
        >
          <div className="lg:col-span-7">
            {/* 1. Contact */}
            <div className={sectionClass}>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-6 flex items-center gap-2">
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
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-6 flex items-center gap-2">
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
                    />{" "}
                  </div>
                  <div>
                    <label className={labelClass}>ZIP Code</label>
                    <input
                      required
                      name="zip"
                      type="text"
                      className={inputClass}
                    />{" "}
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Delivery */}
            <div className={sectionClass}>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-6 flex items-center gap-2">
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
                    className={`p-4 rounded-lg border text-left transition-all ${shippingMethod === key ? "border-teal-600 bg-teal-50/30" : "border-slate-200 hover:border-slate-300 bg-white"}`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">
                        {opt.provider}
                      </span>
                      {shippingMethod === key && (
                        <div className="w-2 h-2 bg-teal-600 rounded-full" />
                      )}
                    </div>
                    <p className="text-sm font-bold text-slate-800">
                      {opt.name}
                    </p>
                    <p className="text-xs font-semibold text-teal-700 mt-1">
                      {opt.price === 0 ? "Free" : `$${opt.price.toFixed(2)}`}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Payment */}
            <div className={sectionClass}>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-6 flex items-center gap-2">
                <span className="w-5 h-5 bg-slate-900 text-white rounded-full flex items-center justify-center text-[10px]">
                  4
                </span>
                Payment
              </h3>
              <div className="flex gap-4 mb-6">
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
                  <div>
                    <label className={labelClass}>Expiry</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className={inputClass}
                    />
                  </div>
                  <div>
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

          {/* Sidebar */}
          <div className="lg:col-span-5">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm sticky top-24">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-6">
                Order Summary
              </h3>
              <div className="divide-y divide-slate-100 max-h-[400px] overflow-y-auto pr-3 custom-scrollbar">
                {items.map((item, idx) => (
                  <div key={idx} className="py-5 flex gap-5 items-center group">
                    {/* Increased size from w-12/h-12 to w-20/h-20 */}
                    <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-lg p-2 flex-shrink-0 flex items-center justify-center transition-transform group-hover:scale-105">
                      <img
                        src={item.productId?.imageUrl}
                        alt={item.productId?.title}
                        className="max-w-full max-h-full object-contain mix-blend-multiply"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-slate-800 leading-tight mb-1">
                        {item.productId?.title}
                      </h4>
                      <div className="flex items-center gap-3">
                        <span className="text-[11px] font-medium px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                          Qty: {item.quantity}
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium">
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
                  <span className="text-2xl font-black text-slate-900 tracking-tight">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-lg font-bold text-sm transition-all mt-8 disabled:bg-slate-300 flex items-center justify-center gap-2"
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
    <span className="text-xs font-bold tracking-wide">{label}</span>
  </button>
);

export default Checkout;
