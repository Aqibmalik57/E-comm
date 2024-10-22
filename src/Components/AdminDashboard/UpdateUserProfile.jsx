import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa6";
import { editUserProfile } from "../../store/feature/userSlice";

const UpdateUserProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, error } = useSelector((state) => state.user);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");

  const handleSubmit = (e) => {
    e.preventDefault();

    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    } else if (name.length < 3) {
      toast.error("Name should be at least 3 characters long");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      toast.error("Email is required");
      return;
    } else if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    const updatedInfo = {
      id: user._id,
      name,
      email,
    };

    dispatch(editUserProfile(updatedInfo));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <FaArrowLeft
        className="absolute top-5 left-5 text-2xl text-[#10b981] cursor-pointer"
        onClick={() => navigate(-1)}
      />
      <div className="w-1/2 max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">
          Update Name & Email
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="block text-gray-600 font-medium mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your new name"
              className="border border-gray-300 rounded-md w-full p-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
              required
            />
          </div>
          <div className="mb-5">
            <label className="block text-gray-600 font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your new email"
              className="border border-gray-300 rounded-md w-full p-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#10b981] text-white py-2 rounded-md hover:bg-green-700 transition duration-200"
          >
            Update Profile
          </button>
          {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default UpdateUserProfile;
