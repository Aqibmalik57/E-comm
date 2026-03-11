import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FaSearch,
  FaEdit,
  FaTrash,
  FaUserShield,
  FaUser,
  FaFilter,
  FaDownload,
  FaEye,
  FaExclamationTriangle,
  FaRedo,
  FaPlus,
  FaUserPlus,
  FaEnvelope,
  FaCalendar,
  FaShieldAlt,
} from "react-icons/fa";
import {
  fetchUsers,
  deleteUser,
  updateUserRole,
} from "../../store/feature/userSlice";
import LoadingSpinner from "./LoadingSpinner";

const UsersManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    users,
    usersLoading,
    usersError,
    user: currentUser,
  } = useSelector((state) => state.user);

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [fetchError, setFetchError] = useState(null);
  const [viewMode, setViewMode] = useState("table");

  const itemsPerPage = viewMode === "table" ? 10 : 9;

  const loadUsers = async () => {
    setFetchError(null);
    try {
      await dispatch(fetchUsers()).unwrap();
    } catch (error) {
      setFetchError(error || "Failed to load users");
      toast.error("Failed to load users. Please try again.");
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Calculate user analytics
  const userStats = {
    total: users?.length || 0,
    admins: users?.filter((u) => u.role === "admin").length || 0,
    users: users?.filter((u) => u.role === "user").length || 0,
    moderators: users?.filter((u) => u.role === "moderator").length || 0,
  };

  // Filter users
  const filteredUsers = users?.filter((user) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user._id?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === "all" || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  // Pagination
  const totalPages = Math.ceil((filteredUsers?.length || 0) / itemsPerPage);
  const paginatedUsers = filteredUsers?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleRoleUpdate = async () => {
    if (selectedUser && newRole) {
      try {
        await dispatch(
          updateUserRole({ userId: selectedUser._id, role: newRole }),
        ).unwrap();
        setShowRoleModal(false);
        setSelectedUser(null);
        setNewRole("");
        toast.success("User role updated successfully");
        loadUsers();
      } catch (error) {
        toast.error(error || "Failed to update user role");
      }
    }
  };

  const handleDelete = async (userId) => {
    if (deleteConfirm === userId) {
      try {
        await dispatch(deleteUser(userId)).unwrap();
        setDeleteConfirm(null);
        toast.success("User deleted successfully");
        loadUsers();
      } catch (error) {
        toast.error(error || "Failed to delete user");
        setDeleteConfirm(null);
      }
    } else {
      setDeleteConfirm(userId);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  const openRoleModal = (user) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setShowRoleModal(true);
  };

  const exportUsers = () => {
    const csvContent = [
      ["ID", "Name", "Email", "Role", "Created At"].join(","),
      ...filteredUsers.map((user) =>
        [
          user._id,
          `"${user.name}"`,
          user.email,
          user.role,
          new Date(user.createdAt).toLocaleDateString(),
        ].join(","),
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `users-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (usersLoading && !users?.length) {
    return <LoadingSpinner text="Loading users..." />;
  }

  // Show error state if fetch failed
  if (fetchError || usersError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
        <div className="bg-gradient-to-br from-red-50 to-orange-50 border border-red-200 rounded-2xl p-8 lg:p-10 max-w-md w-full text-center shadow-lg">
          <div className="w-16 lg:w-20 h-16 lg:h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-5 lg:mb-6">
            <FaExclamationTriangle className="text-3xl lg:text-4xl text-red-500" />
          </div>
          <h2 className="text-xl lg:text-2xl font-bold text-gray-800 mb-3">
            Failed to Load Users
          </h2>
          <p className="text-gray-600 mb-6">
            {fetchError ||
              usersError ||
              "An error occurred while loading users."}
          </p>
          <button
            onClick={loadUsers}
            className="flex items-center justify-center px-6 lg:px-8 py-3 lg:py-4 bg-gradient-to-r from-[#10b981] to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105 shadow-lg mx-auto font-semibold"
          >
            <FaRedo className={`mr-2 ${usersLoading ? "animate-spin" : ""}`} />
            Retry Loading
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
            Users Management
          </h1>
          <p className="text-gray-500 mt-1">
            Manage user accounts and permissions • {filteredUsers?.length || 0}{" "}
            users
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={loadUsers}
            disabled={usersLoading}
            className="flex items-center px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 hover:border-[#10b981] transition-all shadow-sm text-sm"
            title="Refresh Users"
          >
            <FaRedo className={`mr-2 ${usersLoading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <button
            onClick={exportUsers}
            className="flex items-center px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 hover:border-[#10b981] transition-all shadow-sm text-sm"
          >
            <FaDownload className="mr-2" />
            <span className="hidden sm:inline">Export</span>
          </button>
          <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
            <button
              onClick={() => setViewMode("table")}
              className={`p-2.5 transition-colors ${
                viewMode === "table"
                  ? "bg-[#10b981] text-white"
                  : "bg-white text-gray-500 hover:bg-gray-50"
              }`}
              title="Table View"
            >
              <FaUser size={16} />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2.5 transition-colors ${
                viewMode === "grid"
                  ? "bg-[#10b981] text-white"
                  : "bg-white text-gray-500 hover:bg-gray-50"
              }`}
              title="Grid View"
            >
              <FaUserPlus size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FaUser className="text-blue-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800">{userStats.total}</p>
          <p className="text-sm text-gray-500">Total Users</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FaShieldAlt className="text-purple-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800">{userStats.admins}</p>
          <p className="text-sm text-gray-500">Admins</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <FaUser className="text-green-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800">{userStats.users}</p>
          <p className="text-sm text-gray-500">Customers</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <FaUserShield className="text-yellow-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800">
            {userStats.moderators}
          </p>
          <p className="text-sm text-gray-500">Moderators</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search users by name, email, or ID..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#10b981] focus:border-transparent outline-none"
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <FaFilter className="text-gray-400" />
              <select
                value={roleFilter}
                onChange={(e) => {
                  setRoleFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#10b981] focus:border-transparent outline-none"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
                <option value="moderator">Moderator</option>
              </select>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-xl">
              <FaCalendar className="text-[#10b981]" />
              <span>{new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Users Display */}
      {viewMode === "table" ? (
        /* Table View */
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedUsers?.length > 0 ? (
                  paginatedUsers.map((user) => (
                    <tr
                      key={user._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#10b981] to-green-600 flex items-center justify-center text-white font-bold mr-3">
                            {user.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">
                              {user.name}
                              {user._id === currentUser?._id && (
                                <span className="ml-2 text-xs bg-[#10b981] text-white px-2 py-0.5 rounded-full">
                                  You
                                </span>
                              )}
                            </p>
                            <p className="text-sm text-gray-500">
                              ID: {user._id?.slice(-8)}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-gray-600">
                          <FaEnvelope className="mr-2 text-gray-400" />
                          {user.email}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${
                            user.role === "admin"
                              ? "bg-purple-100 text-purple-700"
                              : user.role === "moderator"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-green-100 text-green-700"
                          }`}
                        >
                          {user.role === "admin" ? (
                            <FaShieldAlt className="mr-1" />
                          ) : (
                            <FaUser className="mr-1" />
                          )}
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-sm">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => navigate(`/singleUser/${user._id}`)}
                            className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Profile"
                          >
                            <FaEye size={16} />
                          </button>
                          <button
                            onClick={() => openRoleModal(user)}
                            className="p-2 text-purple-500 hover:bg-purple-50 rounded-lg transition-colors"
                            title="Edit Role"
                          >
                            <FaUserShield size={16} />
                          </button>
                          <button
                            onClick={() => navigate(`/updateUser/${user._id}`)}
                            className="p-2 text-[#10b981] hover:bg-green-50 rounded-lg transition-colors"
                            title="Edit Profile"
                          >
                            <FaEdit size={16} />
                          </button>
                          {user._id !== currentUser?._id && (
                            <button
                              onClick={() => handleDelete(user._id)}
                              className={`p-2 rounded-lg transition-colors ${
                                deleteConfirm === user._id
                                  ? "bg-red-500 text-white"
                                  : "text-red-500 hover:bg-red-50"
                              }`}
                              title={
                                deleteConfirm === user._id
                                  ? "Click again to confirm"
                                  : "Delete User"
                              }
                            >
                              <FaTrash size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      <FaUser className="mx-auto text-4xl text-gray-300 mb-3" />
                      <p>No users found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedUsers?.length > 0 ? (
            paginatedUsers.map((user) => (
              <div
                key={user._id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#10b981] to-green-600 flex items-center justify-center text-white font-bold text-xl">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="ml-3">
                      <p className="font-semibold text-gray-800">
                        {user.name}
                        {user._id === currentUser?._id && (
                          <span className="ml-1 text-xs bg-[#10b981] text-white px-1.5 py-0.5 rounded-full">
                            You
                          </span>
                        )}
                      </p>
                      <p className="text-sm text-gray-500">
                        ID: {user._id?.slice(-8)}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                      user.role === "admin"
                        ? "bg-purple-100 text-purple-700"
                        : user.role === "moderator"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-green-100 text-green-700"
                    }`}
                  >
                    {user.role}
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <FaEnvelope className="mr-2" />
                  <span className="truncate">{user.email}</span>
                </div>
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <FaCalendar className="mr-2" />
                  Joined {formatDate(user.createdAt)}
                </div>
                <div className="flex gap-2 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => navigate(`/singleUser/${user._id}`)}
                    className="flex-1 px-3 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <FaEye className="inline mr-1" /> View
                  </button>
                  <button
                    onClick={() => openRoleModal(user)}
                    className="flex-1 px-3 py-2 text-sm bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors"
                  >
                    <FaUserShield className="inline mr-1" /> Role
                  </button>
                  {user._id !== currentUser?._id && (
                    <button
                      onClick={() => handleDelete(user._id)}
                      className={`flex-1 px-3 py-2 text-sm rounded-lg transition-colors ${
                        deleteConfirm === user._id
                          ? "bg-red-500 text-white"
                          : "bg-red-50 text-red-600 hover:bg-red-100"
                      }`}
                    >
                      <FaTrash className="inline mr-1" />
                      {deleteConfirm === user._id ? "Confirm" : "Delete"}
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-gray-500 bg-white rounded-xl shadow-sm border border-gray-100">
              <FaUser className="mx-auto text-4xl text-gray-300 mb-3" />
              <p>No users found</p>
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <p className="text-sm text-gray-500">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, filteredUsers?.length)} of{" "}
            {filteredUsers?.length} users
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors"
            >
              Previous
            </button>
            <div className="flex gap-1">
              {[...Array(Math.min(5, totalPages))].map((_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 py-2 rounded-lg transition-colors ${
                      currentPage === page
                        ? "bg-[#10b981] text-white"
                        : "border border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Role Update Modal */}
      {showRoleModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                <FaUserShield className="text-3xl text-purple-600" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-800 text-center mb-2">
              Update User Role
            </h3>
            <p className="text-gray-600 text-center mb-6">
              Changing role for <strong>{selectedUser?.name}</strong>
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select New Role
              </label>
              <div className="space-y-2">
                {["user", "moderator", "admin"].map((role) => (
                  <label
                    key={role}
                    className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${
                      newRole === role
                        ? "border-[#10b981] bg-green-50"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={role}
                      checked={newRole === role}
                      onChange={(e) => setNewRole(e.target.value)}
                      className="sr-only"
                    />
                    <div
                      className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                        newRole === role
                          ? "border-[#10b981]"
                          : "border-gray-300"
                      }`}
                    >
                      {newRole === role && (
                        <div className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />
                      )}
                    </div>
                    <span className="capitalize font-medium text-gray-700">
                      {role}
                    </span>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowRoleModal(false)}
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleRoleUpdate}
                className="flex-1 px-4 py-3 bg-[#10b981] text-white rounded-xl hover:bg-green-700 font-medium"
              >
                Update Role
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersManagement;
