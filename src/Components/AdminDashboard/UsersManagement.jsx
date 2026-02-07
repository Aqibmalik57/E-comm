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
} from "react-icons/fa";
import {
  fetchUsers,
  deleteUser,
  updateUserRole,
} from "../../store/feature/userSlice";
import LoadingSpinner from "./LoadingSpinner";
import EmptyState from "./EmptyState";

const UsersManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { users, usersLoading, usersError } = useSelector(
    (state) => state.user,
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [fetchError, setFetchError] = useState(null);

  const itemsPerPage = 10;

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
  });

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

  if (usersLoading) {
    return <LoadingSpinner text="Loading users..." />;
  }

  // Show error state if fetch failed
  if (fetchError || usersError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 max-w-md w-full text-center">
          <FaExclamationTriangle className="mx-auto text-5xl text-red-500 mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Failed to Load Users
          </h2>
          <p className="text-gray-600 mb-6">
            {fetchError ||
              usersError ||
              "An error occurred while loading users."}
          </p>
          <button
            onClick={loadUsers}
            className="flex items-center justify-center px-6 py-3 bg-[#10b981] text-white rounded-lg hover:bg-green-700 transition-colors mx-auto"
          >
            <FaRedo className="mr-2" />
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
          <h1 className="text-2xl font-bold text-gray-800">Users Management</h1>
          <p className="text-gray-500 mt-1">
            Manage user accounts and permissions
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={loadUsers}
            className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            title="Refresh Users"
          >
            <FaRedo className="mr-2" />
            Refresh
          </button>
          <button
            onClick={exportUsers}
            className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <FaDownload className="mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search users by name, email, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#10b981] focus:border-transparent outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <FaFilter className="text-gray-400" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#10b981] focus:border-transparent outline-none"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
              <option value="moderator">Moderator</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      {paginatedUsers?.length > 0 ? (
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
                {paginatedUsers.map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-[#10b981] flex items-center justify-center text-white font-bold mr-3">
                          {user.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">
                            {user.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            ID: {user._id?.slice(-8)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{user.email}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          user.role === "admin"
                            ? "bg-purple-100 text-purple-700"
                            : user.role === "moderator"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-green-100 text-green-700"
                        }`}
                      >
                        {user.role === "admin" ? (
                          <FaUserShield className="mr-1" />
                        ) : (
                          <FaUser className="mr-1" />
                        )}
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-sm">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => navigate(`/singleUser/${user._id}`)}
                          className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Profile"
                        >
                          <FaEye size={18} />
                        </button>
                        <button
                          onClick={() => openRoleModal(user)}
                          className="p-2 text-purple-500 hover:bg-purple-50 rounded-lg transition-colors"
                          title="Edit Role"
                        >
                          <FaUserShield size={18} />
                        </button>
                        <button
                          onClick={() => navigate(`/updateUser/${user._id}`)}
                          className="p-2 text-[#10b981] hover:bg-green-50 rounded-lg transition-colors"
                          title="Edit Profile"
                        >
                          <FaEdit size={18} />
                        </button>
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
                          <FaTrash size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, filteredUsers?.length)} of{" "}
                {filteredUsers?.length} users
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
                >
                  Previous
                </button>
                <span className="px-3 py-1 bg-[#10b981] text-white rounded-lg">
                  {currentPage}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <EmptyState
          type="users"
          title="No users found"
          description={usersError || "No users match your search criteria."}
          actionLabel="Clear Filters"
          onAction={() => {
            setSearchTerm("");
            setRoleFilter("all");
          }}
        />
      )}

      {/* Role Update Modal */}
      {showRoleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Update User Role
            </h3>
            <p className="text-gray-600 mb-4">
              Changing role for <strong>{selectedUser?.name}</strong>
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select New Role
              </label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#10b981] focus:border-transparent outline-none"
              >
                <option value="user">User</option>
                <option value="moderator">Moderator</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowRoleModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleRoleUpdate}
                className="flex-1 px-4 py-2 bg-[#10b981] text-white rounded-lg hover:bg-green-700"
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
