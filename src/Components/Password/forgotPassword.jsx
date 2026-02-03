import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword } from "../../store/feature/userSlice";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();

  const { loading, error } = useSelector((state) => state.user);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    await dispatch(forgotPassword({ email }));
    setMessage(
      "Your reset password link has been sent. Please check your mail inbox.",
    );
  };

  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-gray-50 px-4 py-8 sm:py-12">
      <div className="bg-white p-6 sm:p-10 rounded-2xl shadow-xl w-full max-w-[440px] border border-gray-100">
        <h2 className="text-2xl sm:text-3xl font-extrabold mb-2 text-center text-[#10b981]">
          Forgot Password
        </h2>
        <p className="text-center text-gray-500 mb-6 sm:mb-8 text-sm leading-relaxed">
          Enter your email address and we'll send you a link to reset your
          password.
        </p>

        {message && !loading && !error && (
          <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 text-xs sm:text-sm font-medium rounded-r-lg animate-pulse">
            {message}
          </div>
        )}

        <form onSubmit={handleForgotPassword} className="space-y-6">
          <div>
            <label className="block text-gray-700 text-xs font-bold uppercase mb-1 ml-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 text-sm sm:text-base border border-gray-200 rounded-xl outline-none transition-all focus:border-[#10b981] focus:ring-2 focus:ring-[#10b981]/20"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#10b981] text-white p-3 rounded-xl font-bold hover:bg-green-600 transition duration-300 shadow-lg shadow-green-100 flex justify-center items-center active:scale-[0.98]"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Send Reset Link"
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

export default ForgotPassword;
