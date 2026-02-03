import React, { useEffect, useRef, useState } from "react";
import Veg1 from "../Assets/Images/vecteezy_a-vibrant-assortment-of-fresh-fruits-and-vegetables-isolated_46822441.png";
import Veg2 from "../Assets/Images/vecteezy_vegetable-png-transparent_22984730.png";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, HelpCircle } from "lucide-react";

const faqData = [
  {
    question: "How long does delivery take?",
    answer:
      "Our standard delivery takes 24-48 hours. If you order before 12 PM, we offer same-day delivery for select organic vegetables within the city limits.",
  },
  {
    question: "Is your produce 100% organic?",
    answer:
      "Yes! All our vegetables are sourced directly from certified organic farms that follow sustainable and chemical-free farming practices.",
  },
  {
    question: "What is your return policy?",
    answer:
      "Since we deal with perishables, we offer a 'no-questions-asked' refund or replacement if the quality is not up to the mark upon delivery.",
  },
  {
    question: "Do I need to create an account to order?",
    answer:
      "You can browse as a guest, but creating an account helps you track orders, save favorites, and earn loyalty points for future discounts.",
  },
];

const FAQs = () => {
  const ref = useRef(null);
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView();
    }
  }, []);
  return (
    <div ref={ref} className="contact">
      <div className="About-us flex justify-between items-center h-44">
        <img src={Veg1} alt="" />
        <h1 className="text-5xl font-medium">FAQs</h1>
        <img src={Veg2} alt="" />
      </div>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 py-20">
        <div className="max-w-6xl w-full bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-gray-100">
          {/* Left Side: Image Section */}
          <div className="md:w-1/2 relative min-h-[400px]">
            <img
              src="https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1074&q=80"
              alt="Organic Vegetables"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-green-900/80 to-transparent flex flex-col justify-end p-12 text-white">
              <div className="bg-white/20 backdrop-blur-md p-6 rounded-2xl border border-white/30">
                <h2 className="text-3xl font-bold mb-2">Have Questions?</h2>
                <p className="text-green-50 opacity-90">
                  We're here to help you get the freshest organic vegetables
                  delivered to your doorstep.
                </p>
              </div>
            </div>
          </div>

          {/* Right Side: Accordion Section */}
          <div className="md:w-1/2 p-8 md:p-12 lg:p-16 overflow-y-auto">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-green-100 rounded-xl">
                <HelpCircle className="text-green-600 w-6 h-6" />
              </div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                General FAQs
              </h1>
            </div>

            <div className="space-y-4">
              {faqData.map((item, index) => (
                <div
                  key={index}
                  className={`border rounded-2xl transition-all duration-300 ${
                    activeIndex === index
                      ? "border-green-500 bg-green-50/30"
                      : "border-gray-200"
                  }`}
                >
                  <button
                    onClick={() => toggleAccordion(index)}
                    className="w-full flex items-center justify-between p-5 text-left outline-none"
                  >
                    <span
                      className={`font-bold text-lg ${activeIndex === index ? "text-green-700" : "text-gray-700"}`}
                    >
                      {item.question}
                    </span>
                    <div
                      className={`p-1 rounded-full ${activeIndex === index ? "bg-green-500 text-white" : "bg-gray-100 text-gray-500"}`}
                    >
                      {activeIndex === index ? (
                        <Minus size={18} />
                      ) : (
                        <Plus size={18} />
                      )}
                    </div>
                  </button>

                  <AnimatePresence>
                    {activeIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="p-5 pt-0 text-gray-600 leading-relaxed border-t border-green-100 mt-2 italic">
                          {item.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            <div className="mt-10 p-6 bg-gray-50 rounded-2xl border border-dashed border-gray-300 text-center">
              <p className="text-gray-500 text-sm">
                Still have questions? Reach out to our support team.
              </p>
              <button className="mt-3 text-green-600 font-bold hover:underline">
                Contact Support →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQs;
