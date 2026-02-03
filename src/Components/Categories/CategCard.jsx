import React from "react";

const CategCard = ({ onCategorySelect }) => {
  return (
    <>
      {/* - Changed grid-cols-3 to grid-cols-1 for mobile
          - Added sm:grid-cols-2 for tablets
          - Added lg:grid-cols-3 to preserve your original desktop design
          - Changed mx-11 to mx-4 on mobile 
      */}
      <div className="mx-4 md:mx-11 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
        {/* Card 1 */}
        <div
          className="text-white h-[180px] flex flex-col justify-center items-center rounded-xl cursor-pointer hover:opacity-90 transition-opacity"
          style={{
            background: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.2)), url(${require("../../Assets/Images/cta-bg-1.webp")}) no-repeat center center / cover `,
          }}
          onClick={() => onCategorySelect("Fruits & Vegetables")}
        >
          <h2 className="text-base md:text-lg font-bold text-center text-gray-100 leading-tight">
            Taste of <br />
            <span className="text-xl md:text-2xl text-white">
              Fresh & Natural
            </span>
          </h2>
          <p className="text-xs md:text-sm mt-1">Weekend discount offer</p>
          <button className="bg-[#10b981] text-white text-xs px-5 py-2 rounded-full mt-4 hover:bg-[#059669] transition-colors">
            Shop Now
          </button>
        </div>

        {/* Card 2 */}
        <div
          className="text-white h-[180px] flex flex-col justify-center items-center rounded-xl cursor-pointer hover:opacity-90 transition-opacity"
          style={{
            background: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.2)), url(${require("../../Assets/Images/cta-bg-2.webp")}) no-repeat center center / cover `,
          }}
          onClick={() => onCategorySelect("Fish & Meat")}
        >
          <h2 className="text-base md:text-lg font-bold text-center text-gray-100 leading-tight">
            Taste of <br />
            <span className="text-xl md:text-2xl text-white">Fish & Meat</span>
          </h2>
          <p className="text-xs md:text-sm mt-1">Weekend discount offer</p>
          <button className="bg-[#10b981] text-white text-xs px-5 py-2 rounded-full mt-4 hover:bg-[#059669] transition-colors">
            Shop Now
          </button>
        </div>

        {/* Card 3 */}
        <div
          className="text-white h-[180px] flex flex-col justify-center items-center rounded-xl cursor-pointer hover:opacity-90 transition-opacity sm:col-span-2 lg:col-span-1"
          style={{
            background: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.2)), url(${require("../../Assets/Images/cta-bg-3.webp")}) no-repeat center center / cover `,
          }}
          onClick={() => onCategorySelect("Biscuits & Cakes")}
        >
          <h2 className="text-base md:text-lg font-bold text-center text-gray-100 leading-tight">
            Taste of <br />
            <span className="text-xl md:text-2xl text-white">
              Bread & Bakery
            </span>
          </h2>
          <p className="text-xs md:text-sm mt-1">Weekend discount offer</p>
          <button className="bg-[#10b981] text-white text-xs px-5 py-2 rounded-full mt-4 hover:bg-[#059669] transition-colors">
            Shop Now
          </button>
        </div>
      </div>
    </>
  );
};

export default CategCard;
