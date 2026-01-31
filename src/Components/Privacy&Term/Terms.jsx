import React, { useEffect, useRef } from "react";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import Veg1 from "../../Assets/Images/vecteezy_a-vibrant-assortment-of-fresh-fruits-and-vegetables-isolated_46822441.png";
import Veg2 from "../../Assets/Images/vecteezy_vegetable-png-transparent_22984730.png";

const Terms = () => {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView();
    }
  }, []);

  return (
    <div ref={ref} className="terms-conditions bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="About-us flex justify-between items-center h-44">
        <img src={Veg1} alt="" />
        <h1 className="text-5xl font-medium">Term & Conditions</h1>
        <img src={Veg2} alt="" />
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto py-12 px-6 text-gray-700 leading-relaxed">
        <section className="space-y-10">
          {/* Welcome Section */}
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">
              Welcome to KachaBazar!
            </h2>
            <p className="mb-4">
              These terms and conditions outline the rules and regulations for
              the use of KachaBazar's Website, located at{" "}
              <a
                href="https://kachabazar.com/"
                className="text-green-600 hover:underline"
              >
                https://kachabazar.com/
              </a>
              .
            </p>
            <p className="bg-green-50 border-l-4 border-green-500 p-4">
              By accessing this website we assume you accept these terms and
              conditions. Do not continue to use KachaBazar if you do not agree
              to take all of the terms and conditions stated on this page.
            </p>
          </div>

          {/* Terminology Section */}
          <div className="text-sm bg-white p-6 rounded-lg border border-gray-200">
            <p>
              <strong>Terminology:</strong> "Client", "You" and "Your" refers to
              you, the person log on this website. "The Company", "Ourselves",
              "We", "Our" and "Us", refers to our Company. These terms refer to
              the offer, acceptance and consideration of payment necessary to
              undertake the process of our assistance to the Client in
              accordance with prevailing law of Netherlands.
            </p>
          </div>

          {/* Cookies */}
          <div>
            <h3 className="text-xl font-bold mb-2">Cookies</h3>
            <p>
              We employ the use of cookies. By accessing KachaBazar, you agreed
              to use cookies in agreement with the KachaBazar's Privacy Policy.
              Most interactive websites use cookies to let us retrieve the
              user’s details for each visit.
            </p>
          </div>

          {/* License */}
          <div>
            <h3 className="text-xl font-bold mb-2">License</h3>
            <p className="mb-4">
              Unless otherwise stated, KachaBazar and/or its licensors own the
              intellectual property rights for all material on KachaBazar. All
              intellectual property rights are reserved. You must not:
            </p>
            <ul className="list-disc pl-8 space-y-2 text-gray-600 italic">
              <li>
                Identifiers (e.g. name, mailing address, email address, phone
                number)
              </li>
              <li>
                Characteristics of protected classifications (e.g. gender, age)
              </li>
              <li>Commercial information (e.g. purchase history)</li>
              <li>Internet or other electronic network activity</li>
              <li>Geo location data (e.g. latitude or longitude)</li>
            </ul>
          </div>

          {/* Comments Section */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-xl font-bold mb-2">User Comments</h3>
            <p className="text-sm">
              KachaBazar does not filter, edit, publish or review Comments prior
              to their presence on the website. Comments do not reflect the
              views and opinions of KachaBazar, its agents and/or affiliates. To
              the extent permitted by applicable laws, KachaBazar shall not be
              liable for the Comments.
            </p>
          </div>

          {/* Disclaimer Section */}
          <div>
            <h3 className="text-xl font-bold mb-2">Disclaimer</h3>
            <p className="mb-4">
              To the maximum extent permitted by applicable law, we exclude all
              representations, warranties and conditions relating to our
              website. Nothing in this disclaimer will:
            </p>
            <ul className="list-decimal pl-8 space-y-2">
              <li>
                Limit or exclude our or your liability for death or personal
                injury;
              </li>
              <li>
                Limit or exclude our or your liability for fraud or fraudulent
                misrepresentation;
              </li>
              <li>
                Limit any of our or your liabilities in any way that is not
                permitted under applicable law.
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Terms;
