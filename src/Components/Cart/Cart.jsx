import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  decreaseCartQuantity,
  fetchCart,
  increaseCartQuantity,
  removeFromCart,
} from '../../store/feature/CartSlice';
import { FaMinus, FaPlus, FaTrash } from 'react-icons/fa6';

const Cart = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    if (user && user._id) {
      dispatch(fetchCart(user._id));
    }
  }, [user, dispatch]);

  // Calculate total cart value
  const total = items.reduce((acc, item) => {
    const { productId, quantity } = item;
    const { price } = productId || {};
    return acc + (price ? price * quantity : 0);
  }, 0);

  const handleQuantityIncrease = (productId) => {
    if (user._id) {
      dispatch(increaseCartQuantity({ userId: user._id, productId }));
      dispatch(fetchCart(user._id)); // Re-fetch the cart
    }
  };

  const handleQuantityDecrease = (productId) => {
    if (user._id) {
      dispatch(decreaseCartQuantity({ userId: user._id, productId }));
      dispatch(fetchCart(user._id)); // Re-fetch the cart
    }
  };

  const handleRemoveFromCart = (productId) => {
    dispatch(removeFromCart({ userId: user._id, productId }));
    dispatch(fetchCart(user._id)); // Re-fetch the cart after removal
  };

  return (
    <div className='max-w-3xl mx-auto p-8 bg-white rounded-xl shadow-lg'>
      <h2 className='text-3xl font-bold text-teal-600 mb-8 text-center border-b pb-4'>
        Shopping Cart
      </h2>

      {loading && (
        <p className='text-center text-lg text-teal-600'>Loading...</p>
      )}
      {error && (
        <p className='text-center text-red-500'>
          Error: {typeof error === 'string' ? error : error.message}
        </p>
      )}

      {items.length === 0 && !loading ? (
        <p className='text-center text-lg text-gray-600'>
          Your cart is empty. Start shopping and add items to your cart!
        </p>
      ) : (
        <>
          <div className='space-y-6'>
            {items.map((item, index) => {
              const { productId, quantity } = item;
              const { title, price, imageUrl } = productId || {};

              return (
                <div
                  key={index}
                  className='flex items-center justify-between p-6 bg-gray-50 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-200'
                >
                  <div className='flex items-center space-x-4'>
                    <img
                      src={imageUrl}
                      alt={title}
                      className='w-20 h-20 rounded-lg border border-gray-200'
                    />
                    <div>
                      <h3 className='text-xl font-semibold text-teal-600'>
                        {title}
                      </h3>
                      <p className='text-gray-600'>
                        Price: ${price ? price.toFixed(2) : 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className='text-right'>
                    <p className='text-xl font-bold text-teal-600'>
                      $
                      {price && quantity
                        ? (price * quantity).toFixed(2)
                        : 'N/A'}
                    </p>
                    <div className='flex items-center space-x-2 mt-2'>
                      <button
                        onClick={() => handleQuantityDecrease(productId._id)}
                        disabled={quantity <= 1}
                        className='px-3 py-2 bg-gray-300 rounded-full text-sm text-gray-800 font-semibold hover:bg-gray-400'
                      >
                        <FaMinus />
                      </button>
                      <p>{quantity}</p>
                      <button
                        onClick={() => handleQuantityIncrease(productId._id)}
                        className='px-3 py-2 bg-teal-500 rounded-full text-sm text-white font-semibold hover:bg-teal-600'
                      >
                        <FaPlus />
                      </button>
                      <button
                        onClick={() => handleRemoveFromCart(productId._id)}
                        className='text-red-500 hover:text-red-700'
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className='mt-8 p-4 bg-teal-50 rounded-lg text-right'>
            <p className='text-2xl font-bold text-teal-600'>
              Total: ${total.toFixed(2)}
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
