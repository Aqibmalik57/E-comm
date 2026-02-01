import React from "react";
import { Link } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import { AiOutlineWarning } from "react-icons/ai";

const NotFound = () => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-r from-blue-50 to-green-100">
      {/* Icon and 404 Heading */}
      <div className="flex items-center space-x-4 mb-4">
        <AiOutlineWarning className="text-red-500 text-6xl" />
        <h1 className="text-8xl font-extrabold text-green-600">404</h1>
      </div>

      {/* Error Message */}
      <p className="text-2xl text-gray-700 mb-6">
        Oops! The page you're looking for doesn't exist.
      </p>

      {/* Button to Go Back Home */}
      <Link
        to="/"
        className="flex items-center px-6 py-3 bg-[#0da371] text-white rounded-full hover:bg-green-600 transition duration-300"
      >
        <FaHome className="mr-3" />
        Go Back & Login your account
      </Link>

      <div className="mt-10 w-full flex justify-center space-x-6 text-green-600">
        <div className="w-8 h-8 bg-[#0da371] rounded-full animate-bounce"></div>
        <div className="w-8 h-8 bg-green-400 rounded-full animate-bounce delay-100"></div>
        <div className="w-8 h-8 bg-green-500 rounded-full animate-bounce delay-200"></div>
      </div>
    </div>
  );
};

export default NotFound;
