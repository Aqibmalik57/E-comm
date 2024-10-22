import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllProducts } from "../../store/feature/productSlice";
import { addToCart } from "../../store/feature/CartSlice"; // Import your addToCart action
import { FaCartPlus } from "react-icons/fa6";
import { toast } from "react-toastify";

const HomePopularProduct = () => {
  const dispatch = useDispatch();
  const { loading, error, products } = useSelector((state) => state.product);
  const { user } = useSelector((state) => state.user); // Get user data from Redux

  useEffect(() => {
    dispatch(getAllProducts());
  }, [dispatch]);

  const handleAddToCart = (product) => {
    if (user) {
      // Only proceed if the user is logged in
      dispatch(
        addToCart({
          userId: user._id, // Use the userId from the logged-in user
          productId: product._id,
          quantity: 1, // Default quantity of 1
        })
      );
      toast.success(`${product.title} added to cart!`);
    } else {
      toast.error("You need to log in to add items to the cart!");
    }
  };

  return (
    <div className="PpProducts bg-[#f9fafb] text-center">
      <h1 className="text-2xl text-neutral-900 font-bold pt-20 pb-2">
        Popular Products for Daily Shopping
      </h1>
      <p className="text-neutral-500 font-normal pb-9 w-[36%] mx-auto">
        See all our popular products this week. You can choose your daily needs
        from this list and get special offers with free shipping.
      </p>

      {loading && <p className="text-blue-500">Loading products...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      <div className="flex flex-wrap gap-5 mx-11 pb-10">
        {(!loading && !error) && products?.slice(0, 18)?.map((item) => (
          <div
            key={item._id}
            className="items-card w-[219px] bg-white p-4 rounded-md relative"
          >
            <span
              className={`absolute top-0 left-0 px-2 py-1 text-xs font-bold text-white rounded-full z-10 ${
                item.stock > 0 ? "bg-neutral-200" : "bg-red-500"
              }`}
            >
              <span className="text-green-500">Stock :</span>
              <span
                className={`font-bold ${
                  item.stock > 0 ? "text-[#c24f3f]" : "text-red-200"
                }`}
              >
                {item.stock > 0 ? item.stock : "Out of stock"}
              </span>
            </span>

            <img
              src={item.imageUrl}
              alt={item.title}
              className="h-36 w-48 mx-auto hover:transform hover:scale-110 duration-300"
            />
            <h1 className="mt-2 mb-2 text-start text-sm text-neutral-600">
              {item.title}
            </h1>
            <h3 className="text-start font-bold">${item.price}</h3>
            <div className="flex items-center justify-between mt-2">
              <button
                className="border border-neutral-200 text-[#10b981] p-2 rounded-md"
                onClick={() => handleAddToCart(item)} // Pass the whole item
                disabled={item.stock === 0} // Disable button if out of stock
              >
                <FaCartPlus />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePopularProduct;