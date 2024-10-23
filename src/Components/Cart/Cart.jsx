import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCart } from '../../store/feature/CartSlice';

const Cart = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);
  console.log('all items:', items);

  useEffect(() => {
    if (user && user._id) {
      dispatch(fetchCart(user._id));
    }
  }, [dispatch, user]);

  // Calculate the total price of all items in the cart
  const total = items.reduce((acc, item) => {
    const { productId, quantity } = item;
    const { price } = productId;
    return acc + price * quantity;
  }, 0);

  return (
    <div className='max-w-3xl mx-auto p-8 bg-white rounded-xl shadow-lg'>
      <h2 className='text-3xl font-bold text-teal-600 mb-8 text-center border-b pb-4'>
        Shopping Cart
      </h2>

      {loading && (
        <p className='text-center text-lg text-teal-600'>Loading...</p>
      )}
      {error && <p className='text-center text-red-500'>Error: {error}</p>}

      {items.length === 0 && !loading ? (
        <p className='text-center text-lg text-gray-600'>Your cart is empty</p>
      ) : (
        <>
          <div className='space-y-6'>
            {items.map((item) => {
              const { productId, quantity } = item;
              const { title, price, imageUrl } = productId;
              return (
                <div
                  key={productId._id}
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
                      <p className='text-gray-600'>Quantity: {quantity}</p>
                      <p className='text-gray-600'>Price: ${price}</p>
                    </div>
                  </div>
                  <div className='text-right'>
                    <p className='text-xl font-bold text-teal-600'>
                      ${(price * quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Display total price */}
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
