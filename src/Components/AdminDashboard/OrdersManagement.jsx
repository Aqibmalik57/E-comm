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
} from "react-icons/fa";
import { getMyOrders, getOrderInvoice } from "../../store/feature/orderSlice";

const OrdersManagement = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.order);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  const itemsPerPage = 10;

  const loadOrders = async () => {
    setFetchError(null);
    try {
      await dispatch(getMyOrders()).unwrap();
    } catch (err) {
      setFetchError(err || "Failed to load orders");
      toast.error("Failed to load orders. Please try again.");
    }
  };

  useEffect(() => {
    loadOrders();
  });

  // Filter orders
  const filteredOrders = orders?.filter((order) => {
    const matchesSearch =
      order._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer?.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil((filteredOrders?.length || 0) / itemsPerPage);
  const paginatedOrders = filteredOrders?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const getStatusIcon = (status) => {
    switch (status) {
      case "delivered":
        return <FaCheckCircle className="text-green-500" />;
      case "shipped":
        return <FaTruck className="text-blue-500" />;
      case "processing":
        return <FaClock className="text-yellow-500" />;
      case "cancelled":
        return <FaTimesCircle className="text-red-500" />;
      default:
        return <FaBox className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-700";
      case "shipped":
        return "bg-blue-100 text-blue-700";
      case "processing":
        return "bg-yellow-100 text-yellow-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
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

  const calculateOrderTotal = (order) => {
    if (!order.items) return 0;
    return order.items.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
  };

  if (loading && !orders?.length) {
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
            Failed to Load Orders
          </h2>
          <p className="text-gray-600 mb-6">
            {fetchError || error || "An error occurred while loading orders."}
          </p>
          <button
            onClick={loadOrders}
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
            Orders Management
          </h1>
          <p className="text-gray-500 mt-1">Track and manage customer orders</p>
        </div>
        <button
          onClick={loadOrders}
          className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          title="Refresh Orders"
        >
          <FaRedo className="mr-2" />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by order ID, customer name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#10b981] focus:border-transparent outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <FaFilter className="text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#10b981] focus:border-transparent outline-none"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {
            label: "Total Orders",
            value: orders?.length || 0,
            color: "bg-blue-500",
          },
          {
            label: "Pending",
            value: orders?.filter((o) => o.status === "pending").length || 0,
            color: "bg-yellow-500",
          },
          {
            label: "Delivered",
            value: orders?.filter((o) => o.status === "delivered").length || 0,
            color: "bg-green-500",
          },
          {
            label: "Revenue",
            value: `$${orders?.reduce((sum, o) => sum + (o.total || 0), 0).toFixed(2)}`,
            color: "bg-purple-500",
          },
        ].map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-4"
          >
            <div
              className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center mb-2`}
            >
              <FaBox className="text-white" />
            </div>
            <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Orders Table */}
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
                      <span className="font-mono text-sm text-gray-600">
                        #{order._id?.slice(-8).toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-800">
                          {order.customer?.name || "Guest"}
                        </p>
                        <p className="text-sm text-gray-500">
                          {order.customer?.email}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-gray-800">
                        ${order.total || calculateOrderTotal(order).toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          order.status,
                        )}`}
                      >
                        {getStatusIcon(order.status)}
                        <span className="ml-1 capitalize">
                          {order.status || "Pending"}
                        </span>
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => viewOrderDetails(order)}
                          className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <FaEye size={18} />
                        </button>
                        <button
                          onClick={() => downloadInvoice(order._id)}
                          className="p-2 text-[#10b981] hover:bg-green-50 rounded-lg transition-colors"
                          title="Download Invoice"
                        >
                          <FaFileInvoice size={18} />
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
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, filteredOrders?.length)} of{" "}
              {filteredOrders?.length} orders
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

      {/* Order Details Modal */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  Order #{selectedOrder._id?.slice(-8).toUpperCase()}
                </h3>
                <p className="text-sm text-gray-500">
                  Placed on {new Date(selectedOrder.createdAt).toLocaleString()}
                </p>
              </div>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                  selectedOrder.status,
                )}`}
              >
                {getStatusIcon(selectedOrder.status)}
                <span className="ml-1 capitalize">
                  {selectedOrder.status || "Pending"}
                </span>
              </span>
            </div>

            <div className="p-6 space-y-6">
              {/* Customer Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-3">
                  Customer Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Name</p>
                    <p className="font-medium text-gray-800">
                      {selectedOrder.customer?.name || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Email</p>
                    <p className="font-medium text-gray-800">
                      {selectedOrder.customer?.email || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Phone</p>
                    <p className="font-medium text-gray-800">
                      {selectedOrder.customer?.phone || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Address</p>
                    <p className="font-medium text-gray-800">
                      {selectedOrder.customer?.address || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">
                  Order Items
                </h4>
                <div className="space-y-3">
                  {selectedOrder.items?.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg mr-3 flex items-center justify-center">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <FaBox className="text-gray-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">
                            {item.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            ${item.price} x {item.quantity}
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
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="font-medium text-gray-800">
                      ${calculateOrderTotal(selectedOrder).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Shipping</span>
                    <span className="font-medium text-gray-800">
                      ${selectedOrder.shippingCost?.toFixed(2) || "0.00"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Tax</span>
                    <span className="font-medium text-gray-800">
                      ${selectedOrder.tax?.toFixed(2) || "0.00"}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
                    <span className="text-gray-800">Total</span>
                    <span className="text-[#10b981]">
                      $
                      {selectedOrder.total?.toFixed(2) ||
                        calculateOrderTotal(selectedOrder).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-2">
                  Payment Information
                </h4>
                <p className="text-sm text-gray-600">
                  Method:{" "}
                  <span className="font-medium">
                    {selectedOrder.paymentMethod || "N/A"}
                  </span>
                </p>
                <p className="text-sm text-gray-600">
                  Status:{" "}
                  <span className="font-medium">
                    {selectedOrder.paymentStatus || "N/A"}
                  </span>
                </p>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => setShowOrderModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
              <button
                onClick={() => downloadInvoice(selectedOrder._id)}
                className="flex-1 px-4 py-2 bg-[#10b981] text-white rounded-lg hover:bg-green-700 flex items-center justify-center"
              >
                <FaFileInvoice className="mr-2" />
                Download Invoice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersManagement;
