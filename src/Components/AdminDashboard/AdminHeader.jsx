import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../store/feature/userSlice";
import {
  FaSearch,
  FaBell,
  FaUser,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaChevronDown,
  FaEnvelope,
  FaShoppingBag,
  FaTag,
  FaStar,
  FaQuestionCircle,
} from "react-icons/fa";

const AdminHeader = ({ setIsMobileOpen, isCollapsed }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const profileDropdownRef = useRef(null);
  const notificationsRef = useRef(null);

  // Sample notifications (in real app, fetch from API)
  const notifications = [
    {
      id: 1,
      type: "order",
      message: "New order #12345 received",
      time: "2 minutes ago",
      read: false,
    },
    {
      id: 2,
      type: "product",
      message: "Low stock alert: Organic Vegetables",
      time: "1 hour ago",
      read: false,
    },
    {
      id: 3,
      type: "review",
      message: "New 5-star review on Fresh Apples",
      time: "3 hours ago",
      read: true,
    },
  ];

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      ) {
        setShowProfileDropdown(false);
      }
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "order":
        return <FaShoppingBag className="text-blue-500" />;
      case "product":
        return <FaTag className="text-yellow-500" />;
      case "review":
        return <FaStar className="text-purple-500" />;
      default:
        return <FaEnvelope className="text-gray-500" />;
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileOpen(true)}
            className="lg:hidden p-2 text-gray-600 hover:text-[#10b981] hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FaBars size={20} />
          </button>

          {/* Search Bar */}
          <div className="hidden md:block relative">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search products, orders, users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-80 lg:w-96 pl-10 pr-4 py-2.5 bg-gray-100 border-0 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#10b981] focus:bg-white transition-all placeholder-gray-400"
              />
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Search Button (Mobile) */}
          <button className="md:hidden p-2.5 text-gray-600 hover:text-[#10b981] hover:bg-gray-100 rounded-xl transition-colors">
            <FaSearch size={18} />
          </button>

          {/* Notifications */}
          <div className="relative" ref={notificationsRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2.5 text-gray-600 hover:text-[#10b981] hover:bg-gray-100 rounded-xl transition-colors"
            >
              <FaBell size={18} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs flex items-center justify-center rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-semibold text-gray-800">Notifications</h3>
                  <button className="text-xs text-[#10b981] hover:text-green-700 font-medium">
                    Mark all as read
                  </button>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`px-4 py-3 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors ${
                        !notification.read ? "bg-green-50/50" : ""
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-800 truncate">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {notification.time}
                          </p>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-[#10b981] rounded-full flex-shrink-0 mt-2" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-3 bg-gray-50 text-center">
                  <button className="text-sm text-[#10b981] hover:text-green-700 font-medium">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative" ref={profileDropdownRef}>
            <button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#10b981] to-green-600 flex items-center justify-center text-white font-semibold text-sm">
                {user?.name?.charAt(0).toUpperCase() || "A"}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-800">
                  {user?.name || "Admin"}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {user?.role || "Administrator"}
                </p>
              </div>
              <FaChevronDown className="hidden md:block text-gray-400 text-xs" />
            </button>

            {/* Profile Dropdown Menu */}
            {showProfileDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="font-medium text-gray-800">{user?.name}</p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
                <div className="py-2">
                  <button
                    onClick={() => {
                      setShowProfileDropdown(false);
                      navigate("/profile");
                    }}
                    className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3 transition-colors"
                  >
                    <FaUser className="text-gray-400" />
                    My Profile
                  </button>
                  <button
                    onClick={() => {
                      setShowProfileDropdown(false);
                      navigate("/admin/settings");
                    }}
                    className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3 transition-colors"
                  >
                    <FaCog className="text-gray-400" />
                    Settings
                  </button>
                  <button
                    onClick={() => {
                      setShowProfileDropdown(false);
                      navigate("/admin/help");
                    }}
                    className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3 transition-colors"
                  >
                    <FaQuestionCircle className="text-gray-400" />
                    Help & Support
                  </button>
                </div>
                <div className="border-t border-gray-100 py-2">
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
                  >
                    <FaSignOutAlt />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
