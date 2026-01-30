import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllProducts } from "../../store/feature/productSlice";
import { addToCart } from "../../store/feature/CartSlice";
import { FaCartPlus, FaStar, FaEye } from "react-icons/fa6";
import QuickViewModal from "./QuickViewModal";

const HomePopularProduct = () => {
  const dispatch = useDispatch();
  const { loading, error, products } = useSelector((state) => state.product);
  const { user } = useSelector((state) => state.user);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(getAllProducts());
  }, [dispatch]);

  const handleAddToCart = (productId, quantity = 1) => {
    const userId = user._id;
    dispatch(addToCart({ userId, productId, quantity }));
  };

  const handleQuickView = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const calculateRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviews.length).toFixed(1);
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

      <div className="grid grid-cols-5 gap-5 mx-11 pb-10">
        {!loading &&
          !error &&
          products?.slice(0, 18)?.map((item) => (
            <div
              key={item._id}
              className="items-card w-[240px] bg-white p-4 rounded-xl relative group hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-100 overflow-hidden"
            >
              {/* Stock Badge */}
              <div
                className={`absolute top-3 left-3 px-3 py-1 text-xs font-semibold text-white rounded-full z-10 shadow-md ${
                  item.stock > 0
                    ? "bg-gradient-to-r from-green-500 to-green-600"
                    : "bg-gradient-to-r from-red-500 to-red-600"
                }`}
              >
                {item.stock > 0 ? `Stock: ${item.stock}` : "Out of Stock"}
              </div>

              {/* Image Container */}
              <div className="relative mb-4 overflow-hidden rounded-lg">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="h-40 w-full object-contain hover:scale-105 transition-transform duration-500"
                />

                {/* Quick View Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                  <button
                    onClick={() => handleQuickView(item)}
                    className="bg-white text-gray-800 px-4 py-2 rounded-full font-medium hover:bg-gray-100 transition-colors shadow-lg flex items-center space-x-2"
                  >
                    <FaEye size={16} />
                    <span>Quick View</span>
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-2">
                <h1 className="text-sm font-semibold text-gray-800 line-clamp-2 leading-tight">
                  {item.title}
                </h1>

                {/* Rating Display */}
                <div className="flex items-center space-x-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={
                          i < Math.floor(calculateRating(item.reviews))
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }
                        size={14}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-500">
                    {calculateRating(item.reviews)} ({item.reviews?.length || 0}{" "}
                    reviews)
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-green-600">
                    ${item.price}
                  </span>

                  {/* Add to Cart Button */}
                  <button
                    className="bg-gradient-to-r from-green-500 to-green-600 text-white p-2 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => handleAddToCart(item._id, 1)}
                    disabled={item.stock <= 0}
                    aria-label={`Add ${item.title} to cart`}
                  >
                    <FaCartPlus size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </div>
  );
};

export default HomePopularProduct;
