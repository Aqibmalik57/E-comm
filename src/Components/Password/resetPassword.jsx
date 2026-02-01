import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword } from "../../store/feature/userSlice";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import eye icons

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State for confirm password visibility

  const { loading } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const { token } = useParams();

  const validatePasswords = () => {
    if (!password || !confirmPassword) {
      setPasswordError("Both password fields are required");
      return false;
    } else if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return false;
    } else if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (validatePasswords()) {
      dispatch(
        resetPassword({ token, newPassword: password, confirmPassword }),
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-[#10b981]">
          Reset Password
        </h2>
        <p className="text-gray-600 mb-6 text-center">
          Please enter your new password.
        </p>
        <form onSubmit={handleResetPassword}>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-semibold mb-2"
              htmlFor="password"
            >
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"} // Toggle password visibility
                id="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${
                  passwordError ? "border-red-500" : "border-gray-300"
                } focus:ring-[#10b981]`}
                required
              />
              <span
                onClick={() => setShowPassword(!showPassword)} // Toggle state on click
                className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-semibold mb-2"
              htmlFor="confirm-password"
            >
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"} // Toggle confirm password visibility
                id="confirm-password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${
                  passwordError ? "border-red-500" : "border-gray-300"
                } focus:ring-[#10b981]`}
                required
              />
              <span
                onClick={() => setShowConfirmPassword(!showConfirmPassword)} // Toggle state on click
                className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            {passwordError && (
              <div className="text-red-500 text-sm mt-1">{passwordError}</div>
            )}
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-[#10b981] text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-200"
              disabled={loading}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
