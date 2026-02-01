import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MyProfile, updatePassword } from "../../store/feature/userSlice";
import { FaEye, FaEyeSlash } from "react-icons/fa6";

const UpdatePassword = () => {
  const dispatch = useDispatch();
  const { error } = useSelector((state) => state.user);
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    const info = {
      oldPassword,
      Password: password,
      ConfirmPassword: confirmPassword,
    };

    dispatch(updatePassword(info)).then(() => {
      dispatch(MyProfile());
    });
  };

  return (
    <div className="flex items-center justify-center min-h-max bg-gray-100 py-10">
      <div className="w-1/2 max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-[#10b981] mb-6 text-center">
          Update Password
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="block text-gray-700 font-medium mb-2">
              Old Password
            </label>
            <div className="relative">
              <input
                type={showOldPassword ? "text" : "password"}
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Enter your old password"
                className="border border-gray-300 rounded-md w-full p-3 focus:outline-none focus:ring-2 focus:ring-[#10b981] transition duration-200"
                required
              />
              <span
                onClick={() => setShowOldPassword(!showOldPassword)}
                className="absolute top-[18px] right-0 pr-4 flex items-center cursor-pointer"
              >
                {showOldPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>
          <div className="mb-5">
            <label className="block text-gray-700 font-medium mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your new password"
                className="border border-gray-300 rounded-md w-full p-3 focus:outline-none focus:ring-2 focus:ring-[#10b981] transition duration-200"
                required
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-[18px] right-0 pr-4 flex items-center cursor-pointer"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>
          <div className="mb-5">
            <label className="block text-gray-700 font-medium mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your new password"
                className="border border-gray-300 rounded-md w-full p-3 focus:outline-none focus:ring-2 focus:ring-[#10b981] transition duration-200"
                required
              />
              <span
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute top-[18px] right-0 pr-4 flex items-center cursor-pointer"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-[#10b981] text-white py-2 rounded-md hover:bg-green-700 transition duration-200"
          >
            Update Password
          </button>
          {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default UpdatePassword;
