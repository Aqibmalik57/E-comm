import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteOwnProfile,
  logout,
  MyProfile,
  updateUserRole,
} from "../../store/feature/userSlice";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLogout, setIsLogout] = useState(false);
  const [newRole, setNewRole] = useState("");
  const [showRoleInput, setShowRoleInput] = useState(false);
  const { user, loading, isLoggedIn } = useSelector((state) => state.user);

  useEffect(() => {
    if (!isLoggedIn && !loading) {
      dispatch(MyProfile());
    }
  }, [dispatch, isLoggedIn, loading]);

  useEffect(() => {
    if (user) {
      setNewRole(user.role);
    }
  }, [user]);

  useEffect(() => {
    if (isLogout) {
      navigate("/");
    }
  }, [navigate, isLogout]);

  const handleLogout = () => {
    dispatch(logout());
    setIsLogout(true);
  };

  const handleRoleChange = (e) => {
    setNewRole(e.target.value);
  };

  const handleSubmit = async () => {
    if (user && newRole) {
      await dispatch(updateUserRole({ userId: user._id, role: newRole }));

      await dispatch(MyProfile());
    }

    setShowRoleInput(false);
  };

  const handleDeleteAccount = () => {
    try {
      if (window.confirm("Are you sure you want to delete your account?")) {
        dispatch(deleteOwnProfile());
        navigate("/");
      }
    } catch (e) {
      toast.error("An error occurred while deleting your account.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-max flex items-center justify-center bg-gray-100 py-10">
      <div className="bg-white p-10 rounded-lg shadow-xl w-full max-w-lg">
        <h2 className="text-3xl font-bold mb-8 text-center text-[#10b981]">
          My Profile
        </h2>
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-700">Name</h3>
          <p className="text-gray-600">{user?.name}</p>
        </div>
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-700">Email</h3>
          <p className="text-gray-600">{user?.email}</p>
        </div>
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-700">Role</h3>
          <div className="flex items-center justify-between">
            <p className="text-gray-600">{user?.role}</p>
            {user?.role === "admin" && (
              <button
                onClick={() => setShowRoleInput(!showRoleInput)}
                className="bg-[#10b981] text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-200 ml-4" // Margin left for spacing
              >
                {showRoleInput ? "Cancel" : "Edit Role"}
              </button>
            )}
          </div>
          {showRoleInput && (
            <div className="flex flex-col mt-4">
              <label
                className="block text-gray-700 font-semibold mb-2"
                htmlFor="role"
              >
                Change Role:
              </label>
              <input
                id="role"
                type="text"
                value={newRole}
                onChange={handleRoleChange}
                className="border border-gray-300 rounded-md py-2 px-4 mb-2 w-full"
              />
              <button
                onClick={handleSubmit}
                className="mt-4 bg-[#10b981] text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-200"
              >
                Save Role
              </button>
            </div>
          )}
        </div>

        <div className="flex justify-between mt-8">
          <Link to="/updateprofile">
            <button className="bg-[#10b981] text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-200">
              Edit Profile
            </button>
          </Link>
          <button
            className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition duration-200"
            onClick={handleLogout}
          >
            Logout
          </button>
          <button
            className="bg-red-700 text-white py-2 px-4 rounded-md hover:bg-red-800 transition duration-200"
            onClick={handleDeleteAccount}
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
