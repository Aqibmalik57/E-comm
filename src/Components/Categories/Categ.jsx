import React, { useContext, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getAllProducts } from "../../store/feature/productSlice";
import Navbar from "../Navbar/Navbar";
import CategCard from "./CategCard";
import { FaCartPlus } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "./Category.css";
import ProductContext from "../Context/ProductContext";
import Product404 from "../../Assets/Images/404 error with person looking for-amico.png";
import Footer from "../Footer/Footer";

const Categ = () => {
  const { category } = useParams();
  const dispatch = useDispatch();
  const { loading, error, products } = useSelector((state) => state.product);
  const ref = useRef(null);
  const { images } = useContext(ProductContext);

  const [selectedCategory, setSelectedCategory] = useState(category || "");
  const [productCount, setProductCount] = useState(0);
  const [sortOption, setSortOption] = useState("default");
  const [hasUserSorted, setHasUserSorted] = useState(false);
  const [visibleProducts, setVisibleProducts] = useState(6);

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
    matchCategorySubstring(selectedCategory, product.category)
  );

  useEffect(() => {
    setProductCount(filteredProducts?.length);
  }, [filteredProducts]);

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

  return (
    <>
      <div ref={ref} className="bg-[#f9fafb]">
        <Navbar />
        <CategCard />
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
                        : "Breakfast"
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

        <div className="flex flex-wrap gap-5 mx-11 pb-10">
          {loading && <h2>Loading...</h2>}
          {error && <h2 className="text-red-500">Error: {error.message}</h2>}
          {!loading && !error && sortedProducts && sortedProducts.length > 0
            ? sortedProducts.slice(0, visibleProducts).map((items) => (
                <div
                  key={items._id}
                  className="items-card w-[219px] bg-white p-4 rounded-md relative"
                >
                  <span
                    className={`absolute top-0 left-0 px-2 py-1 text-xs font-bold text-white rounded-full z-10 ${
                      items.stock > 0 ? "bg-neutral-200" : "bg-red-500"
                    }`}
                  >
                    <span className="text-green-500">Stock :</span>
                    <span
                      className={`font-bold ${
                        items.stock > 0 ? "text-[#c24f3f]" : "text-red-200"
                      }`}
                    >
                      {items.stock > 0 ? items.stock : "Out of stock"}
                    </span>
                  </span>

                  <img
                    src={items.imageUrl}
                    alt={items.title}
                    className="h-36 w-48 mx-auto hover:transform hover:scale-110 duration-300"
                  />
                  <h1 className="mt-2 mb-2 text-start text-sm text-neutral-600">
                    {items.title}
                  </h1>
                  <div className="flex items-center justify-between">
                    <h3 className="text-start font-bold">${items.price}</h3>
                    <button className="border border-neutral-200 text-[#10b981] p-2 rounded-md">
                      <FaCartPlus />
                    </button>
                  </div>
                </div>
              ))
            : !loading &&
              !error && (
                <div className="mx-auto text-center">
                  <img
                    src={Product404}
                    alt="No Products Found"
                    className="w-80 mx-auto"
                  />
                  <p className="text-xl font-semibold text-gray-800">
                    No Products Found in this Category
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
        <Footer />
      </div>
    </>
  );
};

export default Categ;
