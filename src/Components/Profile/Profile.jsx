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
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#10b981]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full max-w-2xl overflow-hidden">
        {/* Header Section */}
        <div className="bg-[#10b981] p-6 sm:p-8 text-white text-center">
          <h2 className="text-2xl sm:text-3xl font-bold">My Profile</h2>
          <p className="opacity-90 text-sm mt-1">Manage your account details</p>
        </div>

        <div className="p-6 sm:p-10">
          {/* Info Grid */}
          <div className="space-y-6">
            <div className="border-b border-gray-50 pb-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                Full Name
              </h3>
              <p className="text-lg font-medium text-gray-800">{user?.name}</p>
            </div>

            <div className="border-b border-gray-50 pb-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                Email Address
              </h3>
              <p className="text-lg font-medium text-gray-800 break-all">
                {user?.email}
              </p>
            </div>

            <div className="border-b border-gray-50 pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                    Account Role
                  </h3>
                  <p className="text-lg font-medium text-gray-800 capitalize">
                    {user?.role}
                  </p>
                </div>
                {user?.role === "admin" && (
                  <button
                    onClick={() => setShowRoleInput(!showRoleInput)}
                    className="text-sm font-bold text-[#10b981] hover:text-green-700 transition-colors bg-green-50 px-4 py-2 rounded-lg self-start sm:self-center"
                  >
                    {showRoleInput ? "Cancel Editing" : "Change Role"}
                  </button>
                )}
              </div>

              {showRoleInput && (
                <div className="mt-4 bg-gray-50 p-4 rounded-xl border border-gray-100 animate-in fade-in slide-in-from-top-2">
                  <label
                    className="block text-sm font-semibold text-gray-700 mb-2"
                    htmlFor="role"
                  >
                    Enter New Role:
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      id="role"
                      type="text"
                      value={newRole}
                      onChange={handleRoleChange}
                      className="flex-1 border border-gray-300 rounded-lg py-2 px-4 focus:ring-2 focus:ring-[#10b981] focus:border-transparent outline-none"
                      placeholder="e.g. Moderator"
                    />
                    <button
                      onClick={handleSubmit}
                      className="bg-[#10b981] text-white py-2 px-6 rounded-lg font-bold hover:bg-green-700 transition-all shadow-sm"
                    >
                      Save
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-10 pt-6 border-t border-gray-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <Link to="/updateprofile" className="w-full">
                <button className="w-full bg-[#10b981] text-white py-3 px-4 rounded-xl font-bold hover:bg-green-700 transition-all shadow-md shadow-green-100">
                  Edit Profile
                </button>
              </Link>

              <button
                className="w-full bg-white text-red-500 border-2 border-red-500 py-3 px-4 rounded-xl font-bold hover:bg-red-50 transition-all"
                onClick={handleLogout}
              >
                Logout
              </button>

              <button
                className="w-full bg-red-600 text-white py-3 px-4 rounded-xl font-bold hover:bg-red-700 transition-all col-span-1 sm:col-span-2 lg:col-span-1"
                onClick={handleDeleteAccount}
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
