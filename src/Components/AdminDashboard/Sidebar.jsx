import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../store/feature/userSlice";
import {
  FaTachometerAlt,
  FaUsers,
  FaBox,
  FaTags,
  FaShoppingCart,
  FaTicketAlt,
  FaComments,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaCog,
  FaQuestionCircle,
  FaHome,
} from "react-icons/fa";
import logo from "../../Assets/Images/logo-color_el4zmy.svg";

const Sidebar = ({
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const menuItems = [
    {
      path: "/admin",
      icon: FaTachometerAlt,
      label: "Dashboard",
      badge: null,
    },
    {
      path: "/admin/users",
      icon: FaUsers,
      label: "Users",
      badge: null,
    },
    {
      path: "/admin/products",
      icon: FaBox,
      label: "Products",
      badge: null,
    },
    {
      path: "/admin/categories",
      icon: FaTags,
      label: "Categories",
      badge: null,
    },
    {
      path: "/admin/orders",
      icon: FaShoppingCart,
      label: "Orders",
      badge: null,
    },
    {
      path: "/admin/coupons",
      icon: FaTicketAlt,
      label: "Coupons",
      badge: null,
    },
    {
      path: "/admin/reviews",
      icon: FaComments,
      label: "Reviews",
      badge: null,
    },
    {
      path: "/admin/settings",
      icon: FaCog,
      label: "Settings",
      badge: null,
    },
    {
      path: "/admin/help",
      icon: FaQuestionCircle,
      label: "Help & Support",
      badge: null,
    },
  ];

  const closeMobileMenu = () => {
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen bg-white shadow-xl z-40 transition-all duration-300 ease-in-out flex flex-col
          ${isCollapsed ? "w-20" : "w-64"}
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Logo Section */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100 flex-shrink-0">
          <div
            className={`flex items-center ${isCollapsed ? "justify-center w-full" : ""}`}
          >
            <img
              src={logo}
              alt="Logo"
              className={`h-8 transition-all duration-300`}
            />
            {!isCollapsed && (
              <span className="ml-2 font-bold text-gray-800 text-lg">
                Admin
              </span>
            )}
          </div>

          {/* Mobile Close Button */}
          <button
            onClick={closeMobileMenu}
            className="lg:hidden p-1 rounded-full hover:bg-gray-100 text-gray-500"
          >
            <FaTimes size={16} />
          </button>

          {/* Collapse Toggle (Desktop only) */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex p-1.5 rounded-full hover:bg-gray-100 text-gray-500 transition-colors items-center justify-center"
          >
            {isCollapsed ? (
              <FaChevronRight size={14} />
            ) : (
              <FaChevronLeft size={14} />
            )}
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 lg:px-3">
          <ul className="space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    end={item.path === "/admin"}
                    onClick={closeMobileMenu}
                    className={({ isActive }) =>
                      `flex items-center px-3 py-3 rounded-xl transition-all duration-200 group relative
                      ${
                        isActive
                          ? "bg-gradient-to-r from-[#10b981] to-green-600 text-white shadow-lg shadow-green-500/30"
                          : "text-gray-600 hover:bg-gray-100 hover:text-[#10b981]"
                      }
                      ${isCollapsed ? "justify-center" : ""}
                    `
                    }
                  >
                    <Icon
                      size={20}
                      className={`flex-shrink-0 ${isCollapsed ? "" : "mr-3"}`}
                    />
                    {!isCollapsed && (
                      <span className="font-medium whitespace-nowrap">
                        {item.label}
                      </span>
                    )}

                    {/* Badge */}
                    {item.badge && !isCollapsed && (
                      <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}

                    {/* Tooltip for collapsed state */}
                    {isCollapsed && (
                      <div className="absolute left-full ml-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 hidden lg:block">
                        {item.label}
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-800 rotate-45" />
                      </div>
                    )}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom Section */}
        <div className="border-t border-gray-100 p-3 lg:p-4 flex-shrink-0">
          {/* View Site Button */}
          <button
            onClick={() => navigate("/")}
            className={`flex items-center w-full px-3 py-2.5 mb-2 text-[#10b981] hover:bg-green-50 rounded-xl transition-all duration-200
              ${isCollapsed ? "justify-center" : ""}
            `}
          >
            <FaHome
              size={18}
              className={`flex-shrink-0 ${isCollapsed ? "" : "mr-3"}`}
            />
            {!isCollapsed && <span className="font-medium">View Site</span>}
          </button>

          {/* Collapse Button (Mobile) */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`flex items-center w-full px-3 py-2.5 mb-2 text-gray-500 hover:bg-gray-100 rounded-xl transition-colors lg:hidden
              ${isCollapsed ? "justify-center" : ""}
            `}
          >
            {isCollapsed ? (
              <FaBars size={18} />
            ) : (
              <>
                <FaBars className="mr-3" />
                <span className="font-medium">Collapse</span>
              </>
            )}
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className={`flex items-center w-full px-3 py-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200
              ${isCollapsed ? "justify-center" : ""}
            `}
          >
            <FaSignOutAlt
              size={18}
              className={`flex-shrink-0 ${isCollapsed ? "" : "mr-3"}`}
            />
            {!isCollapsed && <span className="font-medium">Logout</span>}

            {/* Tooltip for collapsed state */}
            {isCollapsed && (
              <div className="absolute left-full ml-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 hidden lg:block">
                Logout
                <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-800 rotate-45" />
              </div>
            )}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
