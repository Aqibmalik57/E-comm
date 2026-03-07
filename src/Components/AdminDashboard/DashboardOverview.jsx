import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FaUsers,
  FaBox,
  FaShoppingCart,
  FaTags,
  FaTicketAlt,
  FaComments,
  FaDollarSign,
  FaChartLine,
  FaArrowUp,
  FaArrowDown,
  FaPlus,
  FaExclamationTriangle,
  FaRedo,
  FaCheckCircle,
  FaClock,
  FaTimes,
  FaShippingFast,
  FaStar,
} from "react-icons/fa";
import { fetchUsers } from "../../store/feature/userSlice";
import { getAllProducts } from "../../store/feature/productSlice";
import { getAllCategories } from "../../store/feature/categorySlice";
import { getAllCoupons } from "../../store/feature/offerSlice";
import { getAllOrders } from "../../store/feature/orderSlice";

const StatCard = ({
  title,
  value,
  icon: Icon,
  color,
  link,
  trend,
  trendUp,
  subtitle,
}) => (
  <Link to={link} className="block group">
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-gray-800 mb-1">{value}</h3>
          {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
          {trend && (
            <div
              className={`flex items-center mt-2 text-sm font-medium ${
                trendUp ? "text-green-500" : "text-red-500"
              }`}
            >
              {trendUp ? (
                <FaArrowUp size={12} className="mr-1" />
              ) : (
                <FaArrowDown size={12} className="mr-1" />
              )}
              <span>{trend}</span>
            </div>
          )}
        </div>
        <div
          className={`p-4 rounded-2xl ${color} transform group-hover:scale-110 transition-transform duration-300`}
        >
          <Icon size={28} className="text-white" />
        </div>
      </div>
    </div>
  </Link>
);

const QuickAction = ({ label, icon: Icon, color, onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center px-5 py-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-[#10b981]/30 transition-all duration-200 w-full text-left group"
  >
    <div
      className={`p-3 rounded-xl ${color} transform group-hover:scale-110 transition-transform duration-200 mr-4`}
    >
      <Icon size={20} className="text-white" />
    </div>
    <span className="font-semibold text-gray-700 group-hover:text-[#10b981] transition-colors">
      {label}
    </span>
  </button>
);

const StatusCard = ({ title, value, icon: Icon, color, percentage }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
    <div className="flex items-center justify-between mb-3">
      <div className={`p-2 rounded-lg ${color}`}>
        <Icon size={18} className="text-white" />
      </div>
      <span className="text-sm font-medium text-gray-500">{percentage}%</span>
    </div>
    <p className="text-2xl font-bold text-gray-800">{value}</p>
    <p className="text-sm text-gray-500">{title}</p>
    <div className="mt-2 w-full bg-gray-100 rounded-full h-2">
      <div
        className={`h-2 rounded-full ${color.replace("bg-", "bg-opacity-80 ")}`}
        style={{
          width: `${percentage}%`,
          backgroundColor:
            color === "bg-green-500"
              ? "#10b981"
              : color === "bg-yellow-500"
                ? "#f59e0b"
                : color === "bg-blue-500"
                  ? "#3b82f6"
                  : "#ef4444",
        }}
      ></div>
    </div>
  </div>
);

const DashboardOverview = () => {
  const dispatch = useDispatch();
  const [fetchError, setFetchError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { users, usersLoading, usersError } = useSelector(
    (state) => state.user,
  );
  const {
    products,
    loading: productsLoading,
    error: productsError,
  } = useSelector((state) => state.product);
  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useSelector((state) => state.category);
  const {
    availableCoupons,
    loading: couponsLoading,
    error: couponsError,
  } = useSelector((state) => state.offer);
  const {
    orders,
    loading: ordersLoading,
    error: ordersError,
  } = useSelector((state) => state.order);

  // Calculate total reviews from products
  const totalReviews = products?.reduce(
    (acc, product) => acc + (product.numOfReviews || 0),
    0,
  );

  // Calculate revenue from orders
  const totalRevenue =
    orders?.reduce((acc, order) => acc + (order.total || 0), 0) || 0;

  // Calculate order status counts
  const orderStatusCounts = {
    pending: orders?.filter((o) => o.status === "pending").length || 0,
    processing: orders?.filter((o) => o.status === "processing").length || 0,
    shipped: orders?.filter((o) => o.status === "shipped").length || 0,
    delivered: orders?.filter((o) => o.status === "delivered").length || 0,
    cancelled: orders?.filter((o) => o.status === "cancelled").length || 0,
  };

  const totalOrders = orders?.length || 0;

  const fetchDashboardData = async () => {
    setFetchError(null);
    setIsRefreshing(true);

    // Fetch data individually to handle partial failures
    try {
      await dispatch(fetchUsers()).unwrap();
    } catch (error) {
      console.warn("Failed to fetch users:", error);
    }

    try {
      await dispatch(getAllProducts()).unwrap();
    } catch (error) {
      console.warn("Failed to fetch products:", error);
    }

    try {
      await dispatch(getAllCategories()).unwrap();
    } catch (error) {
      console.warn("Failed to fetch categories:", error);
    }

    try {
      await dispatch(getAllCoupons()).unwrap();
    } catch (error) {
      console.warn("Failed to fetch coupons:", error);
    }

    try {
      await dispatch(getAllOrders()).unwrap();
    } catch (error) {
      console.warn("Failed to fetch orders:", error);
    }

    setIsRefreshing(false);
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const isLoading =
    usersLoading ||
    productsLoading ||
    categoriesLoading ||
    couponsLoading ||
    ordersLoading;

  const stats = [
    {
      title: "Total Users",
      value: users?.length || 0,
      icon: FaUsers,
      color: "bg-gradient-to-br from-blue-400 to-blue-600",
      link: "/admin/users",
      subtitle: "Registered users",
    },
    {
      title: "Total Products",
      value: products?.length || 0,
      icon: FaBox,
      color: "bg-gradient-to-br from-green-400 to-green-600",
      link: "/admin/products",
      subtitle: "In inventory",
    },
    {
      title: "Total Orders",
      value: totalOrders,
      icon: FaShoppingCart,
      color: "bg-gradient-to-br from-purple-400 to-purple-600",
      link: "/admin/orders",
      subtitle: "All time",
    },
    {
      title: "Total Revenue",
      value: `$${totalRevenue.toFixed(2)}`,
      icon: FaDollarSign,
      color: "bg-gradient-to-br from-emerald-400 to-emerald-600",
      link: "/admin/orders",
      subtitle: "Gross revenue",
    },
    {
      title: "Categories",
      value: categories?.length || 0,
      icon: FaTags,
      color: "bg-gradient-to-br from-orange-400 to-orange-600",
      link: "/admin/categories",
      subtitle: "Active categories",
    },
    {
      title: "Active Coupons",
      value: availableCoupons?.length || 0,
      icon: FaTicketAlt,
      color: "bg-gradient-to-br from-pink-400 to-pink-600",
      link: "/admin/coupons",
      subtitle: "Available now",
    },
    {
      title: "Total Reviews",
      value: totalReviews,
      icon: FaComments,
      color: "bg-gradient-to-br from-yellow-400 to-yellow-600",
      link: "/admin/reviews",
      subtitle: "Product reviews",
    },
    {
      title: "Avg Rating",
      value: products?.length
        ? (
            products.reduce((acc, p) => acc + (p.rating || 0), 0) /
            products.length
          ).toFixed(1)
        : "0.0",
      icon: FaStar,
      color: "bg-gradient-to-br from-amber-400 to-amber-600",
      link: "/admin/reviews",
      subtitle: "Store rating",
    },
  ];

  // Check if any errors exist
  const hasErrors =
    usersError ||
    productsError ||
    categoriesError ||
    couponsError ||
    ordersError ||
    fetchError;

  if (hasErrors && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
        <div className="bg-gradient-to-br from-red-50 to-orange-50 border border-red-200 rounded-2xl p-10 max-w-md w-full text-center shadow-lg">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaExclamationTriangle className="text-4xl text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Failed to Load Dashboard
          </h2>
          <p className="text-gray-600 mb-8">
            {fetchError ||
              usersError ||
              productsError ||
              "An error occurred while loading dashboard data."}
          </p>
          <button
            onClick={fetchDashboardData}
            className="flex items-center justify-center px-8 py-4 bg-gradient-to-r from-[#10b981] to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105 shadow-lg mx-auto font-semibold"
          >
            <FaRedo className={`mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
            Retry Loading
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Dashboard Overview
          </h1>
          <p className="text-gray-500 mt-1">
            Welcome back! Here's what's happening with your store today.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={fetchDashboardData}
            disabled={isRefreshing}
            className={`flex items-center px-5 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 hover:border-[#10b981] transition-all shadow-sm ${
              isRefreshing ? "opacity-70" : ""
            }`}
            title="Refresh Data"
          >
            <FaRedo className={`mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <div className="hidden sm:block text-sm text-gray-500 bg-gray-100 px-4 py-2 rounded-xl">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>
      </div>

      {/* Stats Grid - 4 columns on large screens */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.slice(0, 4).map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.slice(4).map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Order Status Breakdown */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
          <FaChartLine className="mr-3 text-[#10b981]" />
          Order Status Overview
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          <StatusCard
            title="Pending"
            value={orderStatusCounts.pending}
            icon={FaClock}
            color="bg-yellow-500"
            percentage={
              totalOrders > 0
                ? Math.round((orderStatusCounts.pending / totalOrders) * 100)
                : 0
            }
          />
          <StatusCard
            title="Processing"
            value={orderStatusCounts.processing}
            icon={FaShippingFast}
            color="bg-blue-500"
            percentage={
              totalOrders > 0
                ? Math.round((orderStatusCounts.processing / totalOrders) * 100)
                : 0
            }
          />
          <StatusCard
            title="Shipped"
            value={orderStatusCounts.shipped}
            icon={FaShippingFast}
            color="bg-purple-500"
            percentage={
              totalOrders > 0
                ? Math.round((orderStatusCounts.shipped / totalOrders) * 100)
                : 0
            }
          />
          <StatusCard
            title="Delivered"
            value={orderStatusCounts.delivered}
            icon={FaCheckCircle}
            color="bg-green-500"
            percentage={
              totalOrders > 0
                ? Math.round((orderStatusCounts.delivered / totalOrders) * 100)
                : 0
            }
          />
          <StatusCard
            title="Cancelled"
            value={orderStatusCounts.cancelled}
            icon={FaTimes}
            color="bg-red-500"
            percentage={
              totalOrders > 0
                ? Math.round((orderStatusCounts.cancelled / totalOrders) * 100)
                : 0
            }
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-[#10b981]/5 to-green-50 rounded-2xl p-6 border border-[#10b981]/20">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/admin/products" className="block">
            <QuickAction
              label="Add New Product"
              icon={FaPlus}
              color="bg-gradient-to-br from-green-400 to-green-600"
            />
          </Link>
          <Link to="/admin/categories" className="block">
            <QuickAction
              label="Add Category"
              icon={FaPlus}
              color="bg-gradient-to-br from-orange-400 to-orange-600"
            />
          </Link>
          <Link to="/admin/coupons" className="block">
            <QuickAction
              label="Create Coupon"
              icon={FaPlus}
              color="bg-gradient-to-br from-pink-400 to-pink-600"
            />
          </Link>
          <Link to="/admin/users" className="block">
            <QuickAction
              label="Manage Users"
              icon={FaUsers}
              color="bg-gradient-to-br from-blue-400 to-blue-600"
            />
          </Link>
        </div>
      </div>

      {/* Recent Activity & Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Recent Orders</h2>
            <Link
              to="/admin/orders"
              className="text-[#10b981] hover:text-green-700 text-sm font-semibold"
            >
              View All
            </Link>
          </div>
          {orders?.length > 0 ? (
            <div className="space-y-3">
              {orders.slice(0, 5).map((order, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                      <FaShoppingCart className="text-white text-sm" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">
                        #{order._id?.slice(-6).toUpperCase()}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-800">
                      ${order.total?.toFixed(2) || "0.00"}
                    </p>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        order.status === "delivered"
                          ? "bg-green-100 text-green-700"
                          : order.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : order.status === "cancelled"
                              ? "bg-red-100 text-red-700"
                              : order.status === "shipped"
                                ? "bg-purple-100 text-purple-700"
                                : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {order.status || "Processing"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaShoppingCart className="text-2xl text-gray-400" />
              </div>
              <p className="text-gray-500">No recent orders</p>
            </div>
          )}
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Top Products</h2>
            <Link
              to="/admin/products"
              className="text-[#10b981] hover:text-green-700 text-sm font-semibold"
            >
              View All
            </Link>
          </div>
          {products?.length > 0 ? (
            <div className="space-y-3">
              {products.slice(0, 5).map((product, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl mr-3 flex items-center justify-center overflow-hidden">
                      {product.images?.[0] ? (
                        <img
                          src={product.images[0]}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <FaBox className="text-white" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 truncate max-w-[150px]">
                        {product.name}
                      </p>
                      <p className="text-sm text-gray-500">${product.price}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center text-yellow-500 mb-1">
                      <FaStar className="mr-1 text-xs" />
                      <span className="text-sm font-medium">
                        {product.rating?.toFixed(1) || "0.0"}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-600">
                      Stock: {product.stock || 0}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaBox className="text-2xl text-gray-400" />
              </div>
              <p className="text-gray-500">No products available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
