import React, { useContext, useEffect } from "react";
import "./Category.css";
import { IoIosArrowForward } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ProductContext from "../Context/ProductContext";
import { getAllCategories } from "../../store/feature/categorySlice";

const CategoryProduct = () => {
  const navigate = useNavigate();
  const { images } = useContext(ProductContext);
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.category);

  useEffect(() => {
    dispatch(getAllCategories());
  }, [dispatch]);

  return (
    <div className="Categories text-center bg-[#f4f5f7]">
      <h1 className="text-2xl text-neutral-900 font-bold pt-20 pb-2">
        Featured Categories
      </h1>
      <p className="text-neutral-500 font-normal pb-9">
        Choose your necessary products from this feature categories.
      </p>

      <div className="category-cards grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-px mx-11 pb-14">
        {categories &&
          categories.map((cat, index) => (
            <div
              key={cat._id || index}
              onClick={() => navigate(`/category/${cat.name}`)}
              className="categ-card bg-white py-6 flex items-center w-full cursor-pointer hover:shadow-md transition-shadow group"
            >
              {/* Image Section */}
              <div className="w-[35%] flex justify-center">
                <img
                  src={
                    cat.imageUrl || images[index % images.length] || images[0]
                  }
                  alt={cat.name}
                  className="object-contain"
                  style={{ width: "45px", height: "45px" }}
                />
              </div>

              {/* Text & Subcategories Section */}
              <div className="flex flex-col justify-center items-start ms-3 text-left">
                <h1 className="font-medium text-sm mb-1 capitalize group-hover:text-green-600 transition-colors">
                  {cat.name}
                </h1>

                {cat.subcategories &&
                  cat.subcategories.map((sub) => (
                    <Link
                      key={typeof sub === "object" ? sub._id || sub.name : sub}
                      to={`/category/${typeof sub === "object" ? sub.name : sub}`}
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-x-1 text-neutral-500 text-[11px] hover:text-green-500 mb-0.5"
                    >
                      <IoIosArrowForward className="text-[10px]" />
                      <span>{typeof sub === "object" ? sub.name : sub}</span>
                    </Link>
                  ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default CategoryProduct;
