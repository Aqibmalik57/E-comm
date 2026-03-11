import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  FaSearch,
  FaEye,
  FaFileInvoice,
  FaFilter,
  FaBox,
  FaTruck,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaExclamationTriangle,
  FaRedo,
  FaTrash,
  FaShippingFast,
  FaMoneyBillWave,
  FaCalendar,
  FaArrowUp,
  FaArrowDown,
  FaShoppingBag,
  FaUser,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
} from "react-icons/fa";
import {
  getAllOrders,
  getOrderInvoice,
  updateOrderStatus,
  deleteOrder,
} from "../../store/feature/orderSlice";

const OrdersManagement = () => {
  const dispatch = useDispatch();
  const { orders, loading, error, counts, totalRevenue } = useSelector(
    (state) => state.order,
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const [viewMode, setViewMode] = useState("table");

  const itemsPerPage = viewMode === "table" ? 10 : 9;

  const loadOrders = async (status = statusFilter, showError = true) => {
    setFetchError(null);
    try {
      const params = status !== "all" ? { status } : {};
      const result = await dispatch(getAllOrders(params)).unwrap();
      return result;
    } catch (err) {
      setFetchError(err || "Failed to load orders");
      if (showError) {
        toast.error("Failed to load orders. Please try again.");
      }
      throw err;
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusFilterChange = (newStatus) => {
    setStatusFilter(newStatus);
    setCurrentPage(1);
    loadOrders(newStatus);
  };

  const filteredOrders = orders?.filter((order) => {
    const matchesSearch =
      order._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.oId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer?.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      order.status?.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil((filteredOrders?.length || 0) / itemsPerPage);
  const paginatedOrders = filteredOrders?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Calculate metrics
  const orderStatusCounts = {
    pending:
      orders?.filter((o) => o.status === "Pending" || o.status === "pending")
        .length || 0,
    processing:
      orders?.filter(
        (o) => o.status === "Processing" || o.status === "processing",
      ).length || 0,
    shipped:
      orders?.filter((o) => o.status === "Shipped" || o.status === "shipped")
        .length || 0,
    delivered:
      orders?.filter(
        (o) => o.status === "Delivered" || o.status === "delivered",
      ).length || 0,
    cancelled:
      orders?.filter(
        (o) => o.status === "Cancelled" || o.status === "cancelled",
      ).length || 0,
  };

  const totalOrders = orders?.length || 0;
  const avgOrderValue =
    totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : "0.00";

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return <FaCheckCircle className="text-green-500" />;
      case "shipped":
        return <FaTruck className="text-blue-500" />;
      case "processing":
        return <FaClock className="text-yellow-500" />;
      case "cancelled":
        return <FaTimesCircle className="text-red-500" />;
      case "pending":
        return <FaClock className="text-gray-500" />;
      default:
        return <FaBox className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-700 border-green-200";
      case "shipped":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "processing":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-200";
      case "pending":
        return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const downloadInvoice = async (orderId) => {
    try {
      await dispatch(getOrderInvoice(orderId)).unwrap();
      toast.success("Invoice downloaded successfully");
    } catch (err) {
      toast.error(err || "Failed to download invoice");
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdatingStatus(orderId);
    try {
      await dispatch(
        updateOrderStatus({ orderId, status: newStatus }),
      ).unwrap();
      toast.success(`Order status updated to ${newStatus}`);
      if (selectedOrder && selectedOrder._id === orderId) {
        const updatedOrder = orders.find((o) => o._id === orderId);
        if (updatedOrder) {
          setSelectedOrder({ ...updatedOrder, status: newStatus });
        }
      }
      loadOrders(statusFilter, false);
    } catch (err) {
      toast.error(err || "Failed to update status");
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      await dispatch(deleteOrder(orderId)).unwrap();
      setShowDeleteConfirm(null);
      toast.success("Order deleted successfully");
      if (selectedOrder && selectedOrder._id === orderId) {
        setShowOrderModal(false);
        setSelectedOrder(null);
      }
      loadOrders(statusFilter, false);
    } catch (err) {
      toast.error(err || "Failed to delete order");
    }
  };

  const calculateOrderTotal = (order) => {
    if (!order.items) return 0;
    return order.items.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading && !orders?.length) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#10b981]"></div>
      </div>
    );
  }

  if (fetchError || error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
        <div className="bg-gradient-to-br from-red-50 to-orange-50 border border-red-200 rounded-2xl p-8 lg:p-10 max-w-md w-full text-center shadow-lg">
          <div className="w-16 lg:w-20 h-16 lg:h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-5 lg:mb-6">
            <FaExclamationTriangle className="text-3xl lg:text-4xl text-red-500" />
          </div>
          <h2 className="text-xl lg:text-2xl font-bold text-gray-800 mb-3">
            Failed to Load Orders
          </h2>
          <p className="text-gray-600 mb-6">
            {fetchError || error || "An error occurred while loading orders."}
          </p>
          <button
            onClick={() => loadOrders()}
            className="flex items-center justify-center px-6 lg:px-8 py-3 lg:py-4 bg-gradient-to-r from-[#10b981] to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105 shadow-lg mx-auto font-semibold"
          >
            <FaRedo className={`mr-2 ${loading ? "animate-spin" : ""}`} />
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
            Orders Management
          </h1>
          <p className="text-gray-500 mt-1">
            Track and manage customer orders • {filteredOrders?.length || 0}{" "}
            orders
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => loadOrders()}
            disabled={loading}
            className="flex items-center px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 hover:border-[#10b981] transition-all shadow-sm text-sm"
            title="Refresh Orders"
          >
            <FaRedo className={`mr-2 ${loading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
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
              <FaShoppingBag size={16} />
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
              <FaBox size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FaShoppingBag className="text-blue-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800">{totalOrders}</p>
          <p className="text-sm text-gray-500">Total Orders</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <FaClock className="text-yellow-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800">
            {orderStatusCounts.pending}
          </p>
          <p className="text-sm text-gray-500">Pending</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FaShippingFast className="text-purple-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800">
            {orderStatusCounts.processing}
          </p>
          <p className="text-sm text-gray-500">Processing</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <FaCheckCircle className="text-green-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800">
            {orderStatusCounts.delivered}
          </p>
          <p className="text-sm text-gray-500">Delivered</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <FaMoneyBillWave className="text-emerald-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800">
            ${(totalRevenue || 0).toFixed(2)}
          </p>
          <p className="text-sm text-gray-500">Revenue</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders by ID, customer name, or email..."
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
                value={statusFilter}
                onChange={(e) => handleStatusFilterChange(e.target.value)}
                className="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#10b981] focus:border-transparent outline-none"
              >
                <option value="all">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-xl">
              <FaCalendar className="text-[#10b981]" />
              <span>{new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Display */}
      {viewMode === "table" ? (
        /* Table View */
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedOrders?.length > 0 ? (
                  paginatedOrders.map((order) => (
                    <tr
                      key={order._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                          #
                          {order.oId?.slice(-8).toUpperCase() ||
                            order._id?.slice(-8).toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-[#10b981] to-green-600 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                            {(order.customer?.name || "G")
                              .charAt(0)
                              .toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">
                              {order.customer?.name || "Guest"}
                            </p>
                            <p className="text-sm text-gray-500">
                              {order.customer?.email || "No email"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-gray-800">
                          $
                          {(order.total || calculateOrderTotal(order)).toFixed(
                            2,
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={order.status || "Pending"}
                          onChange={(e) =>
                            handleStatusUpdate(order._id, e.target.value)
                          }
                          disabled={updatingStatus === order._id}
                          className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer border ${getStatusColor(order.status)}`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => viewOrderDetails(order)}
                            className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <FaEye size={16} />
                          </button>
                          <button
                            onClick={() => downloadInvoice(order._id)}
                            className="p-2 text-[#10b981] hover:bg-green-50 rounded-lg transition-colors"
                            title="Download Invoice"
                          >
                            <FaFileInvoice size={16} />
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm(order._id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Order"
                          >
                            <FaTrash size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      <FaBox className="mx-auto text-4xl text-gray-300 mb-3" />
                      <p>No orders found</p>
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
          {paginatedOrders?.length > 0 ? (
            paginatedOrders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="font-mono text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded inline-block">
                      #
                      {order.oId?.slice(-8).toUpperCase() ||
                        order._id?.slice(-8).toUpperCase()}
                    </p>
                    <p className="font-medium text-gray-800 mt-2">
                      {order.customer?.name || "Guest"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {order.customer?.email || "No email"}
                    </p>
                  </div>
                  <select
                    value={order.status || "Pending"}
                    onChange={(e) =>
                      handleStatusUpdate(order._id, e.target.value)
                    }
                    disabled={updatingStatus === order._id}
                    className={`text-xs font-medium px-2 py-1 rounded-lg border ${getStatusColor(order.status)}`}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div>
                    <p className="text-xs text-gray-500">Total</p>
                    <p className="text-lg font-bold text-gray-800">
                      ${(order.total || calculateOrderTotal(order)).toFixed(2)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Date</p>
                    <p className="text-sm text-gray-700">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => viewOrderDetails(order)}
                    className="flex-1 px-3 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <FaEye className="inline mr-1" /> View
                  </button>
                  <button
                    onClick={() => downloadInvoice(order._id)}
                    className="flex-1 px-3 py-2 text-sm bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                  >
                    <FaFileInvoice className="inline mr-1" /> Invoice
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-gray-500 bg-white rounded-xl shadow-sm border border-gray-100">
              <FaBox className="mx-auto text-4xl text-gray-300 mb-3" />
              <p>No orders found</p>
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <p className="text-sm text-gray-500">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, filteredOrders?.length)} of{" "}
            {filteredOrders?.length} orders
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

      {/* Order Details Modal */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto my-8">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  Order #
                  {selectedOrder.oId?.slice(-8).toUpperCase() ||
                    selectedOrder._id?.slice(-8).toUpperCase()}
                </h3>
                <p className="text-sm text-gray-500">
                  Placed on {formatDate(selectedOrder.createdAt)}
                </p>
              </div>
              <button
                onClick={() => setShowOrderModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-2xl"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status */}
              <div className="flex items-center justify-between">
                <div
                  className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium border ${getStatusColor(selectedOrder.status)}`}
                >
                  {getStatusIcon(selectedOrder.status)}
                  <span className="ml-2 capitalize">
                    {selectedOrder.status || "Pending"}
                  </span>
                </div>
                <select
                  value={selectedOrder.status || "Pending"}
                  onChange={(e) =>
                    handleStatusUpdate(selectedOrder._id, e.target.value)
                  }
                  className={`px-4 py-2 rounded-lg text-sm font-medium border ${getStatusColor(selectedOrder.status)}`}
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              {/* Customer Info */}
              <div className="bg-gray-50 rounded-xl p-5">
                <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                  <FaUser className="mr-2 text-[#10b981]" />
                  Customer Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center">
                    <FaUser className="text-gray-400 mr-2" />
                    <div>
                      <p className="text-gray-500">Name</p>
                      <p className="font-medium text-gray-800">
                        {selectedOrder.customer?.name || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <FaEnvelope className="text-gray-400 mr-2" />
                    <div>
                      <p className="text-gray-500">Email</p>
                      <p className="font-medium text-gray-800">
                        {selectedOrder.customer?.email || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <FaPhone className="text-gray-400 mr-2" />
                    <div>
                      <p className="text-gray-500">Phone</p>
                      <p className="font-medium text-gray-800">
                        {selectedOrder.customer?.phone || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <FaMapMarkerAlt className="text-gray-400 mr-2" />
                    <div>
                      <p className="text-gray-500">Address</p>
                      <p className="font-medium text-gray-800">
                        {selectedOrder.customer?.address || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                  <FaBox className="mr-2 text-[#10b981]" />
                  Order Items ({selectedOrder.items?.length || 0})
                </h4>
                <div className="space-y-3">
                  {selectedOrder.items?.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                    >
                      <div className="flex items-center">
                        <div className="w-14 h-14 bg-gray-200 rounded-xl flex items-center justify-center overflow-hidden">
                          {item.imageUrl ? (
                            <img
                              src={item.imageUrl}
                              alt={item.title}
                              className="w-full h-full object-cover rounded-xl"
                            />
                          ) : (
                            <FaBox className="text-gray-400" />
                          )}
                        </div>
                        <div className="ml-4">
                          <p className="font-medium text-gray-800">
                            {item.title || item.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            ${item.price} × {item.quantity}
                          </p>
                        </div>
                      </div>
                      <p className="font-semibold text-gray-800">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="border-t border-gray-200 pt-4">
                <h4 className="font-semibold text-gray-800 mb-4">
                  Order Summary
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="font-medium text-gray-800">
                      $
                      {(
                        selectedOrder.subtotal ||
                        calculateOrderTotal(selectedOrder)
                      ).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Discount</span>
                    <span className="font-medium text-green-600">
                      -${(selectedOrder.discount || 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Shipping</span>
                    <span className="font-medium text-gray-800">
                      ${(selectedOrder.shippingCost || 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-3 border-t border-gray-200">
                    <span className="text-gray-800">Total</span>
                    <span className="text-[#10b981]">
                      $
                      {(
                        selectedOrder.total ||
                        calculateOrderTotal(selectedOrder)
                      ).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => setShowOrderModal(false)}
                className="flex-1 px-5 py-3 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 font-medium"
              >
                Close
              </button>
              <button
                onClick={() => downloadInvoice(selectedOrder._id)}
                className="flex-1 px-5 py-3 bg-[#10b981] text-white rounded-xl hover:bg-green-700 font-medium flex items-center justify-center"
              >
                <FaFileInvoice className="mr-2" />
                Download Invoice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <FaExclamationTriangle className="text-3xl text-red-500" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-800 text-center mb-2">
              Delete Order?
            </h3>
            <p className="text-gray-600 text-center mb-6">
              Are you sure you want to delete this order? This action cannot be
              undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteOrder(showDeleteConfirm)}
                className="flex-1 px-4 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 font-medium flex items-center justify-center"
              >
                <FaTrash className="mr-2" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersManagement;
