import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { login, googleLogin } from "../../store/feature/userSlice";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { GoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isLoginAttempted, setIsLoginAttempted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, loading } = useSelector((state) => state.user);

  const validateEmail = (value) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) setEmailError("Email is required");
    else if (!emailPattern.test(value))
      setEmailError("Please enter a valid email address");
    else setEmailError("");
  };

  const validatePassword = (value) => {
    if (!value) setPasswordError("Password is required");
    else setPasswordError("");
  };

  useEffect(() => {
    if (user && isLoginAttempted) {
      if (user.role === "admin") navigate("/admin");
      else navigate("/");
    }
  }, [isLoginAttempted, navigate, user]);

  const handleLogin = (e) => {
    e.preventDefault();
    validateEmail(email);
    validatePassword(password);

    if (!emailError && !passwordError && email && password) {
      setIsLoginAttempted(true);
      dispatch(login({ email, password }));
    }
  };

  // Google Login Success Handler
  const handleGoogleSuccess = (credentialResponse) => {
    setIsLoginAttempted(true);
    // Send the idToken to your backend via Redux action
    dispatch(googleLogin({ idToken: credentialResponse.credential }));
  };

  // Google Login Error Handler
  const handleGoogleError = () => {
    toast.error("Google Login Failed. Please try again.");
  };

  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-gray-50 px-4 py-8 sm:py-12">
      <div className="bg-white p-6 sm:p-10 rounded-2xl shadow-xl w-full max-w-[440px] border border-gray-100">
        <h2 className="text-2xl sm:text-3xl font-extrabold mb-2 text-center text-[#10b981]">
          Welcome Back
        </h2>
        <p className="text-center text-gray-500 mb-6 sm:mb-8 text-sm">
          Please enter your details to login
        </p>

        <form onSubmit={handleLogin} className="space-y-5 sm:space-y-6">
          {/* Email Field */}
          <div>
            <label className="block text-gray-700 text-xs font-bold uppercase mb-1 ml-1">
              Email
            </label>
            <input
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                validateEmail(e.target.value);
              }}
              className={`w-full p-3 text-sm sm:text-base border rounded-xl outline-none transition-all ${
                emailError
                  ? "border-red-500 ring-1 ring-red-500"
                  : "border-gray-200 focus:border-[#10b981] focus:ring-2 focus:ring-[#10b981]/20"
              }`}
            />
            {emailError && (
              <p className="text-red-500 text-[11px] sm:text-xs mt-1 ml-1 font-medium italic">
                {emailError}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="relative">
            <label className="block text-gray-700 text-xs font-bold uppercase mb-1 ml-1">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                validatePassword(e.target.value);
              }}
              className={`w-full p-3 text-sm sm:text-base border rounded-xl outline-none transition-all ${
                passwordError
                  ? "border-red-500 ring-1 ring-red-500"
                  : "border-gray-200 focus:border-[#10b981] focus:ring-2 focus:ring-[#10b981]/20"
              }`}
            />
            <button
              type="button"
              className="absolute top-[32px] sm:top-[34px] right-3 text-gray-400 hover:text-[#10b981] p-1"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
            </button>
            {passwordError && (
              <p className="text-red-500 text-[11px] sm:text-xs mt-1 ml-1 font-medium italic">
                {passwordError}
              </p>
            )}
          </div>

          <div className="flex flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 text-sm">
            <label className="flex items-center cursor-pointer group">
              <input
                type="checkbox"
                className="w-4 h-4 accent-[#10b981] rounded border-gray-300"
              />
              <span className="ml-2 text-gray-600 group-hover:text-gray-800 transition-colors text-xs sm:text-sm">
                Remember me
              </span>
            </label>
            <Link
              to="/forgetpassword"
              className="text-[#10b981] font-semibold hover:underline text-xs sm:text-sm ml-1 sm:ml-0"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#10b981] text-white p-3 rounded-xl font-bold hover:bg-green-600 transition duration-300 shadow-lg shadow-green-100 flex justify-center items-center active:scale-[0.98]"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Login"
            )}
          </button>

          {/* OR Divider */}
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink mx-4 text-gray-400 text-[10px] sm:text-xs uppercase font-medium">
              Or continue with
            </span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          {/* Google Login Button Container */}
          <div className="flex justify-center w-full">
            <div className="w-full max-w-full overflow-hidden flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                theme="outline" // Changing from 'filled_blue' to 'outline' removes the blue background
                size="large"
                shape="pill"
                width="100"
              />
            </div>
          </div>

          <p className="text-center text-gray-600 text-sm mt-4 sm:mt-6">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-[#10b981] font-bold hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
