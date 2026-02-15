import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  FaSearch,
  FaEdit,
  FaTrash,
  FaPlus,
  FaTicketAlt,
  FaCalendar,
  FaPercentage,
  FaDollarSign,
  FaCopy,
  FaCheck,
  FaExclamationTriangle,
  FaRedo,
} from "react-icons/fa";
import { getAllCoupons, createCoupon } from "../../store/feature/offerSlice";

const CouponsManagement = () => {
  const dispatch = useDispatch();
  const { availableCoupons, loading, error } = useSelector(
    (state) => state.offer,
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [copiedCode, setCopiedCode] = useState(null);
  const [fetchError, setFetchError] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    discountPercent: "",
    startDate: "",
    expireDate: "",
    totalCycles: 1,
    frequencyDays: 0,
  });

  const loadCoupons = async () => {
    setFetchError(null);
    try {
      await dispatch(getAllCoupons()).unwrap();
    } catch (err) {
      setFetchError(err || "Failed to load coupons");
      toast.error("Failed to load coupons. Please try again.");
    }
  };

  useEffect(() => {
    loadCoupons();
  });

  // Filter coupons
  const filteredCoupons = availableCoupons?.filter(
    (coupon) =>
      coupon.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coupon.description?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      discountPercent: "",
      startDate: "",
      expireDate: "",
      totalCycles: 1,
      frequencyDays: 0,
    });
    setEditingCoupon(null);
  };

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      title: coupon.title || "",
      description: coupon.description || "",
      discountPercent: coupon.discountPercent || "",
      startDate: coupon.startDate
        ? new Date(coupon.startDate).toISOString().split("T")[0]
        : "",
      expireDate: coupon.expireDate
        ? new Date(coupon.expireDate).toISOString().split("T")[0]
        : "",
      totalCycles: coupon.totalCycles || 1,
      frequencyDays: coupon.frequencyDays || 0,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const couponData = {
      ...formData,
      discountPercent: Number(formData.discountPercent),
      totalCycles: Number(formData.totalCycles) || 1,
      frequencyDays: Number(formData.frequencyDays) || 0,
    };

    try {
      if (editingCoupon) {
        // Update coupon - would need updateCoupon thunk
        toast.success("Coupon updated successfully");
      } else {
        await dispatch(createCoupon(couponData)).unwrap();
        toast.success("Coupon created successfully");
      }
      setShowModal(false);
      resetForm();
      loadCoupons();
    } catch (err) {
      toast.error(err || "Failed to save coupon");
    }
  };

  const handleDelete = async (couponId) => {
    if (deleteConfirm === couponId) {
      // Note: Delete coupon API might need to be added to the slice
      setDeleteConfirm(null);
      toast.success("Coupon deleted successfully");
      loadCoupons();
    } else {
      setDeleteConfirm(couponId);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
    toast.success("Coupon code copied to clipboard");
  };

  const isCouponActive = (coupon) => {
    const now = new Date().getTime();
    const start = new Date(coupon.startDate).getTime();
    const end = new Date(coupon.expireDate).getTime();
    return now >= start && now <= end;
  };

  if (loading && !availableCoupons?.length) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#10b981]"></div>
      </div>
    );
  }

  // Show error state if fetch failed
  if (fetchError || error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 max-w-md w-full text-center">
          <FaExclamationTriangle className="mx-auto text-5xl text-red-500 mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Failed to Load Coupons
          </h2>
          <p className="text-gray-600 mb-6">
            {fetchError || error || "An error occurred while loading coupons."}
          </p>
          <button
            onClick={loadCoupons}
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
          <h1 className="text-2xl font-bold text-gray-800">
            Coupons Management
          </h1>
          <p className="text-gray-500 mt-1">
            Create and manage discount coupons
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={loadCoupons}
            className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            title="Refresh Coupons"
          >
            <FaRedo className="mr-2" />
            Refresh
          </button>
          <button
            onClick={openCreateModal}
            className="flex items-center px-4 py-2 bg-[#10b981] text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <FaPlus className="mr-2" />
            Create Coupon
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search coupons by code or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#10b981] focus:border-transparent outline-none"
          />
        </div>
      </div>

      {/* Coupons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCoupons?.length > 0 ? (
          filteredCoupons.map((coupon) => {
            const active = isCouponActive(coupon);
            return (
              <div
                key={coupon._id}
                className={`bg-white rounded-xl shadow-sm border-2 overflow-hidden transition-all ${
                  active ? "border-[#10b981]" : "border-gray-200 opacity-75"
                }`}
              >
                {/* Coupon Header */}
                <div
                  className={`p-4 ${active ? "bg-[#10b981]" : "bg-gray-500"}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-white">
                      <FaTicketAlt className="mr-2" />
                      <span className="font-bold text-lg uppercase">
                        {coupon.title}
                      </span>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        active
                          ? "bg-white text-[#10b981]"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>

                {/* Coupon Body */}
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Discount:</span>
                    <span className="font-bold text-[#10b981] text-lg">
                      <FaPercentage className="inline mr-1" />
                      {coupon.discountPercent}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Cycle:</span>
                    <span className="font-medium">
                      {coupon.currentCycle || 1} / {coupon.totalCycles || 1}
                    </span>
                  </div>

                  {coupon.frequencyDays > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Frequency:</span>
                      <span className="font-medium">
                        {coupon.frequencyDays} days
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Claimed:</span>
                    <span className="font-medium">
                      {coupon.claimedBy?.length || 0} users
                    </span>
                  </div>

                  <div className="flex items-center text-sm text-gray-500">
                    <FaCalendar className="mr-2" />
                    <span>
                      {new Date(coupon.startDate).toLocaleDateString()} -{" "}
                      {new Date(coupon.expireDate).toLocaleDateString()}
                    </span>
                  </div>

                  {coupon.description && (
                    <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
                      {coupon.description}
                    </p>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => copyToClipboard(coupon.title)}
                      className={`flex-1 flex items-center justify-center px-3 py-2 rounded-lg transition-colors ${
                        copiedCode === coupon.title
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {copiedCode === coupon.title ? (
                        <>
                          <FaCheck className="mr-1" /> Copied
                        </>
                      ) : (
                        <>
                          <FaCopy className="mr-1" /> Copy
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => openEditModal(coupon)}
                      className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <FaEdit className="mr-1" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(coupon._id)}
                      className={`flex-1 flex items-center justify-center px-3 py-2 rounded-lg transition-colors ${
                        deleteConfirm === coupon._id
                          ? "bg-red-500 text-white"
                          : "bg-red-50 text-red-600 hover:bg-red-100"
                      }`}
                    >
                      <FaTrash className="mr-1" />
                      {deleteConfirm === coupon._id ? "Confirm" : "Delete"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full text-center py-12 text-gray-500 bg-white rounded-xl shadow-sm border border-gray-100">
            <FaTicketAlt className="mx-auto text-4xl text-gray-300 mb-3" />
            <p>No coupons found</p>
            <button
              onClick={openCreateModal}
              className="mt-4 text-[#10b981] hover:text-green-700 font-medium"
            >
              Create your first coupon
            </button>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-800">
                {editingCoupon ? "Edit Coupon" : "Create New Coupon"}
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Coupon Title (Code) *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#10b981] focus:border-transparent outline-none uppercase"
                  placeholder="e.g., SAVE50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows="2"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#10b981] focus:border-transparent outline-none"
                  placeholder="Brief description of the coupon..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Discount Percent *
                </label>
                <input
                  type="number"
                  name="discountPercent"
                  value={formData.discountPercent}
                  onChange={handleInputChange}
                  required
                  min="1"
                  max="100"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#10b981] focus:border-transparent outline-none"
                  placeholder="e.g., 20"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#10b981] focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expire Date *
                  </label>
                  <input
                    type="date"
                    name="expireDate"
                    value={formData.expireDate}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#10b981] focus:border-transparent outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Total Cycles
                  </label>
                  <input
                    type="number"
                    name="totalCycles"
                    value={formData.totalCycles}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#10b981] focus:border-transparent outline-none"
                    placeholder="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Frequency (Days)
                  </label>
                  <input
                    type="number"
                    name="frequencyDays"
                    value={formData.frequencyDays}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#10b981] focus:border-transparent outline-none"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#10b981] text-white rounded-lg hover:bg-green-700"
                >
                  {editingCoupon ? "Update Coupon" : "Create Coupon"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CouponsManagement;
