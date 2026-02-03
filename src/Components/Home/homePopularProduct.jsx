import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllProducts } from "../../store/feature/productSlice";
import { addToCart } from "../../store/feature/CartSlice";
import { FaCartPlus, FaStar } from "react-icons/fa6";
import { IoExpand } from "react-icons/io5";
import QuickViewModal from "./QuickViewModal";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const HomePopularProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, products } = useSelector((state) => state.product);
  const { user } = useSelector((state) => state.user);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getDiscount = (category) => {
    if (!category) return 0;
    const discountMap = {
      vegetable: 10,
      fruit: 5,
      cooking: 15,
      fish: 20,
      cake: 10,
      men: 10,
    };
    return discountMap[category.toLowerCase()] || 0;
  };

  useEffect(() => {
    dispatch(getAllProducts());
  }, [dispatch]);

  const handleAddToCart = async (productId, quantity = 1) => {
    try {
      const userId = user?._id;
      await dispatch(addToCart({ userId, productId, quantity })).unwrap();
    } catch (backendError) {
      toast.error(backendError || "Something went wrong");
    }
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
    <div className="PpProducts bg-[#f9fafb] text-center px-4">
      {/* Title responsive text size and padding */}
      <h1 className="text-xl lg:text-2xl text-neutral-900 font-bold pt-12 lg:pt-20 pb-2">
        Popular Products for Daily Shopping
      </h1>
      {/* Description: full width on mobile, 36% on lg */}
      <p className="text-neutral-500 font-normal pb-9 w-full lg:w-[36%] mx-auto text-sm lg:text-base">
        See all our popular products this week. You can choose your daily needs
        from this list and get special offers with free shipping.
      </p>

      {loading && <p className="text-blue-500">Loading products...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {/* Grid: 2 columns on mobile, 3 on tablet, 5 on desktop */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 lg:gap-5 mx-0 lg:mx-8 pb-10">
        {!loading &&
          !error &&
          products?.slice(0, 18)?.map((item) => (
            <div
              key={item._id}
              onClick={() => navigate(`/product/${item._id}`)}
              /* Removed fixed width w-[240px] for mobile fluidity, kept it lg:w-auto */
              className="items-card w-full bg-white p-3 lg:p-4 rounded-xl relative group hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-100 overflow-hidden cursor-pointer"
            >
              {/* Image Container */}
              <div className="relative mb-4 overflow-hidden rounded-lg">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="h-32 lg:h-40 w-full object-contain hover:scale-105 transition-transform duration-500"
                />

                {/* Discount Badge */}
                {getDiscount(item.category) > 0 && (
                  <div className="absolute top-0 right-0 bg-[#ffedea] text-[#f74b81] px-2 py-1 text-[9px] lg:text-[10px] font-bold rounded-md z-20 border border-[#fbd9d3] w-fit shadow-sm">
                    {getDiscount(item.category)}% Off
                  </div>
                )}

                {/* Quick View Overlay (Hidden or simplified on touch devices usually, but kept for lg) */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleQuickView(item);
                    }}
                    className="bg-white text-gray-800 px-4 py-2 rounded-full font-medium hover:bg-gray-100 transition-colors shadow-lg flex items-center space-x-2"
                  >
                    <IoExpand size={16} />
                    <span className="hidden sm:inline">Quick View</span>
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-2 text-left">
                <h1 className="text-xs lg:text-sm font-semibold text-gray-800 line-clamp-2 leading-tight h-8 lg:h-10">
                  {item.title}
                </h1>

                {/* Rating Display - Simplified for mobile */}
                <div className="flex items-center space-x-1 lg:space-x-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={
                          i < Math.floor(calculateRating(item.reviews))
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }
                        size={12}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] lg:text-xs text-gray-500">
                    ({item.reviews?.length || 0})
                  </span>
                </div>

                {/* Price and Cart */}
                <div className="flex items-center justify-between gap-1">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:gap-2">
                    {getDiscount(item.category) > 0 ? (
                      <>
                        <span className="text-sm lg:text-lg font-bold text-green-600">
                          $
                          {(
                            item.price *
                            (1 - getDiscount(item.category) / 100)
                          ).toFixed(2)}
                        </span>
                        <span className="text-[10px] lg:text-sm text-gray-500 line-through">
                          ${item.price}
                        </span>
                      </>
                    ) : (
                      <span className="text-sm lg:text-lg font-bold text-green-600">
                        ${item.price}
                      </span>
                    )}
                  </div>

                  <button
                    className="bg-gradient-to-r from-green-500 to-green-600 text-white p-2 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-md disabled:opacity-50"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(item._id, 1);
                    }}
                    disabled={item.stock <= 0}
                  >
                    <FaCartPlus size={14} className="lg:w-4 lg:h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>

      <QuickViewModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </div>
  );
};

export default HomePopularProduct;
