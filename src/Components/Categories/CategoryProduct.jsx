import React, { useContext, useEffect, useState } from "react";
import "./Category.css";
import { IoIosArrowForward } from "react-icons/io";
import { useDispatch } from "react-redux";
import { getAllProducts } from "../../store/feature/productSlice";
import { Link } from "react-router-dom";
import ProductContext from "../Context/ProductContext";

const CategoryProduct = () => {
  const dispatch = useDispatch();
  const [products, setproducts] = useState(null);
  const { images } = useContext(ProductContext);

  useEffect(() => {
    if (products === null) {
      setproducts(dispatch(getAllProducts()));
    }
  }, [dispatch]);

  return (
    <>
      <div className="Categories text-center bg-[#f4f5f7]">
        <h1 className="text-2xl text-neutral-900 font-bold pt-20 pb-2">
          Featured Categories
        </h1>
        <p className="text-neutral-500 font-normal pb-9">
          Choose your necessary products from this feature categories.
        </p>
        <div className="category-cards grid grid-cols-6 gap-px mx-11 pb-14">
          <Link to="/category/men">
            <div className="categ-card bg-white py-7 flex items-center w-[100%]">
              <div className="w-[30%] flex justify-center">
                <img
                  src={images[0]}
                  alt=""
                  style={{ width: "60px", height: "60px" }}
                />
              </div>
              <div className="flex items-center gap-x-1 h-16 ms-3">
                <h1 className="font-medium text-sm mb-3">men</h1>
              </div>
            </div>
          </Link>

          <Link to="/category/fish & meat">
            <div className="categ-card bg-white py-7 flex items-center w-[100%]">
              <div className="link-img w-[30%] flex justify-center">
                <img
                  src={images[1]}
                  alt=""
                  style={{ width: "40px", height: "40px" }}
                />
              </div>
              <div className="flex flex-col justify-center gap-x-1 h-16 ms-3">
                <h1 className="font-medium text-sm mb-3">Fish &...</h1>
                <p className="flex items-center gap-x-1 h-16 text-neutral-500 text-xs">
                  <IoIosArrowForward className="mt-[1px]" />
                  <span>Fish</span>
                </p>
                <p className="flex items-center gap-x-1 h-16 text-neutral-500 text-xs">
                  <IoIosArrowForward className="mt-[1px]" />
                  <span>Meat</span>
                </p>
              </div>
            </div>
          </Link>

          <Link to="/category/fruits & vegetable">
            <div className="categ-card bg-white py-7 flex items-center w-[100%]">
              <div className="w-[30%] flex justify-center">
                <img
                  src={images[2]}
                  alt=""
                  style={{ width: "40px", height: "40px" }}
                />
              </div>
              <div className="flex flex-col justify-center gap-x-1 h-16 ms-3">
                <h1 className="font-medium text-sm mb-3">Fruit &...</h1>
                <p className="flex items-center gap-x-1 h-16 text-neutral-500 text-xs">
                  <IoIosArrowForward className="mt-[1px]" />
                  <span>Baby Food</span>
                </p>
                <p className="flex items-center gap-x-1 h-16 text-neutral-500 text-xs">
                  <IoIosArrowForward className="mt-[1px]" />
                  <span>Fresh Fruit</span>
                </p>
                <p className="flex items-center gap-x-1 h-16 text-neutral-500 text-xs">
                  <IoIosArrowForward className="mt-[1px]" />
                  <span>Dry Fruits</span>
                </p>
              </div>
            </div>
          </Link>

          <Link to="/category/cooking">
            <div className="categ-card bg-white py-7 flex items-center w-[100%]">
              <div className="w-[30%] flex justify-center">
                <img
                  src={images[3]}
                  alt=""
                  style={{ width: "40px", height: "40px" }}
                />
              </div>
              <div className="flex flex-col justify-center gap-x-1 h-16 ms-3">
                <h1 className="font-medium text-sm mb-3">Cooking ...</h1>
                <p className="flex items-center gap-x-1 h-16 text-neutral-500 text-xs">
                  <IoIosArrowForward className="mt-[1px]" />
                  <span>Flour</span>
                </p>
                <p className="flex items-center gap-x-1 h-16 text-neutral-500 text-xs">
                  <IoIosArrowForward className="mt-[1px]" />
                  <span>Oil</span>
                </p>
              </div>
            </div>
          </Link>

          <Link to="/category/biscuit & cake">
            <div className="categ-card bg-white py-7 flex items-center w-[100%]">
              <div className="w-[30%] flex justify-center">
                <img
                  src={images[4]}
                  alt=""
                  style={{ width: "40px", height: "40px" }}
                />
              </div>
              <div className="flex flex-col justify-center gap-x-1 h-16 ms-3">
                <h1 className="font-medium text-sm mb-3">Biscuits & Cakes</h1>
                <p className="flex items-center gap-x-1 h-16 text-neutral-500 text-xs">
                  <IoIosArrowForward className="mt-[1px]" />
                  <span>Biscuits</span>
                </p>
                <p className="flex items-center gap-x-1 h-16 text-neutral-500 text-xs">
                  <IoIosArrowForward className="mt-[1px]" />
                  <span>Cakes</span>
                </p>
              </div>
            </div>
          </Link>

          <Link to="/category/household tools">
            <div className="categ-card bg-white py-7 flex items-center w-[100%]">
              <div className="w-[30%] flex justify-center">
                <img
                  src={images[5]}
                  alt=""
                  style={{ width: "40px", height: "40px" }}
                />
              </div>
              <div className="flex flex-col justify-center gap-x-1 h-16 ms-3">
                <h1 className="font-medium text-sm mb-3">Household Tools</h1>
                <p className="flex items-center gap-x-1 h-16 text-neutral-500 text-xs">
                  <IoIosArrowForward className="mt-[1px]" />
                  <span>Water Filter</span>
                </p>
                <p className="flex items-center gap-x-1 h-16 text-neutral-500 text-xs">
                  <IoIosArrowForward className="mt-[1px]" />
                  <span>Cleaning Tools</span>
                </p>
                <p className="flex items-center gap-x-1 h-16 text-neutral-500 text-xs">
                  <IoIosArrowForward className="mt-[1px]" />
                  <span>Pest Control</span>
                </p>
              </div>
            </div>
          </Link>

          <Link to="/category/pet care">
            <div className="categ-card bg-white py-7 flex items-center w-[100%]">
              <div className="w-[30%] flex justify-center">
                <img
                  src={images[6]}
                  alt=""
                  style={{ width: "40px", height: "40px" }}
                />
              </div>
              <div className="flex flex-col justify-center gap-x-1 h-16 ms-3">
                <h1 className="font-medium text-sm mb-3">Pet Care</h1>
                <p className="flex items-center gap-x-1 h-16 text-neutral-500 text-xs">
                  <IoIosArrowForward className="mt-[1px]" />
                  <span>Dog Care</span>
                </p>
                <p className="flex items-center gap-x-1 h-16 text-neutral-500 text-xs">
                  <IoIosArrowForward className="mt-[1px]" />
                  <span>Cat Care</span>
                </p>
              </div>
            </div>
          </Link>

          <Link to="/category/Beauty & Health">
            <div className="categ-card bg-white py-7 flex items-center w-[100%]">
              <div className="w-[30%] flex justify-center">
                <img
                  src={images[7]}
                  alt=""
                  style={{ width: "40px", height: "40px" }}
                />
              </div>
              <div className="flex flex-col justify-center gap-x-1 h-16 ms-3">
                <h1 className="font-medium text-sm mb-3">Beauty & Heal...</h1>
                <p className="flex items-center gap-x-1 h-16 text-neutral-500 text-xs">
                  <IoIosArrowForward className="mt-[1px]" />
                  <span>Women</span>
                </p>
                <p className="flex items-center gap-x-1 h-16 text-neutral-500 text-xs">
                  <IoIosArrowForward className="mt-[1px]" />
                  <span>Men</span>
                </p>
              </div>
            </div>
          </Link>

          <Link to="/category/jam & jelly">
            <div className="categ-card bg-white py-7 flex items-center w-[100%]">
              <div className="w-[30%] flex justify-center">
                <img
                  src={images[8]}
                  alt=""
                  style={{ width: "40px", height: "40px" }}
                />
              </div>
              <div className="flex flex-col justify-center gap-x-1 h-16 ms-3">
                <h1 className="font-medium text-sm mb-3">Jam & Jelly</h1>
              </div>
            </div>
          </Link>

          <Link to="/category/milk & dairy">
            <div className="categ-card bg-white py-7 flex items-center w-[100%]">
              <div className="w-[30%] flex justify-center">
                <img
                  src={images[9]}
                  alt=""
                  style={{ width: "40px", height: "40px" }}
                />
              </div>
              <div className="flex flex-col justify-center gap-x-1 h-16 ms-3">
                <h1 className="font-medium text-sm mb-3">Milk & Dairy</h1>
                <p className="flex items-center gap-x-1 h-16 text-neutral-500 text-xs">
                  <IoIosArrowForward className="mt-[1px]" />
                  <span>Milk</span>
                </p>
                <p className="flex items-center gap-x-1 h-16 text-neutral-500 text-xs">
                  <IoIosArrowForward className="mt-[1px]" />
                  <span>Dairy</span>
                </p>
              </div>
            </div>
          </Link>

          <Link to="/category/drinks">
            <div className="categ-card bg-white py-7 flex items-center w-[100%]">
              <div className="w-[30%] flex justify-center">
                <img
                  src={images[10]}
                  alt=""
                  style={{ width: "40px", height: "40px" }}
                />
              </div>
              <div className="flex flex-col justify-center gap-x-1 h-16 ms-3">
                <h1 className="font-medium text-sm mb-3">Drinks</h1>
                <p className="flex items-center gap-x-1 h-16 text-neutral-500 text-xs">
                  <IoIosArrowForward className="mt-[1px]" />
                  <p>Tea</p>
                </p>
                <p className="flex items-center gap-x-1 h-16 text-neutral-500 text-xs">
                  <IoIosArrowForward className="mt-[1px]" />
                  <p>Water</p>
                </p>
                <p className="flex items-center gap-x-1 h-16 text-neutral-500 text-xs">
                  <IoIosArrowForward className="mt-[1px]" />
                  <p>Juice</p>
                </p>
              </div>
            </div>
          </Link>

          <Link to="/category/breakfast">
            <div className="categ-card bg-white py-7 flex items-center w-[100%]">
              <div className="w-[30%] flex justify-center">
                <img
                  src={images[11]}
                  alt=""
                  style={{ width: "40px", height: "40px" }}
                />
              </div>
              <div className="flex flex-col justify-center gap-x-1 h-16 ms-3">
                <h1 className="font-medium text-sm mb-3">Breakfast</h1>
                <p className="flex items-center gap-x-1 h-16 text-neutral-500 text-xs">
                  <IoIosArrowForward className="mt-[1px]" />
                  <p>Bread</p>
                </p>
                <p className="flex items-center gap-x-1 h-16 text-neutral-500 text-xs">
                  <IoIosArrowForward className="mt-[1px]" />
                  <p>Cereal</p>
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
};

export default CategoryProduct;