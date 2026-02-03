import React, { useContext, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getAllProducts } from "../../store/feature/productSlice";
import { addToCart } from "../../store/feature/CartSlice";
import CategCard from "./CategCard";
import { FaCartPlus, FaStar } from "react-icons/fa6";
import { IoExpand } from "react-icons/io5";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "./Category.css";
import ProductContext from "../Context/ProductContext";
import Product404 from "../../Assets/Images/404 error with person looking for-amico.png";
import QuickViewModal from "../Home/QuickViewModal";
import { toast } from "react-toastify";

const Categ = () => {
  const { category } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, products } = useSelector((state) => state.product);
  const { user } = useSelector((state) => state.user);
  const ref = useRef(null);
  const { images } = useContext(ProductContext);

  const [selectedCategory, setSelectedCategory] = useState(category || "");
  const [sortOption, setSortOption] = useState("default");
  const [hasUserSorted, setHasUserSorted] = useState(false);
  const [visibleProducts, setVisibleProducts] = useState(6);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView();
    }
  }, []);

  useEffect(() => {
    if (category) {
      setSelectedCategory(category);
      setVisibleProducts(6);
    }
  }, [category]);

  useEffect(() => {
    dispatch(getAllProducts());
  }, [dispatch]);

  const matchCategorySubstring = (urlCat, prodCat) => {
    if (!urlCat || !prodCat) return false;
    const u = urlCat.toLowerCase();
    const p = prodCat.toLowerCase();
    return p.includes(u) || u.includes(p);
  };

  const filteredProducts = products?.filter((product) =>
    matchCategorySubstring(selectedCategory, product.category),
  );

  const sortedProducts = hasUserSorted
    ? [...filteredProducts]?.sort((a, b) => {
        if (sortOption === "lowToHigh") {
          return a.price - b.price;
        } else if (sortOption === "highToLow") {
          return b.price - a.price;
        }
        return 0;
      })
    : filteredProducts;

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
    setHasUserSorted(true);
  };

  const handleLoadMore = () => {
    setVisibleProducts((prevCount) => prevCount + 8);
  };

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

  const categoriesNames = [
    "Men",
    "Fish & Meat",
    "Fruits & Vegetables",
    "Cooking",
    "Biscuits & Cakes",
    "Household Tools",
    "Pets Care",
    "Beauty & Healths",
    "Jam & Jelly",
    "Milk & Dairy",
    "Drinks",
    "Breakfast",
  ];

  return (
    <>
      <div ref={ref} className="bg-[#f9fafb] pb-10">
        <CategCard onCategorySelect={handleCategoryClick} />

        <div className="w-full mt-6 px-4 md:px-11">
          <div className="p-2">
            {images && images.length > 0 && (
              <Swiper
                key={images.length}
                modules={[Navigation]}
                navigation
                loop={true}
                breakpoints={{
                  0: { slidesPerView: 3, spaceBetween: 10 },
                  480: { slidesPerView: 4, spaceBetween: 12 },
                  768: { slidesPerView: 5, spaceBetween: 15 },
                  1024: { slidesPerView: 8, spaceBetween: 20 },
                  1440: { slidesPerView: 10, spaceBetween: 20 },
                }}
                className="category-swiper"
              >
                {images.map((image, index) => (
                  <SwiperSlide
                    key={index}
                    onClick={() =>
                      handleCategoryClick(categoriesNames[index] || "Breakfast")
                    }
                    className="bg-white rounded-xl shadow-sm"
                  >
                    <div className="flex flex-col items-center justify-center p-2 cursor-pointer group">
                      <div className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center bg-gray-50 rounded-full group-hover:bg-green-50 transition-colors">
                        <img
                          src={image}
                          alt=""
                          className="w-8 h-8 object-contain group-hover:scale-110 transition-transform"
                        />
                      </div>
                      <span className="text-[10px] md:text-xs font-medium mt-2 text-gray-600 text-center line-clamp-1">
                        {categoriesNames[index] || "Breakfast"}
                      </span>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </div>
        </div>

        {/* Product Count & Sort - Flex column on mobile */}
        <div className="product-count mt-4 mb-4 bg-[#ffedd5] mx-4 md:mx-11 py-3 px-4 flex flex-col md:flex-row items-center justify-between gap-3">
          {sortedProducts && sortedProducts.length > 0 ? (
            <>
              <h2 className="text-sm md:text-base">
                Total
                <span className="font-medium"> {sortedProducts.length} </span>
                {sortedProducts.length === 1 ? "product" : "products"} found
              </h2>
              <div className="sorting-options w-full md:w-auto">
                <select
                  id="sort"
                  value={sortOption}
                  onChange={handleSortChange}
                  className="border border-gray-300 rounded-md p-2 text-sm w-full md:w-auto"
                >
                  {sortOption === "default" && (
                    <option value="default" disabled>
                      Sort By Price
                    </option>
                  )}
                  <option value="lowToHigh">Low to High</option>
                  <option value="highToLow">High to Low</option>
                </select>
              </div>
            </>
          ) : (
            <h2 className="text-lg md:text-xl font-semibold text-gray-800 mx-auto">
              No Products
            </h2>
          )}
        </div>

        {/* Responsive Grid - 1 col on XS, 2 col on SM/MD, 5 col on LG */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5 mx-4 md:mx-8 pb-10">
          {loading && (
            <p className="text-blue-500 col-span-full text-center">
              Loading products...
            </p>
          )}
          {error && (
            <p className="text-red-500 col-span-full text-center">
              Error: {error}
            </p>
          )}

          {!loading && !error && sortedProducts && sortedProducts.length > 0
            ? sortedProducts.slice(0, visibleProducts).map((items) => (
                <div
                  key={items._id}
                  onClick={() => navigate(`/product/${items._id}`)}
                  className="items-card w-full bg-white p-4 rounded-xl relative group hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-100 overflow-hidden mx-auto"
                >
                  {/* Image Container */}
                  <div className="relative mb-4 overflow-hidden rounded-lg">
                    <img
                      src={items.imageUrl}
                      alt={items.title}
                      className="h-32 md:h-40 w-full object-contain hover:scale-105 transition-transform duration-500"
                    />

                    {getDiscount(items.category) > 0 && (
                      <div className="absolute top-0 right-0 bg-[#ffedea] text-[#f74b81] px-2 py-1 text-[10px] font-bold rounded-md z-20 border border-[#fbd9d3] w-fit shadow-sm">
                        {getDiscount(items.category)}% Off
                      </div>
                    )}

                    {/* Quick View Overlay - Hidden on touch devices unless hovered, or accessible via icon */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleQuickView(items);
                        }}
                        className="bg-white text-gray-800 px-3 py-1.5 md:px-4 md:py-2 rounded-full font-medium hover:bg-gray-100 transition-colors shadow-lg flex items-center space-x-2 text-xs md:text-sm"
                      >
                        <IoExpand size={16} />
                        <span>Quick View</span>
                      </button>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="space-y-2">
                    <h1 className="text-xs md:text-sm font-semibold text-gray-800 line-clamp-2 leading-tight h-8 md:h-10">
                      {items.title}
                    </h1>

                    <div className="flex items-center space-x-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            className={
                              i < Math.floor(calculateRating(items.reviews))
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }
                            size={12}
                          />
                        ))}
                      </div>
                      <span className="text-[10px] text-gray-500">
                        ({items.reviews?.length || 0})
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap items-center gap-1 md:gap-2">
                        {getDiscount(items.category) > 0 ? (
                          <>
                            <span className="text-base md:text-lg font-bold text-green-600">
                              $
                              {(
                                items.price *
                                (1 - getDiscount(items.category) / 100)
                              ).toFixed(2)}
                            </span>
                            <span className="text-[10px] md:text-sm text-gray-500 line-through">
                              ${items.price}
                            </span>
                          </>
                        ) : (
                          <span className="text-base md:text-lg font-bold text-green-600">
                            ${items.price}
                          </span>
                        )}
                      </div>

                      <button
                        className="bg-gradient-to-r from-green-500 to-green-600 text-white p-2 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-md disabled:opacity-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(items._id, 1);
                        }}
                        disabled={items.stock <= 0}
                      >
                        <FaCartPlus size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            : !loading &&
              !error && (
                <div className="col-span-full flex flex-col items-center justify-center py-10 md:py-20 w-full text-center px-4">
                  <img
                    src={Product404}
                    alt="No Products Found"
                    className="w-48 md:w-80 h-auto mb-6"
                  />
                  <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
                    No Products Found
                  </h3>
                  <p className="text-gray-500 max-w-sm mx-auto text-sm md:text-base">
                    We couldn't find any products in this category.
                  </p>
                </div>
              )}
        </div>

        {visibleProducts < sortedProducts?.length && (
          <div className="flex justify-center mt-6">
            <button
              className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors"
              onClick={handleLoadMore}
            >
              Load More
            </button>
          </div>
        )}

        <QuickViewModal
          product={selectedProduct}
          isOpen={isModalOpen}
          onClose={closeModal}
        />
      </div>
    </>
  );
};

export default Categ;
