import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  decreaseCartQuantity,
  fetchCart,
  increaseCartQuantity,
  removeFromCart,
} from "../../store/feature/CartSlice";
import { selectCoupon, deselectCoupon } from "../../store/feature/offerSlice";
import { FaArrowLeft, FaMinus, FaPlus, FaTrash, FaLock } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { HiTicket } from "react-icons/hi2";
import { IoMdCheckmarkCircle } from "react-icons/io";

const Cart = () => {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);
  const { claimedCoupons, selectedCoupons } = useSelector(
    (state) => state.offer,
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user._id) {
      dispatch(fetchCart(user._id));
    }
  }, [user, dispatch]);

  const subtotal = (items || []).reduce((acc, item) => {
    const { productId, quantity } = item;
    const { price } = productId || {};
    return acc + (price ? price * quantity : 0);
  }, 0);

  const discount = selectedCoupons.reduce((acc, couponId) => {
    const coupon = claimedCoupons.find((c) => c.id === couponId);
    if (coupon) {
      if (coupon.discountType === "percentage") {
        return acc + subtotal * (coupon.discountValue / 100);
      } else if (coupon.discountType === "fixed") {
        return acc + coupon.discountValue;
      }
    }
    return acc;
  }, 0);

  const total = subtotal - discount;

  const handleQuantityIncrease = async (productId) => {
    if (user._id) {
      try {
        await dispatch(increaseCartQuantity({ userId: user._id, productId }));
      } catch (error) {
        console.error("Error increasing quantity:", error);
      }
    }
  };

  const handleQuantityDecrease = async (productId) => {
    if (user._id) {
      try {
        await dispatch(decreaseCartQuantity({ userId: user._id, productId }));
      } catch (error) {
        console.error("Error decreasing quantity:", error);
      }
    }
  };

  const handleRemoveFromCart = async (productId) => {
    if (user && user._id) {
      try {
        const response = await dispatch(
          removeFromCart({ userId: user._id, productId }),
        );
        if (response.meta.requestStatus === "fulfilled") {
          dispatch(fetchCart(user._id));
        }
      } catch (error) {
        console.error("Error removing item:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Navigation */}
      <div className="max-w-6xl mx-auto px-4 pt-6 md:pt-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-teal-700 hover:text-teal-900 font-medium transition-colors mb-4 md:mb-6"
        >
          <FaArrowLeft className="mr-2" /> Back to Store
        </button>

        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 md:mb-8 flex flex-col sm:flex-row sm:items-baseline">
          Shopping Cart
          <span className="text-sm md:text-lg font-normal text-gray-500 sm:ml-4">
            ({items?.length || 0} items)
          </span>
        </h2>
      </div>

      <div className="max-w-6xl mx-auto px-4">
        {!user ? (
          <div className="flex flex-col items-center justify-center py-16 md:py-20 text-center">
            <FaLock className="text-gray-300 mb-4" size={50} />
            <h3 className="text-xl md:text-2xl font-bold text-gray-800">
              Authentication Required
            </h3>
            <p className="text-gray-500 mb-8 max-w-xs">
              Please log in to manage your shopping cart.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="bg-teal-600 text-white px-8 md:px-10 py-3 rounded-full font-bold hover:bg-teal-700 transition-all shadow-md"
            >
              Login Now
            </button>
          </div>
        ) : (
          <>
            {items.length === 0 && !loading ? (
              <div className="text-center py-16 md:py-20 border-2 border-dashed border-gray-200 rounded-3xl">
                <p className="text-lg md:text-xl text-gray-500 mb-6">
                  Your cart feels a bit light...
                </p>
                <button
                  onClick={() => navigate("/")}
                  className="text-teal-600 font-bold text-lg hover:underline"
                >
                  Start Adding Items
                </button>
              </div>
            ) : (
              <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                {/* Left Side: Product List */}
                <div className="flex-1">
                  <div className="divide-y divide-gray-200">
                    {items.map((item, index) => {
                      const { productId, quantity } = item;
                      const { title, price, imageUrl } = productId || {};
                      return (
                        <div
                          key={index}
                          className="py-6 flex flex-col sm:flex-row items-center sm:items-start gap-4 md:gap-6 group"
                        >
                          <div className="w-28 h-28 md:w-32 md:h-32 flex-shrink-0">
                            <img
                              src={imageUrl}
                              alt={title}
                              className="w-full h-full object-contain rounded-2xl border border-gray-200 shadow-sm bg-white"
                            />
                          </div>

                          <div className="flex-1 flex flex-col sm:flex-row justify-between w-full">
                            <div className="text-center sm:text-left">
                              <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-1 group-hover:text-teal-600 transition-colors line-clamp-2">
                                {title}
                              </h3>
                              <p className="text-sm text-gray-500 mb-4 sm:mb-0">
                                Unit Price:{" "}
                                <span className="text-gray-900 font-medium">
                                  ${price?.toFixed(2)}
                                </span>
                              </p>
                            </div>

                            <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-between gap-4 mt-2 sm:mt-0">
                              <div className="flex items-center bg-white border border-gray-200 rounded-full p-1 shadow-sm">
                                <button
                                  onClick={() =>
                                    handleQuantityDecrease(productId._id)
                                  }
                                  disabled={quantity <= 1}
                                  className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 disabled:opacity-30"
                                >
                                  <FaMinus size={10} />
                                </button>
                                <span className="w-8 md:w-10 text-center font-bold text-gray-800 text-sm">
                                  {quantity}
                                </span>
                                <button
                                  onClick={() =>
                                    handleQuantityIncrease(productId._id)
                                  }
                                  className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center rounded-full text-teal-600 hover:bg-teal-50"
                                >
                                  <FaPlus size={10} />
                                </button>
                              </div>

                              <div className="flex items-center gap-3 md:gap-4">
                                <span className="text-lg md:text-xl font-bold text-gray-900">
                                  ${(price * quantity).toFixed(2)}
                                </span>
                                <button
                                  onClick={() =>
                                    handleRemoveFromCart(productId._id)
                                  }
                                  className="text-gray-300 hover:text-red-500 transition-colors p-2"
                                >
                                  <FaTrash size={16} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right Side: Sidebar */}
                <div className="lg:w-[380px] space-y-6 md:space-y-8">
                  {/* Voucher Section */}
                  {claimedCoupons.filter((c) => {
                    const now = new Date().getTime();
                    return (
                      now >= new Date(c.startDate).getTime() &&
                      now <= new Date(c.expirationDate).getTime()
                    );
                  }).length > 0 && (
                    <div className="p-4 border border-gray-200 rounded-3xl bg-white">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xs font-black text-gray-700 uppercase tracking-wider flex items-center gap-2">
                          <HiTicket className="text-teal-600 text-lg" />{" "}
                          Available Vouchers
                        </h3>
                      </div>

                      <div className="flex overflow-x-auto gap-3 scrollbar-hide pb-2">
                        {claimedCoupons
                          .filter((c) => {
                            const now = new Date().getTime();
                            return (
                              now >= new Date(c.startDate).getTime() &&
                              now <= new Date(c.expirationDate).getTime()
                            );
                          })
                          .map((coupon) => {
                            const isSelected = selectedCoupons.includes(
                              coupon.id,
                            );
                            return (
                              <div
                                key={coupon.id}
                                onClick={() => {
                                  if (isSelected) {
                                    dispatch(deselectCoupon(coupon.id));
                                  } else {
                                    dispatch(selectCoupon(coupon.id));
                                  }
                                }}
                                className={`flex-shrink-0 w-56 md:w-64 cursor-pointer relative border-2 rounded-xl p-4 transition-all ${
                                  isSelected
                                    ? "border-teal-500 bg-teal-50/30 shadow-md"
                                    : "border-gray-100 bg-gray-50/50 hover:border-teal-300"
                                }`}
                              >
                                <div className="flex justify-between items-start">
                                  <div className="max-w-[140px] md:max-w-[160px]">
                                    <h4
                                      className={`text-xs font-bold truncate ${isSelected ? "text-teal-700" : "text-gray-700"}`}
                                    >
                                      {coupon.name}
                                    </h4>
                                    <p className="text-[10px] text-gray-500 mt-1 line-clamp-1">
                                      {coupon.description}
                                    </p>
                                  </div>
                                  <div
                                    className={`text-xs font-black ${isSelected ? "text-teal-600" : "text-teal-500"}`}
                                  >
                                    {coupon.discountType === "percentage"
                                      ? `${coupon.discountValue}%`
                                      : `$${coupon.discountValue}`}
                                  </div>
                                </div>
                                {isSelected && (
                                  <div className="absolute -top-2 -right-2 bg-teal-500 text-white rounded-full p-0.5 shadow-sm">
                                    <IoMdCheckmarkCircle className="text-sm" />
                                  </div>
                                )}
                                <div className="mt-2 pt-2 border-t border-dashed border-gray-300 flex justify-between items-center">
                                  <span className="text-[9px] text-gray-400 font-medium">
                                    Exp:{" "}
                                    {new Date(
                                      coupon.expirationDate,
                                    ).toLocaleDateString()}
                                  </span>
                                  <span className="text-[9px] font-bold text-teal-600">
                                    {isSelected ? "APPLIED" : "TAP TO APPLY"}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  )}

                  {/* Summary Card */}
                  <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-xl shadow-gray-200/50 lg:sticky lg:top-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">
                      Order Summary
                    </h3>

                    <div className="space-y-4 mb-8">
                      <div className="flex justify-between text-sm md:text-base text-gray-500">
                        <span>Subtotal</span>
                        <span className="text-gray-900 font-medium">
                          ${subtotal.toFixed(2)}
                        </span>
                      </div>
                      {discount > 0 && (
                        <div className="flex justify-between text-sm md:text-base text-teal-600 font-medium">
                          <span>Discount Applied</span>
                          <span>-${discount.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm md:text-base text-gray-500">
                        <span>Shipping</span>
                        <span className="text-green-600 font-medium">Free</span>
                      </div>
                      <div className="pt-4 border-t border-gray-100 flex justify-between items-end">
                        <span className="text-gray-900 font-bold">
                          Total Amount
                        </span>
                        <span className="text-2xl md:text-3xl font-black text-teal-600">
                          ${total.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <button className="w-full bg-teal-600 text-white py-4 rounded-2xl text-lg font-bold hover:bg-teal-700 transition-all shadow-lg shadow-teal-100 active:scale-[0.98]">
                      Checkout Now
                    </button>

                    <p className="text-center text-[10px] md:text-xs text-gray-400 mt-4">
                      Secure encrypted checkout powered by Stripe
                    </p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
