import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  decreaseCartQuantity,
  fetchCart,
  increaseCartQuantity,
  removeFromCart,
} from "../../store/feature/CartSlice";
import { selectCoupon, deselectCoupon } from "../../store/feature/offerSlice";
import { FaArrowLeft, FaMinus, FaPlus, FaTrash } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { HiTicket } from "react-icons/hi2";
import { IoMdCheckmarkCircle } from "react-icons/io";

const Cart = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.cart);
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

  // Calculate subtotal
  const subtotal = (items || []).reduce((acc, item) => {
    const { productId, quantity } = item;
    const { price } = productId || {};
    return acc + (price ? price * quantity : 0);
  }, 0);

  // Calculate discount based on selected coupons
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

  // Calculate total after discount
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
          console.log("Item removed successfully");
          dispatch(fetchCart(user._id)); // Re-fetch the cart after removal
        } else {
          console.error("Failed to remove item:", response.error);
        }
      } catch (error) {
        console.error("Error removing item from cart:", error);
      }
    }
  };

  return (
    <>
      <button
        onClick={() => navigate(-1)}
        className="flex items-center relative top-8 left-6 text-teal-700 hover:text-teal-900 font-semibold mb-4"
      >
        <FaArrowLeft className="mr-2" /> Back
      </button>
      <div className="max-w-6xl mx-auto p-8 bg-white rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-teal-600 mb-8 text-center border-b pb-4">
          Shopping Cart
        </h2>
        {error && (
          <p className="text-center text-red-500">
            Error: {typeof error === "string" ? error : error.message}
          </p>
        )}

        {items.length === 0 && !loading ? (
          <p className="text-center text-lg text-gray-600">
            Your cart is empty. Start shopping and add items to your cart!
          </p>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Products Section - Left Side */}
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-teal-600 mb-6">
                Your Items
              </h3>
              <div className="space-y-6">
                {items.map((item, index) => {
                  const { productId, quantity } = item;
                  const { title, price, imageUrl } = productId || {};

                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between p-6 bg-gray-50 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-200"
                    >
                      <div className="flex items-center space-x-4">
                        <img
                          src={imageUrl}
                          alt={title}
                          className="w-20 h-20 rounded-lg border border-gray-200"
                        />
                        <div>
                          <h3 className="text-xl font-semibold text-teal-600">
                            {title}
                          </h3>
                          <p className="text-gray-600">
                            Price: ${price ? price.toFixed(2) : "N/A"}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-teal-600">
                          $
                          {price && quantity
                            ? (price * quantity).toFixed(2)
                            : "N/A"}
                        </p>
                        <div className="flex items-center space-x-2 mt-2">
                          <button
                            onClick={() =>
                              handleQuantityDecrease(productId._id)
                            }
                            disabled={quantity <= 1}
                            className="px-3 py-2 bg-gray-300 rounded-full text-sm text-gray-800 font-semibold hover:bg-gray-400"
                          >
                            <FaMinus />
                          </button>
                          <p>{quantity}</p>
                          <button
                            onClick={() =>
                              handleQuantityIncrease(productId._id)
                            }
                            className="px-3 py-2 bg-teal-500 rounded-full text-sm text-white font-semibold hover:bg-teal-600"
                          >
                            <FaPlus />
                          </button>
                          <button
                            onClick={() => handleRemoveFromCart(productId._id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Coupon and Summary Section - Right Side */}
            <div className="lg:w-96">
              {/* Coupon Rewards Section - UI UNCHANGED AS REQUESTED */}
              {claimedCoupons.filter((c) => {
                const now = new Date().getTime();
                // Only show coupons that are currently LIVE
                return (
                  now >= new Date(c.startDate).getTime() &&
                  now <= new Date(c.expirationDate).getTime()
                );
              }).length > 0 && (
                <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-black text-gray-700 uppercase tracking-wider flex items-center gap-2">
                      <HiTicket className="text-teal-600 text-lg" /> Available
                      Vouchers
                    </h3>
                    <span className="text-[10px] bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full font-bold">
                      {/* Updated count to show only valid ones */}
                      {
                        claimedCoupons.filter((c) => {
                          const now = new Date().getTime();
                          return (
                            now >= new Date(c.startDate).getTime() &&
                            now <= new Date(c.expirationDate).getTime()
                          );
                        }).length
                      }{" "}
                      SAVED
                    </span>
                  </div>

                  {/* Horizontal Scroll for Compactness */}
                  <div className="flex overflow-x-auto gap-3 scrollbar-hide p-1.5">
                    {claimedCoupons
                      .filter((c) => {
                        const now = new Date().getTime();
                        // Filter out old/expired history items
                        return (
                          now >= new Date(c.startDate).getTime() &&
                          now <= new Date(c.expirationDate).getTime()
                        );
                      })
                      .map((coupon) => {
                        const isSelected = selectedCoupons.includes(coupon.id);
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
                            className={`flex-shrink-0 w-64 cursor-pointer relative border-2 rounded-lg p-3 transition-all ${
                              isSelected
                                ? "border-teal-500 bg-teal-50/50 shadow-md"
                                : "border-gray-100 bg-gray-50 hover:border-gray-300"
                            }`}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h4
                                  className={`text-xs font-bold ${isSelected ? "text-teal-700" : "text-gray-700"}`}
                                >
                                  {coupon.name}
                                </h4>
                                <p className="text-[10px] text-gray-500 mt-1 line-clamp-1">
                                  {coupon.description}
                                </p>
                              </div>
                              <div
                                className={`text-xs font-black ${isSelected ? "text-teal-600" : "text-gray-400"}`}
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

                            <div className="mt-2 pt-2 border-t border-dashed border-gray-200 flex justify-between items-center">
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

              {/* Order Summary */}
              <div className="bg-teal-50 p-6 rounded-lg lg:sticky lg:top-8 lg:self-start shadow-lg border border-teal-200">
                <h3 className="text-2xl font-bold text-teal-600 mb-4">
                  Order Summary
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-lg text-gray-700">Subtotal:</span>
                    <span className="text-lg font-semibold text-gray-800">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-lg text-green-700">Discount:</span>
                      <span className="text-lg font-semibold text-green-700">
                        -${discount.toFixed(2)}
                      </span>
                    </div>
                  )}
                  <hr className="border-teal-200" />
                  <div className="flex justify-between">
                    <span className="text-2xl font-bold text-teal-600">
                      Total:
                    </span>
                    <span className="text-2xl font-bold text-teal-600">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>
                <button className="w-full mt-6 bg-teal-600 text-white py-3 rounded-lg text-lg font-bold hover:bg-teal-700 transition-colors">
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;
