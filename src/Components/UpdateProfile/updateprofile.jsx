import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "../../store/feature/userSlice";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa6";

const UpdateProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.user);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateProfile({ name, email }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#10b981]"></div>
      </div>
    );
  }

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

          <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-gray-800">
            Update Profile
          </h2>
          <p className="text-gray-500 mb-8 text-sm">
            Update your account information
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                className="block text-gray-700 text-xs font-bold uppercase tracking-wider mb-2"
                htmlFor="name"
              >
                Full Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#10b981] focus:border-transparent outline-none transition-all"
                placeholder="Your name"
                required
              />
            </div>

            <div>
              <label
                className="block text-gray-700 text-xs font-bold uppercase tracking-wider mb-2"
                htmlFor="email"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#10b981] focus:border-transparent outline-none transition-all"
                placeholder="your@email.com"
                required
              />
            </div>

            <div className="pt-4 flex flex-col gap-3">
              <button
                type="submit"
                className="w-full bg-[#10b981] text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-all shadow-lg shadow-green-100"
              >
                Save Changes
              </button>

              <button
                type="button"
                onClick={() => navigate("/updatepassword")}
                className="w-full bg-blue-50 text-blue-600 py-3 rounded-xl font-bold hover:bg-blue-100 transition-all"
              >
                Change Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfile;
