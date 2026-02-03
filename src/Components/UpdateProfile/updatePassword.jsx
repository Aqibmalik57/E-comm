import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MyProfile, updatePassword } from "../../store/feature/userSlice";
import { FaEye, FaEyeSlash, FaArrowLeft } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const UpdatePassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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

    dispatch(updatePassword(info)).then((res) => {
      // Only refresh profile if update was successful
      if (!res.error) dispatch(MyProfile());
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full max-w-md overflow-hidden">
        <div className="p-6 sm:p-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-500 hover:text-[#10b981] mb-6 transition-colors"
          >
            <FaArrowLeft className="mr-2" /> Back
          </button>

          <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-gray-800 text-center">
            Security
          </h2>
          <p className="text-gray-500 mb-8 text-sm text-center">
            Update your password to keep your account secure
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Old Password */}
            <div>
              <label className="block text-gray-700 text-xs font-bold uppercase tracking-wider mb-2">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showOldPassword ? "text" : "password"}
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#10b981] focus:border-transparent outline-none transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-[#10b981]"
                >
                  {showOldPassword ? (
                    <FaEyeSlash size={18} />
                  ) : (
                    <FaEye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-gray-700 text-xs font-bold uppercase tracking-wider mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#10b981] focus:border-transparent outline-none transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-[#10b981]"
                >
                  {showPassword ? (
                    <FaEyeSlash size={18} />
                  ) : (
                    <FaEye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-gray-700 text-xs font-bold uppercase tracking-wider mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#10b981] focus:border-transparent outline-none transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-[#10b981]"
                >
                  {showConfirmPassword ? (
                    <FaEyeSlash size={18} />
                  ) : (
                    <FaEye size={18} />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#10b981] text-white py-3 mt-4 rounded-xl font-bold hover:bg-green-700 transition-all shadow-lg shadow-green-100 active:scale-[0.98]"
            >
              Update Password
            </button>

            {error && (
              <div className="bg-red-50 text-red-500 text-xs p-3 rounded-lg text-center font-medium">
                {error}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdatePassword;
