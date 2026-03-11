import React, { useState } from "react";
import {
  FaQuestionCircle,
  FaBook,
  FaEnvelope,
  FaPhone,
  FaComment,
  FaSearch,
  FaChevronDown,
  FaChevronUp,
  FaVideo,
  FaFileAlt,
  FaLifeRing,
  FaTicketAlt,
  FaExternalLinkAlt,
  FaClock,
  FaCheckCircle,
} from "react-icons/fa";

const HelpSupport = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFaq, setExpandedFaq] = useState(null);

  const faqs = [
    {
      id: 1,
      category: "Getting Started",
      question: "How do I add a new product?",
      answer:
        "To add a new product, navigate to Products Management from the sidebar. Click the 'Add Product' button, fill in the product details including name, price, category, and stock quantity. You can also add product images and descriptions.",
    },
    {
      id: 2,
      category: "Orders",
      question: "How do I update order status?",
      answer:
        "Go to Orders Management, find the order you want to update. Click on the status dropdown and select the new status. The order will be automatically updated in the system.",
    },
    {
      id: 3,
      category: "Products",
      question: "How do I manage product categories?",
      answer:
        "Navigate to Categories Management to create, edit, or delete categories. You can add subcategories and product images to make your catalog more organized.",
    },
    {
      id: 4,
      category: "Users",
      question: "How do I change user roles?",
      answer:
        "In Users Management, find the user you want to modify. Click on the role button and select the new role (Admin, Moderator, or User).",
    },
    {
      id: 5,
      category: "Coupons",
      question: "How do I create discount coupons?",
      answer:
        "Go to Coupons Management and click 'Create Coupon'. Set the discount percentage, validity dates, and any usage limits. Customers can then use these codes at checkout.",
    },
    {
      id: 6,
      category: "Account",
      question: "How do I update my profile?",
      answer:
        "Click on your profile icon in the top right corner and select 'Settings'. You can update your name, email, phone number, and password from the Profile tab.",
    },
  ];

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.category.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const supportOptions = [
    {
      icon: FaComment,
      title: "Live Chat",
      description: "Chat with our support team",
      color: "bg-green-100 text-green-600",
      action: "Start Chat",
    },
    {
      icon: FaEnvelope,
      title: "Email Support",
      description: "Get help via email",
      color: "bg-blue-100 text-blue-600",
      action: "Send Email",
    },
    {
      icon: FaPhone,
      title: "Phone Support",
      description: "Mon-Fri, 9am-6pm",
      color: "bg-purple-100 text-purple-600",
      action: "Call Now",
    },
    {
      icon: FaTicketAlt,
      title: "Submit Ticket",
      description: "Create a support ticket",
      color: "bg-orange-100 text-orange-600",
      action: "Create Ticket",
    },
  ];

  const helpResources = [
    {
      icon: FaBook,
      title: "Documentation",
      description: "Complete guide and tutorials",
      link: "#",
    },
    {
      icon: FaVideo,
      title: "Video Tutorials",
      description: "Watch how-to videos",
      link: "#",
    },
    {
      icon: FaFileAlt,
      title: "Release Notes",
      description: "Latest updates and features",
      link: "#",
    },
    {
      icon: FaLifeRing,
      title: "Community Forum",
      description: "Connect with other users",
      link: "#",
    },
  ];

  const toggleFaq = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
            Help & Support
          </h1>
          <p className="text-gray-500 mt-1">
            Find answers and get help with our platform
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-gradient-to-r from-[#10b981] to-green-600 rounded-2xl p-6 lg:p-8">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            How can we help you today?
          </h2>
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search for help..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl border-0 focus:ring-2 focus:ring-[#10b981] outline-none text-gray-800"
            />
          </div>
        </div>
      </div>

      {/* Quick Support Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {supportOptions.map((option, index) => {
          const Icon = option.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className={`p-3 rounded-xl ${option.color}`}>
                  <Icon size={20} />
                </div>
                <FaExternalLinkAlt className="text-gray-400" size={14} />
              </div>
              <h3 className="font-semibold text-gray-800 mt-3">
                {option.title}
              </h3>
              <p className="text-sm text-gray-500 mt-1">{option.description}</p>
              <button className="mt-4 text-sm text-[#10b981] hover:text-green-700 font-medium">
                {option.action}
              </button>
            </div>
          );
        })}
      </div>

      {/* Help Resources */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <FaBook className="mr-3 text-[#10b981]" />
          Quick Resources
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {helpResources.map((resource, index) => {
            const Icon = resource.icon;
            return (
              <a
                key={index}
                href={resource.link}
                className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className="p-2 bg-[#10b981]/10 rounded-lg mr-3">
                  <Icon className="text-[#10b981]" size={18} />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 text-sm">
                    {resource.title}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {resource.description}
                  </p>
                </div>
              </a>
            );
          })}
        </div>
      </div>

      {/* FAQs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
          <FaQuestionCircle className="mr-3 text-[#10b981]" />
          Frequently Asked Questions
        </h2>

        <div className="space-y-3">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq) => (
              <div
                key={faq.id}
                className="border border-gray-200 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-left"
                >
                  <div>
                    <span className="text-xs text-[#10b981] font-medium">
                      {faq.category}
                    </span>
                    <h3 className="font-medium text-gray-800 mt-1">
                      {faq.question}
                    </h3>
                  </div>
                  {expandedFaq === faq.id ? (
                    <FaChevronUp className="text-gray-400" />
                  ) : (
                    <FaChevronDown className="text-gray-400" />
                  )}
                </button>
                {expandedFaq === faq.id && (
                  <div className="px-4 pb-4">
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <FaQuestionCircle className="mx-auto text-4xl text-gray-300 mb-3" />
              <p className="text-gray-500">No matching FAQs found</p>
            </div>
          )}
        </div>
      </div>

      {/* Contact Info */}
      <div className="bg-gray-50 rounded-xl p-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#10b981]/10 rounded-xl">
              <FaClock className="text-[#10b981]" size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Support Hours</h3>
              <p className="text-sm text-gray-500">
                Monday - Friday: 9:00 AM - 6:00 PM
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FaCheckCircle className="text-green-500" />
            <span>Average response time: 24 hours</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpSupport;
