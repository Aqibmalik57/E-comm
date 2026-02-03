import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Veg1 from "../../Assets/Images/vecteezy_a-vibrant-assortment-of-fresh-fruits-and-vegetables-isolated_46822441.png";
import Veg2 from "../../Assets/Images/vecteezy_vegetable-png-transparent_22984730.png";
import { MdOutlineMailOutline } from "react-icons/md";
import { FiBell } from "react-icons/fi";
import { GrLocation } from "react-icons/gr";
import contact from "../../Assets/Images/contact-us.webp";

const Contact = () => {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView();
    }
  }, []);

  return (
    <>
      <div ref={ref} className="contact overflow-hidden">
        {/* Banner Section */}
        <div className="About-us flex justify-center sm:justify-between items-center h-32 lg:h-44 bg-[#fdf2f2] lg:bg-transparent px-4">
          <img src={Veg1} alt="" className="h-20 lg:h-auto sm:block hidden" />
          <h1 className="text-3xl lg:text-5xl font-medium">Contact Us</h1>
          <img src={Veg2} alt="" className="h-20 lg:h-auto sm:block hidden" />
        </div>

        {/* Contact Cards: 1 col on mobile, 3 on LG */}
        <div className="contact-cards flex flex-col lg:flex-row justify-evenly p-6 lg:p-10 mt-5 lg:mt-10 gap-6">
          <div className="flex flex-col items-center justify-center py-10 px-8 border-gray-300 rounded-md border text-center">
            <MdOutlineMailOutline className="text-4xl mb-4 text-[#3cc598]" />
            <h1 className="text-2xl font-bold mb-3">Email Us</h1>
            <p className="text-md w-full sm:w-72 leading-7 font-[450]">
              <Link to="" className="text-[#47c99e] font-medium">
                info@kachabazar.com
              </Link>{" "}
              Interactively grow empowered for process-centric total linkage.
            </p>
          </div>

          <div className="flex flex-col items-center justify-center py-10 px-8 border-gray-300 rounded-md border text-center">
            <FiBell className="text-4xl mb-4 text-[#3cc598]" />
            <h1 className="text-2xl font-bold mb-3">Call Us</h1>
            <p className="text-md w-full sm:w-72 leading-7 font-[450]">
              <Link to="" className="text-[#47c99e] font-medium">
                029-00124667
              </Link>{" "}
              Distinctively disseminate focused solutions clicks-and-mortar
              ministate.
            </p>
          </div>

          <div className="flex flex-col items-center justify-center py-10 px-8 border-gray-300 rounded-md border text-center">
            <GrLocation className="text-4xl mb-4 text-[#3cc598]" />
            <h1 className="text-2xl font-bold mb-3">Location</h1>
            <div className="text-md w-full sm:w-72 leading-7 font-[450]">
              <p>
                Boho One, Bridge Street West, Middlesbrough, North Yorkshire,
                TS2 1AE.
              </p>
              <p>561-4535 Nulla LA</p>
              <p>United States 96522.</p>
            </div>
          </div>
        </div>

        {/* Form Section: Stacks on mobile, 2 cols on LG */}
        <div className="contact-form grid grid-cols-1 lg:grid-cols-2 p-6 lg:p-10 pt-11 mb-12 gap-10">
          <div className="flex justify-center items-center">
            <img
              src={contact}
              alt="Contact"
              className="w-full max-w-[550px] h-auto"
            />
          </div>

          <div className="lg:ps-6">
            <h1 className="font-bold text-3xl lg:text-4xl text-center lg:text-left">
              For any support just send your query
            </h1>
            <p className="text-lg mt-5 text-center lg:text-left text-neutral-600">
              Collaboratively promote client-focused convergence vis-a-vis
              customer-directed alignments via plagiarized strategic users and
              standardized infrastructures.
            </p>

            <form action="" className="mt-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-[#7c82a4]">Your Name</label>
                  <input
                    type="text"
                    name="name"
                    className="p-3 mt-2 border w-full border-gray-[#a2aabd] rounded-md outline-[0.1px] outline-[#47c99e]"
                    placeholder="Enter Your Name"
                    required
                  />
                </div>
                <div>
                  <label className="text-[#7c82a4]">Your Email</label>
                  <input
                    type="email"
                    name="email"
                    className="p-3 mt-2 border w-full border-gray-[#a2aabd] rounded-md outline-[0.1px] outline-[#47c99e]"
                    placeholder="Enter Your Email"
                    required
                  />
                </div>
              </div>
              <div className="mt-4 mb-4">
                <label className="text-[#7c82a4]">Subject</label>
                <input
                  type="text"
                  name="subject"
                  className="p-3 mt-2 border w-full border-gray-[#a2aabd] rounded-md outline-[0.1px] outline-[#47c99e]"
                  placeholder="Enter your subject"
                />
              </div>
              <div>
                <label className="text-[#7c82a4]">Message</label>
                <textarea
                  name="message"
                  rows="4"
                  className="p-3 mt-2 border w-full border-gray-[#a2aabd] rounded-md outline-[0.1px] outline-[#47c99e]"
                  placeholder="Write your message here...."
                ></textarea>
              </div>

              <div className="flex justify-center lg:justify-start">
                <button className="bg-[#10b981] font-medium text-white mt-6 px-10 py-3 rounded-md w-full sm:w-auto hover:bg-[#059669] transition-colors">
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
