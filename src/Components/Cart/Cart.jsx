import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  removeFromCartAPI,
  fetchCartItems,
  updateCartItem, // Updated to use the new thunk
} from "../../store/feature/CartSlice";
import { FaTrash } from "react-icons/fa6";
import { toast } from "react-toastify";

const Cart = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    if (user) {
      dispatch(fetchCartItems(user._id));
    }
  }, [dispatch, user]);

  const handleRemoveFromCart = (productId) => {
    if (user) {
      dispatch(removeFromCartAPI({ userId: user._id, productId }));
    } else {
      toast.error("You need to log in to remove items from the cart!");
    }
  };

  const handleQuantityChange = (productId, quantity) => {
    if (user) {
      dispatch(updateCartItem({ userId: user._id, productId, quantity }));
    } else {
      toast.error("You need to log in to update item quantity!");
    }
  };

  const totalPrice = items.reduce(
    (acc, item) => acc + (item?.productId?.price * item.quantity || 0),
    0
  );

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">Your Shopping Cart</h1>

      {loading && <p className="text-blue-500">Loading cart...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {items.length > 0 ? (
        <>
          <div className="space-y-4">
            {items.map((item) => {
              const { productId, quantity, _id } = item;
              const { title, price, imageUrl } = productId || {};

              return (
                <div key={_id} className="cart-item flex justify-between items-center p-4 border-b border-gray-300">
                  <div className="flex items-center">
                    <img src={imageUrl} alt={title} className="h-24 w-24 rounded-md shadow-md mr-4" />
                    <div>
                      <h2 className="font-medium text-lg text-gray-800">{title || "Product Title"}</h2>
                      <p className="text-gray-600">Price: ${price?.toFixed(2) || "N/A"}</p>
                      <div className="flex items-center mt-2">
                        <button
                          className="bg-gray-200 text-gray-600 rounded-l-md px-3"
                          onClick={() => handleQuantityChange(productId, Math.max(1, quantity - 1))}
                        >
                          -
                        </button>
                        <span className="px-4">{quantity}</span>
                        <button
                          className="bg-gray-200 text-gray-600 rounded-r-md px-3"
                          onClick={() => handleQuantityChange(productId, quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                  <button
                    className="text-red-600 hover:text-red-800 transition duration-200"
                    onClick={() => handleRemoveFromCart(productId)}
                  >
                    <FaTrash className="h-6 w-6" />
                  </button>
                </div>
              );
            })}
          </div>

          <div className="total-price mt-6 p-4 bg-gray-100 rounded-lg shadow-md text-lg font-semibold text-gray-800">
            Total: ${totalPrice.toFixed(2)}
          </div>
        </>
      ) : (
        <p className="text-gray-600">Your cart is empty.</p>
      )}
    </div>
  );
};

export default Cart;