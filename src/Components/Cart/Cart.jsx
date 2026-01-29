import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  decreaseCartQuantity,
  fetchCart,
  increaseCartQuantity,
  removeFromCart,
} from "../../store/feature/CartSlice";
import { FaArrowLeft, FaMinus, FaPlus, FaTrash } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);
  const { claimedCoupons } = useSelector((state) => state.offer);
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

  // Calculate discount based on claimed coupons
  const discount = claimedCoupons.reduce((acc, coupon) => {
    if (coupon.discountType === "percentage") {
      return acc + subtotal * (coupon.discountValue / 100);
    } else if (coupon.discountType === "fixed") {
      return acc + coupon.discountValue;
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
            <div className="lg:w-96 ">
              {/* Coupon Rewards Section */}
              {claimedCoupons.length > 0 && (
                <div className="bg-gradient-to-br from-green-50 to-teal-50 p-6 rounded-lg shadow-lg mb-6 border-2 border-green-200">
                  <h3 className="text-2xl font-bold text-green-800 mb-4 flex items-center">
                    🎉 Coupon Rewards
                  </h3>
                  <div className="space-y-3">
                    {claimedCoupons.map((coupon, index) => (
                      <div
                        key={index}
                        className="bg-white p-4 rounded-lg shadow-md border border-green-200 hover:shadow-lg transition-shadow"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-bold text-green-700 text-lg">
                            {coupon.name}
                          </h4>
                          <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                            {coupon.discountType === "percentage"
                              ? `${coupon.discountValue}% OFF`
                              : `$${coupon.discountValue} OFF`}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {coupon.description}
                        </p>
                      </div>
                    ))}
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
