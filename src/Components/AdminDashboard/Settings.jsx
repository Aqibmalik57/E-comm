import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  FaUser,
  FaLock,
  FaBell,
  FaPalette,
  FaGlobe,
  FaMoon,
  FaSun,
  FaSave,
  FaShieldAlt,
  FaEnvelope,
  FaMobile,
} from "react-icons/fa";
import { updateProfile } from "../../store/feature/userSlice";

const Settings = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  const [activeTab, setActiveTab] = useState("profile");
  const [isSaving, setIsSaving] = useState(false);

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  // Notification settings
  const [notifications, setNotifications] = useState({
    emailOrder: true,
    emailProduct: true,
    emailMarketing: false,
    pushOrder: true,
    pushProduct: false,
    pushMarketing: false,
  });

  // App settings
  const [appSettings, setAppSettings] = useState({
    darkMode: false,
    language: "en",
    currency: "USD",
    timezone: "UTC",
  });

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await dispatch(updateProfile(profileForm)).unwrap();
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleNotificationChange = (key) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
    toast.success("Notification settings updated");
  };

  const handleAppSettingChange = (key, value) => {
    setAppSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
    if (key === "darkMode") {
      toast.success(value ? "Dark mode enabled" : "Dark mode disabled");
    } else {
      toast.success("Settings updated");
    }
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: FaUser },
    { id: "security", label: "Security", icon: FaLock },
    { id: "notifications", label: "Notifications", icon: FaBell },
    { id: "preferences", label: "Preferences", icon: FaPalette },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
            Settings
          </h1>
          <p className="text-gray-500 mt-1">
            Manage your account settings and preferences
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Tabs */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
                      activeTab === tab.id
                        ? "bg-[#10b981] text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="mr-3" size={18} />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {/* Profile Settings */}
          {activeTab === "profile" && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <FaUser className="mr-3 text-[#10b981]" />
                Profile Information
              </h2>

              <form onSubmit={handleProfileSubmit} className="space-y-6">
                {/* Avatar Section */}
                <div className="flex items-center gap-6 pb-6 border-b border-gray-100">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#10b981] to-green-600 flex items-center justify-center text-white font-bold text-2xl">
                    {user?.name?.charAt(0).toUpperCase() || "A"}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {user?.name}
                    </h3>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                    <button
                      type="button"
                      className="mt-2 text-sm text-[#10b981] hover:text-green-700 font-medium"
                    >
                      Change Avatar
                    </button>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={profileForm.name}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, name: e.target.value })
                      }
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#10b981] focus:border-transparent outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={profileForm.email}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          email: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#10b981] focus:border-transparent outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={profileForm.phone}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          phone: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#10b981] focus:border-transparent outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Role
                    </label>
                    <input
                      type="text"
                      value={user?.role || "Admin"}
                      disabled
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-gray-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex items-center px-6 py-3 bg-[#10b981] text-white rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    <FaSave className="mr-2" />
                    {isSaving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Security Settings */}
          {activeTab === "security" && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <FaShieldAlt className="mr-3 text-[#10b981]" />
                Security Settings
              </h2>

              <div className="space-y-6">
                {/* Change Password */}
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="p-3 bg-[#10b981]/10 rounded-xl mr-4">
                        <FaLock className="text-[#10b981]" size={20} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          Change Password
                        </h3>
                        <p className="text-sm text-gray-500">
                          Update your password regularly
                        </p>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium">
                      Update
                    </button>
                  </div>
                </div>

                {/* Two-Factor Authentication */}
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="p-3 bg-purple-100 rounded-xl mr-4">
                        <FaShieldAlt className="text-purple-600" size={20} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          Two-Factor Authentication
                        </h3>
                        <p className="text-sm text-gray-500">
                          Add an extra layer of security
                        </p>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium">
                      Enable
                    </button>
                  </div>
                </div>

                {/* Active Sessions */}
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="p-3 bg-blue-100 rounded-xl mr-4">
                        <FaMobile className="text-blue-600" size={20} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          Active Sessions
                        </h3>
                        <p className="text-sm text-gray-500">
                          Manage your active sessions
                        </p>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium">
                      View
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notification Settings */}
          {activeTab === "notifications" && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <FaBell className="mr-3 text-[#10b981]" />
                Notification Settings
              </h2>

              <div className="space-y-6">
                {/* Email Notifications */}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                    <FaEnvelope className="mr-2 text-gray-400" />
                    Email Notifications
                  </h3>
                  <div className="space-y-4">
                    {[
                      {
                        key: "emailOrder",
                        label: "Order Updates",
                        desc: "Get notified about new orders",
                      },
                      {
                        key: "emailProduct",
                        label: "Product Alerts",
                        desc: "Low stock and product updates",
                      },
                      {
                        key: "emailMarketing",
                        label: "Marketing",
                        desc: "Promotions and newsletters",
                      },
                    ].map((item) => (
                      <div
                        key={item.key}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                      >
                        <div>
                          <h4 className="font-medium text-gray-800">
                            {item.label}
                          </h4>
                          <p className="text-sm text-gray-500">{item.desc}</p>
                        </div>
                        <button
                          onClick={() => handleNotificationChange(item.key)}
                          className={`relative w-12 h-6 rounded-full transition-colors ${
                            notifications[item.key]
                              ? "bg-[#10b981]"
                              : "bg-gray-300"
                          }`}
                        >
                          <span
                            className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                              notifications[item.key]
                                ? "translate-x-7"
                                : "translate-x-1"
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Push Notifications */}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                    <FaMobile className="mr-2 text-gray-400" />
                    Push Notifications
                  </h3>
                  <div className="space-y-4">
                    {[
                      {
                        key: "pushOrder",
                        label: "Order Updates",
                        desc: "Real-time order notifications",
                      },
                      {
                        key: "pushProduct",
                        label: "Product Alerts",
                        desc: "Instant product alerts",
                      },
                      {
                        key: "pushMarketing",
                        label: "Marketing",
                        desc: "Promotional notifications",
                      },
                    ].map((item) => (
                      <div
                        key={item.key}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                      >
                        <div>
                          <h4 className="font-medium text-gray-800">
                            {item.label}
                          </h4>
                          <p className="text-sm text-gray-500">{item.desc}</p>
                        </div>
                        <button
                          onClick={() => handleNotificationChange(item.key)}
                          className={`relative w-12 h-6 rounded-full transition-colors ${
                            notifications[item.key]
                              ? "bg-[#10b981]"
                              : "bg-gray-300"
                          }`}
                        >
                          <span
                            className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                              notifications[item.key]
                                ? "translate-x-7"
                                : "translate-x-1"
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Preferences */}
          {activeTab === "preferences" && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <FaPalette className="mr-3 text-[#10b981]" />
                App Preferences
              </h2>

              <div className="space-y-6">
                {/* Dark Mode */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center">
                    <div className="p-3 bg-gray-200 rounded-xl mr-4">
                      {appSettings.darkMode ? (
                        <FaMoon className="text-gray-700" size={20} />
                      ) : (
                        <FaSun className="text-yellow-500" size={20} />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Dark Mode</h3>
                      <p className="text-sm text-gray-500">
                        Toggle dark/light theme
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      handleAppSettingChange("darkMode", !appSettings.darkMode)
                    }
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      appSettings.darkMode ? "bg-[#10b981]" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        appSettings.darkMode ? "translate-x-7" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                {/* Language */}
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-blue-100 rounded-xl mr-4">
                      <FaGlobe className="text-blue-600" size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Language</h3>
                      <p className="text-sm text-gray-500">
                        Select your preferred language
                      </p>
                    </div>
                  </div>
                  <select
                    value={appSettings.language}
                    onChange={(e) =>
                      handleAppSettingChange("language", e.target.value)
                    }
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#10b981] focus:border-transparent outline-none"
                  >
                    <option value="en">English</option>
                    <option value="ar">Arabic</option>
                    <option value="bn">Bengali</option>
                  </select>
                </div>

                {/* Currency */}
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-green-100 rounded-xl mr-4">
                      <FaGlobe className="text-green-600" size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Currency</h3>
                      <p className="text-sm text-gray-500">
                        Select your preferred currency
                      </p>
                    </div>
                  </div>
                  <select
                    value={appSettings.currency}
                    onChange={(e) =>
                      handleAppSettingChange("currency", e.target.value)
                    }
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#10b981] focus:border-transparent outline-none"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="BDT">BDT (৳)</option>
                  </select>
                </div>

                {/* Timezone */}
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-purple-100 rounded-xl mr-4">
                      <FaGlobe className="text-purple-600" size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Timezone</h3>
                      <p className="text-sm text-gray-500">
                        Set your local timezone
                      </p>
                    </div>
                  </div>
                  <select
                    value={appSettings.timezone}
                    onChange={(e) =>
                      handleAppSettingChange("timezone", e.target.value)
                    }
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#10b981] focus:border-transparent outline-none"
                  >
                    <option value="UTC">UTC</option>
                    <option value="EST">EST (UTC-5)</option>
                    <option value="PST">PST (UTC-8)</option>
                    <option value="BST">BST (UTC+6)</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
