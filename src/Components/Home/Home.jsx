import React, { useEffect, useRef } from "react";
import "./Home.css";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import Carousal from "../Carousal/Carousal";
import Offer from "../Offers/HomeOffer";
import Category from "../Categories/CategoryProduct";
import PopularProduct from "../Home/homePopularProduct";
import Take_Away from '../../Assets/Images/Take Away-pana.png'
const Home = () => {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView();
    }
  }, []);
  return (
    <>
      <div ref={ref} className="home">
        <Navbar />
        <div className="carousal-offers">
          <div className="flex gap-6">
            <Carousal />
            <Offer />
          </div>
          <div className="bg-[#ffedd5] flex justify-between items-center mx-10 py-6 px-10 rounded-lg mb-6 mt-2">
            <div>
              <h1 className="text-[#059669] text-xl font-bold">
                100% Natural Quality Organic Product
              </h1>
              <p className="text-neutral-500 font-normal">
                See Our latest discounted products from here and get a special
                discount product
              </p>
            </div>
            <button className="bg-[#10b981] text-white px-5 py-2 rounded-full">
              Shop Now
            </button>
          </div>
        </div>
        <Category />
        <PopularProduct />
        <div className="bg-[#f9fafb] pt-6 pb-12">
          <div className="mx-11 bg-[#10b981] p-16 rounded-lg h-auto">
            <div className="px-10 bg-white flex justify-between rounded-lg">
              <div className="leading-3 flex flex-col justify-center">
                <p className="text-xl">Organic Products and Food</p>
                <h1 className="font-bold text-2xl mb-2">Quick Delivery to Your Home</h1>
                <p className="text-neutral-900 w-[550px] font-normal text-sm mb-7">
                  There are many products you will find in our shop, Choose your
                  daily necessary product from our KachaBazar shop and get some
                  special offers. See Our latest discounted products from here
                  and get a special discount.
                </p>
                <button className="bg-[#10b981] w-40 text-white px-5 py-3 rounded-full">
                  <a href="" target="_blank">
                    Download App
                  </a>
                </button>
              </div>
              <div className="flex items-start">
                <img src={Take_Away} style={{ height: "250px" }} alt="" />
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Home;
