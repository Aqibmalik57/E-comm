import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword } from "../../store/feature/userSlice";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();

  const { loading, error } = useSelector((state) => state.user);

  const handleForgotPassword = (e) => {
    e.preventDefault();
    dispatch(forgotPassword({ email }));

    setMessage(
      "Your reset password link has been sent. Please check your mail inbox.",
    );
  };

  return (
    <div className="min-h-max flex items-center justify-center bg-gray-100 py-10">
      <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-[#10b981]">
          Forgot Password
        </h2>
        <p className="text-gray-600 mb-6 text-center">
          Enter your email address to receive a password reset link.
        </p>

        {message && !loading && !error && (
          <div className="mb-4 text-green-600 text-center font-semibold">
            {message}
          </div>
        )}

        <form onSubmit={handleForgotPassword}>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-semibold mb-2"
              htmlFor="email"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 border-gray-300 focus:ring-[#10b981]"
              required
            />
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-[#10b981] text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-200"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
