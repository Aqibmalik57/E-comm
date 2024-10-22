import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../store/feature/userSlice";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isLoginAttempted, setIsLoginAttempted] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, loading } = useSelector((state) => state.user);

  const validateEmail = (value) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) {
      setEmailError("Email is required");
    } else if (!emailPattern.test(value)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  const validatePassword = (value) => {
    if (!value) {
      setPasswordError("Password is required");
    } else if (value.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
    } else {
      setPasswordError("");
    }
  };

  useEffect(() => {
    if (user && isLoginAttempted) {
      if (user.role === "admin") {
        navigate("/dashboard");
      } else {
        navigate("/home");
      }
    }
  }, [user]);

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoginAttempted(true);

    validateEmail(email);
    validatePassword(password);

    if (!emailError && !passwordError) {
      dispatch(login({ email, password }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      {loading ? (
        <div className="flex justify-center items-center">Loading...</div>
      ) : (
        <div className="bg-gray-50 p-10 rounded-lg shadow-xl w-full max-w-md">
          <h2 className="text-3xl font-bold mb-8 text-center text-[#10b981]">
            Login
          </h2>
          <form onSubmit={handleLogin}>
            <div className="mb-6">
              <label
                className="block text-gray-700 text-sm font-semibold mb-2"
                htmlFor="email"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  validateEmail(e.target.value);
                }}
                className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${
                  emailError ? "border-red-500" : "border-gray-300"
                } focus:ring-[#10b981]`}
                required
              />
              {emailError && (
                <div className="text-red-500 text-sm">{emailError}</div>
              )}
            </div>

            <div className="mb-6 relative">
              <label
                className="block text-gray-700 text-sm font-semibold mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"} 
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  validatePassword(e.target.value);
                }}
                className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${
                  passwordError ? "border-red-500" : "border-gray-300"
                } focus:ring-[#10b981]`}
                required
              />
              <div
                className="absolute top-11 right-0 pr-4 flex items-center cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </div>
              {passwordError && (
                <div className="text-red-500 text-sm">{passwordError}</div>
              )}
            </div>

            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="rememberMe"
                  className="mr-2 accent-[#10b981]"
                />
                <label
                  htmlFor="rememberMe"
                  className="text-gray-700 text-sm font-semibold"
                >
                  Remember Me
                </label>
              </div>
              <div>
                <Link to="/forgetpassword" className="text-[#10b981] text-sm">
                  Forgot Password?
                </Link>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-[#10b981] text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-200"
              >
                Login
              </button>
            </div>
            <div className="mt-4 text-center">
              <Link to="/signup" className="text-[#10b981]">
                Don't have an account? Sign Up
              </Link>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Login;
