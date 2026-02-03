import React, { useEffect, useRef } from "react";
import "./about.css";
import Veg1 from "../../Assets/Images/vecteezy_a-vibrant-assortment-of-fresh-fruits-and-vegetables-isolated_46822441.png";
import Veg2 from "../../Assets/Images/vecteezy_vegetable-png-transparent_22984730.png";
import Veg3 from "../../Assets/Images/pexels-photo-27175861.webp";
import Veg4 from "../../Assets/Images/free-photo-of-woman-doing-grocery-shopping.jpeg";
import Veg5 from "../../Assets/Images/free-photo-of-vegetables-in-grocery-store.jpeg";
import Veg6 from "../../Assets/Images/sl8vzvzm54jgzq6sphn2.webp";
import Pers1 from "../../Assets/Images/team-1_acjmv7.webp";
import Pers2 from "../../Assets/Images/team-2_dw7zs1.webp";
import Pers3 from "../../Assets/Images/team-3_ld3323.webp";
import Pers4 from "../../Assets/Images/team-4_i7jvx7.webp";
import Pers5 from "../../Assets/Images/team-5_ylyklw.webp";
import Pers6 from "../../Assets/Images/team-6_gmlts4.webp";

const About = () => {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView();
    }
  }, []);

  return (
    <>
      <div ref={ref} className="About overflow-hidden">
        {/* Banner Section */}
        <div className="About-us flex justify-center sm:justify-between items-center h-32 lg:h-44 bg-[#fdf2f2] lg:bg-transparent px-4">
          <img src={Veg1} alt="" className="h-20 lg:h-auto sm:block hidden" />
          <h1 className="text-3xl lg:text-5xl font-medium">About Us</h1>
          <img src={Veg2} alt="" className="h-20 lg:h-auto sm:block hidden" />
        </div>

        {/* Shop Detail Section */}
        <div className="shop-detail grid grid-cols-1 lg:grid-cols-2 min-h-fit lg:min-h-[100vh]">
          <div className="h-full flex flex-col justify-center p-6 lg:p-11 pb-4">
            <h1 className="mb-5 text-2xl lg:text-3xl font-medium">
              Welcome to our KachaBazar shop
            </h1>
            <p className="text-base lg:text-lg text-neutral-700 font-normal para-font">
              Holisticly seize parallel metrics and functional ROI. Seamlessly
              revolutionize error-free internal or organic sources before
              effective scenarios. Progressively incentivize state of the art
              applications for efficient intellectual capital. Credibly leverage
              existing distinctive mindshare through cutting-edge schemas.
              Proactively procrastinate team building paradigms coordinate
              client-centric total transparent internal.
            </p>

            {/* Stats Grid */}
            <div className="grid gap-4 lg:gap-7 grid-cols-1 sm:grid-cols-2 mt-7">
              <div className="bg-[#eef2ff] p-6 rounded-xl">
                <h1 className="text-3xl font-extrabold leading-relaxed">8K</h1>
                <h4 className="text-xl font-[550] leading-relaxed">
                  Lovely Customer
                </h4>
                <p className="para-font font-normal text-sm">
                  Competently productize virtual models without performance.
                </p>
              </div>
              <div className="bg-[#eef2ff] p-6 rounded-xl">
                <h1 className="text-3xl font-extrabold leading-relaxed">10K</h1>
                <h4 className="text-xl font-[550] leading-relaxed">
                  Listed Products
                </h4>
                <p className="para-font font-normal text-sm">
                  Dynamically morph team driven partnerships after vertical.
                </p>
              </div>
            </div>
          </div>

          {/* Image Collage Section */}
          <div className="h-full p-6 lg:pe-11 shop-detail-sub2 gap-4 flex items-center justify-center">
            <div className="grid grid-rows-2 gap-4 w-1/2">
              <img
                src={Veg3}
                alt=""
                className="rounded-2xl w-full object-cover"
              />
              <img
                src={Veg4}
                alt=""
                className="rounded-2xl w-full object-cover"
              />
            </div>
            <div className="w-1/2">
              <img
                src={Veg5}
                alt=""
                className="rounded-2xl w-full object-cover h-full"
              />
            </div>
          </div>
        </div>

        {/* Text and Large Image Section */}
        <div className="more-detail p-6 py-0 lg:p-11 lg:pt-0">
          <p className="text-base lg:text-lg text-neutral-700 font-normal para-font mb-5">
            Holisticly seize parallel metrics and functional ROI. Seamlessly
            revolutionize error-free internal or organic sources before
            effective scenarios. Progressively incentivize state of the art
            applications for efficient intellectual capital. Credibly leverage
            existing distinctive mindshare through cutting-edge schemas.
          </p>
          <p className="text-base lg:text-lg text-neutral-700 font-normal para-font mb-10 lg:mb-14">
            Appropriately visualize market-driven data before one-to-one
            scenarios. Collaboratively productize multifunctional ROI through
            intuitive supply chains. Enthusiastically seize revolutionary value
            and process-centric services.
          </p>
          <img src={Veg6} alt="" className="rounded-2xl w-full" />
        </div>

        {/* Team Section */}
        <div className="Our-team min-h-fit lg:min-h-[90vh] bg-[#f9fafb] mt-7 flex flex-col justify-center p-6 lg:p-11">
          <h1 className="text-3xl lg:text-5xl font-bold mb-5">Our Team</h1>
          <p className="w-full lg:w-3/5 para-font text-base lg:text-lg font-normal">
            We’re impartial and independent, and every day we create
            distinctive, world-class reintermediate backend supply programmes.
          </p>

          {/* Team Grid: 2 cols on mobile, 3 on tablet, 6 on desktop */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 lg:gap-8 mt-8">
            {[
              {
                img: Pers1,
                name: "Niamh Shea",
                role: "Co-founder & Executive",
              },
              { img: Pers2, name: "Orla Dwyer", role: "Marketing Lead" },
              {
                img: Pers3,
                name: "Danien James",
                role: "Co-founder, Chairman",
              },
              {
                img: Pers4,
                name: "Dara Frazier",
                role: "Chief Strategy Officer",
              },
              { img: Pers5, name: "Glenda Arvidson", role: "HR Officer" },
              { img: Pers6, name: "Melvin Davis", role: "Lead Developer" },
            ].map((member, idx) => (
              <div key={idx} className="leading-7 text-center lg:text-left">
                <img
                  src={member.img}
                  alt={member.name}
                  className="rounded-lg w-full"
                />
                <h1 className="font-bold text-lg lg:text-xl mt-4">
                  {member.name}
                </h1>
                <p className="text-neutral-500 text-sm">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
