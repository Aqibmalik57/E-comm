import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { signup } from "../../store/feature/userSlice";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [nameError, setNameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const dispatch = useDispatch();

  const { loading } = useSelector((state) => state.user);

  const validateEmail = (value) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) setEmailError("Email is required");
    else if (!emailPattern.test(value))
      setEmailError("Please enter a valid email address");
    else setEmailError("");
  };

  const validateName = (value) => {
    if (!value) setNameError("Name is required");
    else if (value.length < 3)
      setNameError("Name must be at least 3 characters long");
    else setNameError("");
  };

  const validatePassword = (value) => {
    if (!value) setPasswordError("Password is required");
    else if (value.length < 8)
      setPasswordError("Password must be at least 8 characters long");
    else setPasswordError("");
  };

  const handleSignup = (e) => {
    e.preventDefault();
    validateEmail(email);
    validatePassword(password);
    validateName(name);

    if (
      !emailError &&
      !passwordError &&
      !nameError &&
      email &&
      password &&
      name
    ) {
      dispatch(signup({ email, password, name }));
    }
  };

  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-gray-50 px-4 py-8 sm:py-12">
      <div className="bg-white p-6 sm:p-10 rounded-2xl shadow-xl w-full max-w-[440px] border border-gray-100">
        <h2 className="text-2xl sm:text-3xl font-extrabold mb-2 text-center text-[#10b981]">
          Create Account
        </h2>
        <p className="text-center text-gray-500 mb-6 sm:mb-8 text-sm">
          Join us and start shopping today
        </p>

        <form onSubmit={handleSignup} className="space-y-4 sm:space-y-5">
          <div>
            <label className="block text-gray-700 text-xs font-bold uppercase mb-1 ml-1">
              Name
            </label>
            <input
              type="text"
              placeholder="John Doe"
              className={`w-full p-3 text-sm sm:text-base border rounded-xl outline-none transition-all ${
                nameError
                  ? "border-red-500 ring-1 ring-red-500"
                  : "border-gray-200 focus:border-[#10b981] focus:ring-2 focus:ring-[#10b981]/20"
              }`}
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                validateName(e.target.value);
              }}
            />
            {nameError && (
              <p className="text-red-500 text-[11px] sm:text-xs mt-1 ml-1 font-medium italic">
                {nameError}
              </p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 text-xs font-bold uppercase mb-1 ml-1">
              Email
            </label>
            <input
              type="email"
              placeholder="email@example.com"
              className={`w-full p-3 text-sm sm:text-base border rounded-xl outline-none transition-all ${
                emailError
                  ? "border-red-500 ring-1 ring-red-500"
                  : "border-gray-200 focus:border-[#10b981] focus:ring-2 focus:ring-[#10b981]/20"
              }`}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                validateEmail(e.target.value);
              }}
            />
            {emailError && (
              <p className="text-red-500 text-[11px] sm:text-xs mt-1 ml-1 font-medium italic">
                {emailError}
              </p>
            )}
          </div>

          <div className="relative">
            <label className="block text-gray-700 text-xs font-bold uppercase mb-1 ml-1">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className={`w-full p-3 text-sm sm:text-base border rounded-xl outline-none transition-all ${
                passwordError
                  ? "border-red-500 ring-1 ring-red-500"
                  : "border-gray-200 focus:border-[#10b981] focus:ring-2 focus:ring-[#10b981]/20"
              }`}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                validatePassword(e.target.value);
              }}
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

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#10b981] text-white p-3 rounded-xl font-bold hover:bg-green-600 transition duration-300 shadow-lg shadow-green-100 flex justify-center items-center active:scale-[0.98] mt-2"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Sign Up"
            )}
          </button>

          <div className="mt-4 sm:mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-[#10b981] font-bold hover:underline"
              >
                Login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
