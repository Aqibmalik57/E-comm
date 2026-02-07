import React, { useState } from "react";
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
} from "react-icons/fa";
import logo from "../../Assets/Images/logo-color_el4zmy.svg";

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const menuItems = [
    { path: "/admin", icon: FaTachometerAlt, label: "Dashboard" },
    { path: "/admin/users", icon: FaUsers, label: "Users" },
    { path: "/admin/products", icon: FaBox, label: "Products" },
    { path: "/admin/categories", icon: FaTags, label: "Categories" },
    { path: "/admin/orders", icon: FaShoppingCart, label: "Orders" },
    { path: "/admin/coupons", icon: FaTicketAlt, label: "Coupons" },
    { path: "/admin/reviews", icon: FaComments, label: "Reviews" },
  ];

  const toggleMobileMenu = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobileMenu}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-[#10b981] text-white rounded-md shadow-lg"
      >
        {isMobileOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen bg-white shadow-xl z-40 transition-all duration-300 ease-in-out
          ${isCollapsed ? "w-20" : "w-64"}
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Logo Section */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          <div
            className={`flex items-center ${isCollapsed ? "justify-center w-full" : ""}`}
          >
            <img
              src={logo}
              alt="Logo"
              className={`transition-all duration-300 ${isCollapsed ? "h-8" : "h-8"}`}
            />
            {!isCollapsed && (
              <span className="ml-2 font-bold text-gray-800 text-lg hidden lg:block">
                Admin
              </span>
            )}
          </div>

          {/* Collapse Toggle (Desktop only) */}
          <button
            onClick={toggleCollapse}
            className="hidden lg:block p-1 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
          >
            {isCollapsed ? (
              <FaChevronRight size={14} />
            ) : (
              <FaChevronLeft size={14} />
            )}
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="mt-6 px-2">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    end={item.path === "/admin"}
                    onClick={() => setIsMobileOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center px-4 py-3 rounded-lg transition-all duration-200 group
                      ${
                        isActive
                          ? "bg-[#10b981] text-white shadow-md"
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
                      <span className="font-medium whitespace-nowrap overflow-hidden">
                        {item.label}
                      </span>
                    )}

                    {/* Tooltip for collapsed state */}
                    {isCollapsed && (
                      <div className="absolute left-20 bg-gray-800 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                        {item.label}
                      </div>
                    )}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className={`flex items-center w-full px-4 py-3 text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200
              ${isCollapsed ? "justify-center" : ""}
            `}
          >
            <FaSignOutAlt
              size={20}
              className={`flex-shrink-0 ${isCollapsed ? "" : "mr-3"}`}
            />
            {!isCollapsed && <span className="font-medium">Logout</span>}

            {/* Tooltip for collapsed state */}
            {isCollapsed && (
              <div className="absolute left-20 bg-gray-800 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                Logout
              </div>
            )}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
