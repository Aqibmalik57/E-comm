import React, { useContext } from "react";
import "./Category.css";
import { IoIosArrowForward } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import ProductContext from "../Context/ProductContext";

const CategoryProduct = () => {
  const navigate = useNavigate();
  const { images } = useContext(ProductContext);

  // Data configuration to keep the JSX clean and dry
  const categories = [
    { title: "men", path: "men", subs: [], img: images[0] },
    {
      title: "Fish & Meat",
      path: "fish & meat",
      subs: ["Fish", "Meat"],
      img: images[1],
    },
    {
      title: "Fruits & Veg",
      path: "fruits & vegetable",
      subs: ["Baby Food", "Fresh Fruit", "Dry Fruits"],
      img: images[2],
    },
    {
      title: "Cooking",
      path: "cooking",
      subs: ["Flour", "Oil"],
      img: images[3],
    },
    {
      title: "Biscuits & Cakes",
      path: "biscuit & cake",
      subs: ["Biscuits", "Cakes"],
      img: images[4],
    },
    {
      title: "Household",
      path: "household tools",
      subs: ["Water Filter", "Cleaning Tools", "Pest Control"],
      img: images[5],
    },
    {
      title: "Pet Care",
      path: "pet care",
      subs: ["Dog Care", "Cat Care"],
      img: images[6],
    },
    {
      title: "Beauty & Health",
      path: "Beauty & Health",
      subs: ["Women", "Men"],
      img: images[7],
    },
    { title: "Jam & Jelly", path: "jam & jelly", subs: [], img: images[8] },
    {
      title: "Milk & Dairy",
      path: "milk & dairy",
      subs: ["Milk", "Dairy"],
      img: images[9],
    },
    {
      title: "Drinks",
      path: "drinks",
      subs: ["Tea", "Water", "Juice"],
      img: images[10],
    },
    {
      title: "Breakfast",
      path: "breakfast",
      subs: ["Bread", "Cereal"],
      img: images[11],
    },
  ];

  return (
    <div className="Categories text-center bg-[#f4f5f7]">
      <h1 className="text-2xl text-neutral-900 font-bold pt-20 pb-2">
        Featured Categories
      </h1>
      <p className="text-neutral-500 font-normal pb-9">
        Choose your necessary products from this feature categories.
      </p>

      <div className="category-cards grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-px mx-11 pb-14">
        {categories.map((cat, index) => (
          <div
            key={index}
            onClick={() => navigate(`/category/${cat.path}`)}
            className="categ-card bg-white py-6 flex items-center w-full cursor-pointer hover:shadow-md transition-shadow group"
          >
            {/* Image Section */}
            <div className="w-[35%] flex justify-center">
              <img
                src={cat.img}
                alt={cat.title}
                className="object-contain"
                style={{ width: "45px", height: "45px" }}
              />
            </div>

            {/* Text & Subcategories Section */}
            <div className="flex flex-col justify-center items-start ms-3 text-left">
              <h1 className="font-medium text-sm mb-1 capitalize group-hover:text-green-600 transition-colors">
                {cat.title}
              </h1>

              {cat.subs.map((sub) => (
                <Link
                  key={sub}
                  to={`/category/${sub}`}
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-x-1 text-neutral-500 text-[11px] hover:text-green-500 mb-0.5"
                >
                  <IoIosArrowForward className="text-[10px]" />
                  <span>{sub}</span>
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
