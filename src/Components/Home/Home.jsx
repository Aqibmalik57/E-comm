import { useEffect, useRef } from "react";
import Carousal from "../Carousal/Carousal";
import Offer from "../Offers/HomeOffer";
import Category from "../Categories/CategoryProduct";
import PopularProduct from "../Home/homePopularProduct";
import Take_Away from "../../Assets/Images/Take Away-pana.png";

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
        <div className="carousal-offers">
          {/* Stack on mobile, side-by-side on LG */}
          <div className="flex flex-col md:flex-row gap-6 px-4 lg:px-0">
            <Carousal />
            <Offer />
          </div>

          {/* Adjusted margins and padding for mobile */}
          <div className="bg-[#ffedd5] flex flex-col sm:flex-row justify-between items-center mx-4 lg:mx-10 py-6 px-6 lg:px-10 rounded-lg mb-6 mt-2 gap-4 text-center sm:text-left">
            <div>
              <h1 className="text-[#059669] text-lg lg:text-xl font-bold">
                100% Natural Quality Organic Product
              </h1>
              <p className="text-neutral-500 font-normal text-sm lg:text-base">
                See Our latest discounted products from here and get a special
                discount product
              </p>
            </div>
            <button className="bg-[#10b981] text-white px-5 py-2 rounded-full whitespace-nowrap">
              Shop Now
            </button>
          </div>
        </div>
        <Category />
        <PopularProduct />

        <div className="bg-[#f9fafb] pt-6 pb-12">
          {/* Responsive container for the "Download App" section */}
          <div className="mx-4 lg:mx-11 bg-[#10b981] p-4 lg:p-16 rounded-lg h-auto">
            <div className="px-6 lg:px-10 bg-white flex flex-col lg:flex-row justify-between rounded-lg py-8 lg:py-0 items-center lg:items-stretch">
              <div className="leading-tight flex flex-col justify-center text-center lg:text-left">
                <p className="text-lg lg:text-xl">Organic Products and Food</p>
                <h1 className="font-bold text-xl lg:text-2xl mb-2">
                  Quick Delivery to Your Home
                </h1>
                <p className="text-neutral-900 w-full lg:w-[550px] font-normal text-sm mb-7">
                  There are many products you will find in our shop, Choose your
                  daily necessary product from our KachaBazar shop and get some
                  special offers.
                </p>
                <button className="bg-[#10b981] w-40 mx-auto lg:mx-0 text-white px-5 py-3 rounded-full mb-6 lg:mb-0">
                  <a href="/" target="_blank">
                    Download App
                  </a>
                </button>
              </div>
              <div className="flex items-center lg:items-start">
                <img
                  src={Take_Away}
                  className="h-[150px] lg:h-[250px] object-contain"
                  alt="Take Away"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
