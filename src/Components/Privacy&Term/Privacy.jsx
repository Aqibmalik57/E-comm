import React, { useEffect, useRef } from "react";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import Veg1 from "../../Assets/Images/vecteezy_a-vibrant-assortment-of-fresh-fruits-and-vegetables-isolated_46822441.png";
import Veg2 from "../../Assets/Images/vecteezy_vegetable-png-transparent_22984730.png";

const Privacy = () => {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView();
    }
  }, []);

  return (
    <div ref={ref} className="privacy-page bg-gray-50">
      <div className="About-us flex justify-between items-center h-44">
        <img src={Veg1} alt="" />
        <h1 className="text-5xl font-medium">Privacy Policy</h1>
        <img src={Veg2} alt="" />
      </div>

      {/* Content Section */}
      <div className="max-w-5xl mx-auto py-16 px-6 text-gray-700 leading-relaxed">
        <p className="mb-4 font-semibold">Last updated: February 15, 2022</p>

        <section className="space-y-8">
          <div>
            <p>
              At <strong>KachaBazar</strong>, accessible from kachabazar.com,
              one of our main priorities is the privacy of our visitors. This
              Privacy Policy document contains types of information that is
              collected and recorded by KachaBazar and how we use it. If you
              have additional questions or require more information about our
              Privacy Policy, do not hesitate to contact us.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Consent</h2>
            <p>
              By using our website, you hereby consent to our Privacy Policy and
              agree to its terms.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Information we collect
            </h2>
            <p className="mb-4">
              The personal information that you are asked to provide, and the
              reasons why you are asked to provide it, will be made clear to you
              at the point we ask you to provide your personal information.
            </p>
            <p className="mb-4">
              If you contact us directly, we may receive additional information
              about you such as your name, email address, phone number, the
              contents of the message and/or attachments you may send us. When
              you register for an Account, we may ask for your contact
              information, including items such as name, company name, address,
              email address, and telephone number.
            </p>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 italic">
              Please note that the Company will not ask you to share any
              sensitive data or information via email or telephone.
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              How we use your information
            </h2>
            <ul className="list-decimal pl-6 space-y-2">
              <li>
                Provide, operate, and maintain our website and provide updates.
              </li>
              <li>Improve, personalize, and expand our website.</li>
              <li>Understand and analyze how you use our website.</li>
              <li>
                Develop new products, services, features, and functionality.
              </li>
              <li>Communicate with you for customer service and updates.</li>
              <li>Send you emails for marketing and promotional purposes.</li>
              <li>Find and prevent fraud.</li>
            </ul>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-xl font-bold mb-3">Log Files</h3>
              <p className="text-sm">
                KachaBazar follows a standard procedure of using log files.
                Information collected includes IP addresses, browser type, ISP,
                date/time stamps, and referring pages. These are not linked to
                personally identifiable information.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-xl font-bold mb-3">CCPA Rights</h3>
              <p className="text-sm">
                California consumers have the right to request data disclosure,
                deletion, and to opt-out of the sale of personal data. We have
                one month to respond to your request.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Children's Information
            </h2>
            <p>
              We do not knowingly collect any Personal Identifiable Information
              from children under the age of 13. If you think your child
              provided this information, please contact us immediately to remove
              it from our records.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Privacy;
