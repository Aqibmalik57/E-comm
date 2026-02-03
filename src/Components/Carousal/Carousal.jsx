import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";
import "./Carousal.css";

const Carousal = () => {
  return (
    /* Width is 100% on mobile, 53% on large screens */
    <div className="flex justify-center mx-4 ms-0 lg:ms-11 w-full md:w-[53%]">
      <Swiper
        pagination={true}
        modules={[Pagination, Autoplay]}
        loop={true}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
        }}
        className="w-[100%] h-[43vh] lg:h-[50vh] my-5 rounded-lg"
      >
        {/* Slides: Adjusted text sizes for mobile */}
        {[1, 2, 3, 4, 5].map((num) => (
          <SwiperSlide
            key={num}
            className={`Slider${num === 1 ? "" : num} flex flex-col justify-center items-start ps-6 lg:ps-9 pt-8 h-full`}
          >
            <h1 className="text-xl lg:text-3xl font-bold w-full lg:w-72">
              {num === 3
                ? "Quality Freshness Guaranteed!"
                : "The Best Quality Products Guaranteed!"}
            </h1>
            <p className="text-sm lg:text-lg text-gray-600 mt-2 mb-5 w-full lg:w-80">
              The Best Quality Products Guaranteed!
            </p>
            <button className="bg-[#10b981] text-white px-5 py-2 rounded-lg">
              Shop Now
            </button>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Carousal;
