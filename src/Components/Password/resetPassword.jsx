import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword } from "../../store/feature/userSlice";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
    <div className="min-h-[100dvh] flex items-center justify-center bg-gray-50 px-4 py-8 sm:py-12">
      <div className="bg-white p-6 sm:p-10 rounded-2xl shadow-xl w-full max-w-[440px] border border-gray-100">
        <h2 className="text-2xl sm:text-3xl font-extrabold mb-2 text-center text-[#10b981]">
          Reset Password
        </h2>
        <p className="text-center text-gray-500 mb-6 sm:mb-8 text-sm leading-relaxed">
          Create a strong, new password to protect your account.
        </p>

        <form onSubmit={handleResetPassword} className="space-y-5 sm:space-y-6">
          <div className="relative">
            <label className="block text-gray-700 text-xs font-bold uppercase mb-1 ml-1">
              New Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full p-3 text-sm sm:text-base border rounded-xl outline-none transition-all ${
                passwordError
                  ? "border-red-500 ring-1 ring-red-500"
                  : "border-gray-200 focus:border-[#10b981] focus:ring-2 focus:ring-[#10b981]/20"
              }`}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-[32px] sm:top-[34px] right-3 text-gray-400 hover:text-[#10b981] p-1"
            >
              {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
            </button>
          </div>

          <div className="relative">
            <label className="block text-gray-700 text-xs font-bold uppercase mb-1 ml-1">
              Confirm New Password
            </label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full p-3 text-sm sm:text-base border rounded-xl outline-none transition-all ${
                passwordError
                  ? "border-red-500 ring-1 ring-red-500"
                  : "border-gray-200 focus:border-[#10b981] focus:ring-2 focus:ring-[#10b981]/20"
              }`}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute top-[32px] sm:top-[34px] right-3 text-gray-400 hover:text-[#10b981] p-1"
            >
              {showConfirmPassword ? (
                <FaEyeSlash size={18} />
              ) : (
                <FaEye size={18} />
              )}
            </button>
            {passwordError && (
              <p className="text-red-500 text-[11px] sm:text-xs mt-1 ml-1 font-medium italic">
                {passwordError}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#10b981] text-white p-3 rounded-xl font-bold hover:bg-green-600 transition duration-300 shadow-lg shadow-green-100 flex justify-center items-center active:scale-[0.98]"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Reset Password"
            )}
          </button>

          <div className="text-center mt-4 sm:mt-6">
            <Link
              to="/login"
              className="text-sm text-[#10b981] font-bold hover:underline"
            >
              Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
