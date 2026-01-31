import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteUser, fetchUsers, logout } from "../../store/feature/userSlice";
import logo from "../../Assets/Images/logo-color_el4zmy.svg";
import { FaHeart } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLogout, setIsLogout] = useState(false);
  const { loading, error, users } = useSelector((state) => state.user);
  const [data, setData] = useState(false);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch, data]);

  useEffect(() => {
    if (isLogout) {
      navigate("/");
    }
  }, [navigate, isLogout]);

  const handleLogout = () => {
    dispatch(logout());
    setIsLogout(true);
  };

  const handleDeleteAccount = (userId) => {
    dispatch(deleteUser(userId)).then(() => {
      setData(!data);
    });
  };

  return (
    <div className="admin-dashboard max-w-6xl mx-auto p-5">
      <header className="flex items-center justify-between mb-5">
        <img src={logo} alt="Website Logo" className="h-12" />
        <nav>
          <ul className="flex space-x-4">
            <li>
              <a
                href="#users"
                className="text-gray-700 border-b-2 border-[#10b981] hover:text-[#10b981]"
              >
                Users
              </a>
            </li>
            <li>
              <Link to="/" className="text-gray-700 hover:text-[#10b981]">
                Home
              </Link>
            </li>
            <li>
              <Link
                className="text-red-500 hover:text-red-600"
                onClick={() => handleLogout()}
              >
                Logout
              </Link>
            </li>
          </ul>
        </nav>
      </header>

      <h1 className="text-4xl font-bold mb-5 text-center text-[#10b981]">
        Admin Dashboard
      </h1>

      {users
        ? loading && (
            <p className="text-lg text-gray-500 text-center">
              Loading users...
            </p>
          )
        : error && <p className="text-lg text-red-500 text-center">{error}</p>}

      {users?.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border shadow-md rounded-lg overflow-hidden border-l-2 border-r-2 border-gray-300">
            <thead className="bg-[#10b981] text-white">
              <tr>
                <th className="py-3 px-4 text-center text-sm font-semibold border-b border-gray-300">
                  ID
                </th>
                <th className="py-3 px-4 text-center text-sm font-semibold border-b border-gray-300">
                  Name
                </th>
                <th className="py-3 px-4 text-center text-sm font-semibold border-b border-gray-300">
                  Email
                </th>
                <th className="py-3 px-4 text-center text-sm font-semibold border-b border-gray-300">
                  Role
                </th>
                <th className="py-3 px-4 text-center text-sm font-semibold border-b border-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users?.map((user) => (
                <tr
                  key={user._id}
                  className="hover:bg-gray-50 transition duration-200"
                >
                  <td className="py-4 px-4 border-b text-gray-700 text-sm text-center">
                    {user._id}
                  </td>
                  <td className="py-4 px-4 border-b text-gray-700 text-sm text-center">
                    {user.name}
                  </td>
                  <td className="py-4 px-4 border-b text-gray-700 text-sm text-center">
                    {user.email}
                  </td>
                  <td className="py-4 px-4 border-b text-gray-700 text-sm text-center">
                    {user.role}
                  </td>
                  <td className="py-4 px-4 border-b text-gray-700 text-sm text-center">
                    <button
                      className="bg-blue-500 text-white hover:bg-blue-600 px-3 py-1 rounded mr-2 transition duration-200"
                      onClick={() => navigate(`/singleUser/${user._id}`)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white hover:bg-red-600 px-3 py-1 rounded transition duration-200"
                      onClick={() => handleDeleteAccount(user._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-lg text-gray-500 text-center">No users found.</p>
      )}

      <footer className="mt-10 text-center text-gray-500 text-sm">
        <p className="flex items-center justify-center my-4">
          &copy;{new Date().getFullYear()} Copyright @
          <span className="flex items-center text-green-600 font-medium">
            CodingHeart&nbsp;
            <FaHeart className="text-red-500 mt-1" />
          </span>
          , All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default AdminDashboard;
