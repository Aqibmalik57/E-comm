import React from "react";

const CategCard = ({ onCategorySelect }) => {
  return (
    <>
      <div className="mx-11 grid grid-cols-3 gap-3 mt-10">
        <div
          className="text-white h-[180px] flex flex-col justify-center items-center rounded-t-xl rounded-b"
          style={{
            background: `url(${require("../../Assets/Images/cta-bg-1.webp")}) no-repeat center center / cover `,
          }}
          onClick={() => onCategorySelect("Fruits & Vegetables")}
        >
          <h2 className="text-lg font-bold text-center text-gray-100">
            Taste of <br />
            <span className="text-2xl text-white">Fresh & Natural</span>
          </h2>
          <p className="text-sm">Weekend discount offer</p>
          <button className="bg-[#10b981] text-white text-xs px-5 py-2 rounded-full mt-5">
            Shop Now
          </button>
        </div>
        <div
          className="text-white h-[180px] flex flex-col justify-center items-center rounded-t-xl rounded-b cursor-pointer"
          style={{
            background: `url(${require("../../Assets/Images/cta-bg-2.webp")}) no-repeat center center / cover `,
          }}
          onClick={() => onCategorySelect("Fish & Meat")}
        >
          <h2 className="text-lg font-bold text-center text-gray-100">
            Taste of <br />
            <span className="text-2xl text-white">Fish & Meat</span>
          </h2>
          <p className="text-sm">Weekend discount offer</p>
          <button className="bg-[#10b981] text-white text-xs px-5 py-2 rounded-full mt-5">
            Shop Now
          </button>
        </div>
        <div
          className="text-white h-[180px] flex flex-col justify-center items-center rounded-t-xl rounded-b cursor-pointer"
          style={{
            background: `url(${require("../../Assets/Images/cta-bg-3.webp")}) no-repeat center center / cover `,
          }}
          onClick={() => onCategorySelect("Biscuits & Cakes")}
        >
          <h2 className="text-lg font-bold text-center text-gray-100">
            Taste of <br />
            <span className="text-2xl text-white">Bread & Bakery</span>
          </h2>
          <p className="text-sm">Weekend discount offer</p>
          <button className="bg-[#10b981] text-white text-xs px-5 py-2 rounded-full mt-5">
            Shop Now
          </button>
        </div>
      </div>
    </>
  );
};

export default CategCard;
