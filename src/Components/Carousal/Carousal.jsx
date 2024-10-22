import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";
import './Carousal.css'

const Carousal = () => {
  return (
    <div className="flex justify-center ms-11 w-[53%]">
      <Swiper
        pagination={true}
        modules={[Pagination, Autoplay]}
        loop={true}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
        }}
        className="w-[100%] h-[50vh] my-5 rounded-lg"
      >
        <SwiperSlide className="Slider flex justify-center items-center ps-9 pt-8 h-full">
          <h1 className="text-3xl font-medium w-72">
            The Best Quality Products Guaranteed!
          </h1>
          <p className="text-lg text-gray-600 mt-2 mb-5 font-[3px] w-80">
            The Best Quality Products Guaranteed!
          </p>
          <button className="bg-[#10b981] text-white px-5 py-2 rounded-lg">
            Shop Now
          </button>
        </SwiperSlide>
        <SwiperSlide className="Slider2 flex justify-center items-center ps-9 pt-8 h-full">
          <h1 className="text-3xl font-medium w-72">
            Best Different Type of Grocery Store
          </h1>
          <p className="text-lg text-gray-600 mt-2 mb-5 font-[3px] w-72">
            Quickly aggregate empowered networks after emerging products...
          </p>
          <button className="bg-[#10b981] text-white px-5 py-2 rounded-lg">
            Shop Now
          </button>
        </SwiperSlide>
        <SwiperSlide className="Slider3 flex justify-center items-center ps-9 pt-8 h-full">
          <h1 className="text-3xl font-medium w-72">
            Quality Freshness Guaranteed!
          </h1>
          <p className="text-lg text-gray-600 mt-2 mb-5 font-[3px] w-72">
            Intrinsicly fashion performance based products rather than accurate benefits...
          </p>
          <button className="bg-[#10b981] text-white px-5 py-2 rounded-lg">
            Shop Now
          </button>
        </SwiperSlide>
        <SwiperSlide className="Slider4 flex justify-center items-center ps-9 pt-8 h-full">
          <h1 className="text-3xl font-medium w-72">
            The Best Quality Products Guaranteed!
          </h1>
          <p className="text-lg text-gray-600 mt-2 mb-5 font-[3px] w-72">
            Dramatically facilitate effective total linkage for go forward processes...
          </p>
          <button className="bg-[#10b981] text-white px-5 py-2 rounded-lg">
            Shop Now
          </button>
        </SwiperSlide>
        <SwiperSlide className="Slider5 flex justify-center items-center ps-9 pt-8 h-full">
          <h1 className="text-3xl font-medium w-72">
            Best Different Type of Grocery Store
          </h1>
          <p className="text-lg text-gray-600 mt-2 mb-5 font-[3px] w-72">
            Quickly aggregate empowered networks after emerging products...
          </p>
          <button className="bg-[#10b981] text-white px-5 py-2 rounded-lg">
            Shop Now
          </button>
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default Carousal;