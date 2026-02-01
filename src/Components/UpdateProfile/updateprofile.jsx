import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "../../store/feature/userSlice";
import { useNavigate } from "react-router-dom";

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

  const handleUpdatePassword = () => {
    navigate("/updatepassword");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-max flex items-center justify-center bg-gray-100 py-10">
      <div className="bg-white p-10 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold mb-8 text-center text-[#10b981]">
          Update Profile
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-semibold mb-2"
              htmlFor="name"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="flex justify-center mb-4">
            <button
              type="submit"
              className="bg-[#10b981] text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-200"
            >
              Update Profile
            </button>
          </div>
        </form>
        <div className="flex justify-center">
          <button
            onClick={handleUpdatePassword}
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
          >
            Update Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfile;
