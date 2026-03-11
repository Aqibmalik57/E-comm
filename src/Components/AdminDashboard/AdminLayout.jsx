import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import AdminHeader from "./AdminHeader";

const AdminLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main Content Area */}
      <div
        className={`transition-all duration-300 ease-in-out min-h-screen flex flex-col
          ${isCollapsed ? "lg:ml-20" : "lg:ml-64"}
          ml-0
        `}
      >
        {/* Header */}
        <AdminHeader
          setIsMobileOpen={setIsMobileOpen}
          isCollapsed={isCollapsed}
        />

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6 xl:p-8 overflow-x-hidden">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 py-4 px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-gray-500">
            <p>© 2024 Your Store. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <span>Version 1.0.0</span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline">Powered by React Redux</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;
