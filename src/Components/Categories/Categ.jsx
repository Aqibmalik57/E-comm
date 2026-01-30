import React, { useContext, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getAllProducts } from "../../store/feature/productSlice";
import { addToCart } from "../../store/feature/CartSlice";
import Navbar from "../Navbar/Navbar";
import CategCard from "./CategCard";
import { FaCartPlus, FaStar, FaEye } from "react-icons/fa6";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "./Category.css";
import ProductContext from "../Context/ProductContext";
import Product404 from "../../Assets/Images/404 error with person looking for-amico.png";
import Footer from "../Footer/Footer";
import QuickViewModal from "../Home/QuickViewModal";

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
    dispatch(getAllProducts());
  }, [dispatch]);

  const matchCategorySubstring = (urlCategory, productCategory) => {
    const lowerUrlCategory = urlCategory.toLowerCase();
    const lowerProductCategory = productCategory.toLowerCase();

    for (let i = 0; i <= lowerUrlCategory.length - 3; i++) {
      const substring = lowerUrlCategory.substring(i, i + 3);
      if (lowerProductCategory.includes(substring)) {
        return true;
      }
    }
    return false;
  };

  const filteredProducts = products?.filter((product) =>
    matchCategorySubstring(selectedCategory, product.category),
  );

  const sortedProducts = hasUserSorted
    ? filteredProducts?.sort((a, b) => {
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
    setVisibleProducts((prevCount) => prevCount + 8); // Increment visible products by 8
  };

  // Function to get discount based on category
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
    <>
      <div ref={ref} className="bg-[#f9fafb]">
        <Navbar />
        <CategCard onCategorySelect={handleCategoryClick} />
        <div className="Categ-Carousal w-full flex items-center h-20 mt-9 mb-9">
          <div className="my-swiper-containe w-[93%] mx-11">
            <Swiper
              modules={[Navigation]}
              spaceBetween={30}
              slidesPerView={9.5}
              navigation={true}
              loop={true}
              className="mySwiper relative h-20"
            >
              {images.map((image, index) => (
                <SwiperSlide
                  className="cursor-pointer bg-white p-3 rounded-lg h-20"
                  key={index}
                  onClick={() =>
                    handleCategoryClick(
                      index === 0
                        ? "Men"
                        : index === 1
                          ? "Fish & Meat"
                          : index === 2
                            ? "Fruits & Vegetables"
                            : index === 3
                              ? "Cooking"
                              : index === 4
                                ? "Biscuits & Cakes"
                                : index === 5
                                  ? "Household Tools"
                                  : index === 6
                                    ? "Pets Care"
                                    : index === 7
                                      ? "Beauty & Healths"
                                      : index === 8
                                        ? "Jam & Jelly"
                                        : index === 9
                                          ? "Milk & Dairy"
                                          : index === 10
                                            ? "Drinks"
                                            : "Breakfast",
                    )
                  }
                >
                  <div className="flex items-center flex-col justify-center h-full">
                    <img src={image} style={{ height: "40px" }} alt="" />
                    <h1 className="text-sm text-center">
                      {index === 0
                        ? "Men"
                        : index === 1
                          ? "Fish & Meat"
                          : index === 2
                            ? "Fruits & Vegetables"
                            : index === 3
                              ? "Cooking"
                              : index === 4
                                ? "Biscuits & Cakes"
                                : index === 5
                                  ? "Household Tools"
                                  : index === 6
                                    ? "Pets Care"
                                    : index === 7
                                      ? "Beauty & Healths"
                                      : index === 8
                                        ? "Jam & Jelly"
                                        : index === 9
                                          ? "Milk & Dairy"
                                          : index === 10
                                            ? "Drinks"
                                            : "Breakfast"}
                    </h1>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>

        <div className="product-count mt-4 mb-4 bg-[#ffedd5] mx-11 py-3 ps-2 flex items-center justify-between pe-4">
          {sortedProducts && sortedProducts.length > 0 ? (
            <>
              <h2>
                Total
                <span className="font-medium"> {sortedProducts.length} </span>
                {sortedProducts.length === 1 ? "product" : "products"} found
              </h2>
              <div className="sorting-options">
                <select
                  id="sort"
                  value={sortOption}
                  onChange={handleSortChange}
                  className="border border-gray-300 rounded-md p-2"
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
            <h2 className="text-xl font-semibold text-gray-800 mx-auto">
              No Products
            </h2>
          )}
        </div>

        <div className="grid grid-cols-5 gap-5 mx-8 pb-10">
          {loading && <p className="text-blue-500">Loading products...</p>}
          {error && <p className="text-red-500">Error: {error}</p>}
          {!loading && !error && sortedProducts && sortedProducts.length > 0
            ? sortedProducts.slice(0, visibleProducts).map((items) => (
                <div
                  key={items._id}
                  onClick={() => navigate(`/product/${items._id}`)}
                  className="items-card w-[240px] bg-white p-4 rounded-xl relative group hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-100 overflow-hidden"
                >
                  {/* Stock Badge
                  <div
                    className={`absolute top-3 left-3 px-3 py-1 text-xs font-semibold text-white rounded-full z-10 shadow-md ${
                      items.stock > 0
                        ? "bg-gradient-to-r from-green-500 to-green-600"
                        : "bg-gradient-to-r from-red-500 to-red-600"
                    }`}
                  >
                    {items.stock > 0 ? `Stock: ${items.stock}` : "Out of Stock"}
                  </div> */}

                  {/* Image Container */}
                  <div className="relative mb-4 overflow-hidden rounded-lg">
                    <img
                      src={items.imageUrl}
                      alt={items.title}
                      className="h-40 w-full object-contain hover:scale-105 transition-transform duration-500"
                    />

                    {/* Discount Badge */}
                    {getDiscount(items.category) > 0 && (
                      <div className="absolute top-0 right-0 bg-[#ffedea] text-[#f74b81] px-2 py-1 text-[10px] font-bold rounded-md z-20 border border-[#fbd9d3] w-fit shadow-sm">
                        {getDiscount(items.category)}% Off
                      </div>
                    )}

                    {/* Quick View Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleQuickView(items);
                        }}
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
                      {items.title}
                    </h1>

                    {/* Rating Display */}
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
                            size={14}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">
                        {calculateRating(items.reviews)} (
                        {items.reviews?.length || 0} reviews)
                      </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getDiscount(items.category) > 0 ? (
                          <>
                            <span className="text-lg font-bold text-green-600">
                              $
                              {(
                                items.price *
                                (1 - getDiscount(items.category) / 100)
                              ).toFixed(2)}
                            </span>
                            <span className="text-sm text-gray-500 line-through">
                              ${items.price}
                            </span>
                          </>
                        ) : (
                          <span className="text-lg font-bold text-green-600">
                            ${items.price}
                          </span>
                        )}
                      </div>

                      {/* Add to Cart Button */}
                      <button
                        className="bg-gradient-to-r from-green-500 to-green-600 text-white p-2 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => handleAddToCart(items._id, 1)}
                        disabled={items.stock <= 0}
                        aria-label={`Add ${items.title} to cart`}
                      >
                        <FaCartPlus size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            : !loading &&
              !error && (
                <div className="col-span-full flex flex-col items-center justify-center py-20 w-full text-center">
                  <img
                    src={Product404}
                    alt="No Products Found"
                    className="w-80 h-auto mb-6"
                  />
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    No Products Found
                  </h3>
                  <p className="text-gray-500 max-w-sm mx-auto">
                    We couldn't find any products in this category. Please try
                    checking another one!
                  </p>
                </div>
              )}
        </div>

        {visibleProducts < sortedProducts?.length && (
          <div className="flex justify-center mb-10">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
              onClick={handleLoadMore}
            >
              Load More
            </button>
          </div>
        )}

        {/* Quick View Modal */}
        <QuickViewModal
          product={selectedProduct}
          isOpen={isModalOpen}
          onClose={closeModal}
        />

        <Footer />
      </div>
    </>
  );
};

export default Categ;
