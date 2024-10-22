import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { signup } from '../../store/feature/userSlice';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); 
  const [emailError, setEmailError] = useState('');
  const [nameError, setNameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const dispatch = useDispatch();

  const { loading } = useSelector((state) => state.user);

  const validateEmail = (value) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) {
      setEmailError('Email is required');
    } else if (!emailPattern.test(value)) {
      setEmailError('Please enter a valid email address');
    } else {
      setEmailError('');
    }
  };

  const validateName = (value) => {
    if (!value) {
      setNameError('Name is required');
    } else if (value.length < 3) {
      setNameError('Name must be at least 3 characters long');
    } else {
      setNameError('');
    }
  };

  const validatePassword = (value) => {
    if (!value) {
      setPasswordError('Password is required');
    } else if (value.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
    } else {
      setPasswordError('');
    }
  };

  const handleSignup = (e) => {
    e.preventDefault();
    validateEmail(email);
    validatePassword(password);
    validateName(name);

    if (!emailError && !passwordError && !nameError) {
      dispatch(signup({ email, password, name }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      {loading ? (
        "loading"
      ) : (
        <div className="bg-gray-50 p-10 rounded-lg shadow-xl w-full max-w-md">
          <h2 className="text-3xl font-bold mb-8 text-center text-[#10b981]">Sign Up</h2>
          <form onSubmit={handleSignup}>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm mb-2">Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${nameError ? 'border-red-500' : 'border-gray-300'
                  } focus:ring-[#10b981]`}
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  validateName(e.target.value);
                }}
              />
              {nameError && <div className="text-red-500 text-sm">{nameError}</div>}
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm mb-2">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${emailError ? 'border-red-500' : 'border-gray-300'
                  } focus:ring-[#10b981]`}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  validateEmail(e.target.value);
                }}
              />
              {emailError && <div className="text-red-500 text-sm">{emailError}</div>}
            </div>

            <div className="mb-6 relative">
              <label className="block text-gray-700 text-sm mb-2">Password</label>
              <input
                type={showPassword ? 'text' : 'password'} 
                placeholder="Enter your password"
                className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${passwordError ? 'border-red-500' : 'border-gray-300'
                  } focus:ring-[#10b981]`}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  validatePassword(e.target.value);
                }}
              />
              <div
                className="absolute top-11 right-0 pr-4 flex items-center cursor-pointer"
                onClick={() => setShowPassword(!showPassword)} 
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </div>
              {passwordError && <div className="text-red-500 text-sm">{passwordError}</div>}
            </div>

            <button
              type="submit"
              className="w-full bg-[#10b981] text-white p-3 rounded-md hover:bg-green-700 transition duration-200"
            >
              Sign Up
            </button>

            <div className="mt-4 text-center">
              <Link to="/" className="text-[#10b981] hover:underline">
                Already have an account? Login
              </Link>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Signup;