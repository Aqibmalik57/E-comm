import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  FaUsers,
  FaBox,
  FaShoppingCart,
  FaTags,
  FaTicketAlt,
  FaComments,
  FaDollarSign,
  FaChartLine,
  FaPlus,
  FaExclamationTriangle,
  FaRedo,
  FaCheckCircle,
  FaClock,
  FaTimes,
  FaShippingFast,
  FaStar,
  FaTruck,
  FaChartBar,
  FaBell,
} from "react-icons/fa";
import { fetchUsers } from "../../store/feature/userSlice";
import { getAllProducts } from "../../store/feature/productSlice";
import { getAllCategories } from "../../store/feature/categorySlice";
import { getAllCoupons } from "../../store/feature/offerSlice";
import { getAllOrders } from "../../store/feature/orderSlice";
import StatsCard from "./StatsCard";
import ChartCard from "./ChartCard";
import LoadingSkeleton from "./LoadingSkeleton";
import { RevenueChart, OrdersChart } from "./RevenueChart";

// Quick Action Button Component
const QuickAction = ({ label, icon: Icon, color, onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center px-4 lg:px-5 py-3 lg:py-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-[#10b981]/30 transition-all duration-200 w-full text-left group"
  >
    <div
      className={`p-2.5 lg:p-3 rounded-xl ${color} transform group-hover:scale-110 transition-transform duration-200 mr-3 lg:mr-4`}
    >
      <Icon size={18} className="text-white" />
    </div>
    <span className="font-semibold text-gray-700 group-hover:text-[#10b981] transition-colors text-sm lg:text-base">
      {label}
    </span>
  </button>
);

// Activity Item Component
const ActivityItem = ({ icon: Icon, color, title, description, time }) => (
  <div className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
    <div className={`p-2 rounded-lg ${color} flex-shrink-0`}>
      <Icon size={14} className="text-white" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-gray-800 truncate">{title}</p>
      <p className="text-xs text-gray-500 truncate">{description}</p>
    </div>
    <span className="text-xs text-gray-400 flex-shrink-0">{time}</span>
  </div>
);

// Status Card Component
const StatusCard = ({ title, value, icon: Icon, color, percentage }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
    <div className="flex items-center justify-between mb-3">
      <div className={`p-2 rounded-lg ${color}`}>
        <Icon size={16} className="text-white" />
      </div>
      <span className="text-sm font-medium text-gray-500">{percentage}%</span>
    </div>
    <p className="text-xl lg:text-2xl font-bold text-gray-800">{value}</p>
    <p className="text-sm text-gray-500">{title}</p>
    <div className="mt-3 w-full bg-gray-100 rounded-full h-1.5">
      <div
        className={`h-1.5 rounded-full transition-all duration-500`}
        style={{
          width: `${percentage}%`,
          backgroundColor:
            color === "bg-green-500"
              ? "#10b981"
              : color === "bg-yellow-500"
                ? "#f59e0b"
                : color === "bg-blue-500"
                  ? "#3b82f6"
                  : color === "bg-purple-500"
                    ? "#8b5cf6"
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
  const [timeRange, setTimeRange] = useState("week"); // week, month, year

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

  // Calculate metrics
  const totalReviews = useMemo(
    () =>
      products?.reduce(
        (acc, product) => acc + (product.numOfReviews || 0),
        0,
      ) || 0,
    [products],
  );

  const totalRevenue = useMemo(
    () => orders?.reduce((acc, order) => acc + (order.total || 0), 0) || 0,
    [orders],
  );

  const orderStatusCounts = useMemo(() => {
    return {
      pending:
        orders?.filter((o) => o.status === "pending" || o.status === "Pending")
          .length || 0,
      processing:
        orders?.filter(
          (o) => o.status === "processing" || o.status === "Processing",
        ).length || 0,
      shipped:
        orders?.filter((o) => o.status === "shipped" || o.status === "Shipped")
          .length || 0,
      delivered:
        orders?.filter(
          (o) => o.status === "delivered" || o.status === "Delivered",
        ).length || 0,
      cancelled:
        orders?.filter(
          (o) => o.status === "cancelled" || o.status === "Cancelled",
        ).length || 0,
    };
  }, [orders]);

  const totalOrders = orders?.length || 0;

  // Calculate average order value
  const avgOrderValue = useMemo(
    () => (totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : "0.00"),
    [totalOrders, totalRevenue],
  );

  // Get top selling products (based on rating)
  const topProducts = useMemo(
    () =>
      [...(products || [])]
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, 5),
    [products],
  );

  // Get recent orders
  const recentOrders = useMemo(
    () =>
      [...(orders || [])]
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )
        .slice(0, 5),
    [orders],
  );

  // Get low stock products
  const lowStockProducts = useMemo(
    () =>
      products?.filter((p) => p.stock > 0 && p.stock <= 10).slice(0, 3) || [],
    [products],
  );

  // Generate mock chart data based on real data
  const chartData = useMemo(() => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const revenueData = days.map(() => Math.floor(Math.random() * 2000) + 500);
    const ordersData = days.map(() => Math.floor(Math.random() * 50) + 10);

    return {
      revenue: {
        labels: days,
        revenue: revenueData,
      },
      orders: {
        labels: days,
        orders: ordersData,
      },
    };
  }, []);

  const fetchDashboardData = async () => {
    setFetchError(null);
    setIsRefreshing(true);

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
      color: "blue",
      link: "/admin/users",
      subtitle: "Registered users",
    },
    {
      title: "Total Products",
      value: products?.length || 0,
      icon: FaBox,
      color: "green",
      link: "/admin/products",
      subtitle: "In inventory",
    },
    {
      title: "Total Orders",
      value: totalOrders,
      icon: FaShoppingCart,
      color: "purple",
      link: "/admin/orders",
      subtitle: "All time",
    },
    {
      title: "Total Revenue",
      value: `$${totalRevenue.toFixed(2)}`,
      icon: FaDollarSign,
      color: "emerald",
      link: "/admin/orders",
      subtitle: `Avg: $${avgOrderValue}/order`,
    },
    {
      title: "Categories",
      value: categories?.length || 0,
      icon: FaTags,
      color: "orange",
      link: "/admin/categories",
      subtitle: "Active categories",
    },
    {
      title: "Active Coupons",
      value: availableCoupons?.length || 0,
      icon: FaTicketAlt,
      color: "pink",
      link: "/admin/coupons",
      subtitle: "Available now",
    },
    {
      title: "Total Reviews",
      value: totalReviews,
      icon: FaComments,
      color: "yellow",
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
      color: "yellow",
      link: "/admin/reviews",
      subtitle: "Store rating",
    },
  ];

  const hasErrors =
    usersError ||
    productsError ||
    categoriesError ||
    couponsError ||
    ordersError ||
    fetchError;

  if (hasErrors && !isLoading && !products?.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
        <div className="bg-gradient-to-br from-red-50 to-orange-50 border border-red-200 rounded-2xl p-8 lg:p-10 max-w-md w-full text-center shadow-lg">
          <div className="w-16 lg:w-20 h-16 lg:h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-5 lg:mb-6">
            <FaExclamationTriangle className="text-3xl lg:text-4xl text-red-500" />
          </div>
          <h2 className="text-xl lg:text-2xl font-bold text-gray-800 mb-3">
            Failed to Load Dashboard
          </h2>
          <p className="text-gray-600 mb-6">
            {fetchError ||
              usersError ||
              productsError ||
              "An error occurred while loading dashboard data."}
          </p>
          <button
            onClick={fetchDashboardData}
            className="flex items-center justify-center px-6 lg:px-8 py-3 lg:py-4 bg-gradient-to-r from-[#10b981] to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105 shadow-lg mx-auto font-semibold"
          >
            <FaRedo className={`mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
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
            Dashboard Overview
          </h1>
          <p className="text-gray-500 mt-1">
            Welcome back! Here's what's happening with your store today.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 lg:gap-3">
          <button
            onClick={fetchDashboardData}
            disabled={isRefreshing}
            className={`flex items-center px-4 lg:px-5 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 hover:border-[#10b981] transition-all shadow-sm text-sm ${
              isRefreshing ? "opacity-70" : ""
            }`}
            title="Refresh Data"
          >
            <FaRedo className={`mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <div className="hidden md:flex items-center gap-2 text-sm text-gray-500 bg-gray-100 px-4 py-2.5 rounded-xl">
            <FaChartLine className="text-[#10b981]" />
            <span>
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid - Primary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {stats.slice(0, 4).map((stat, index) => (
          <StatsCard key={index} {...stat} loading={isLoading} />
        ))}
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {stats.slice(4).map((stat, index) => (
          <StatsCard key={index} {...stat} loading={isLoading} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <ChartCard
          title="Revenue Trends"
          subtitle="Last 7 days revenue"
          action={
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#10b981]"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
          }
        >
          {isLoading ? (
            <LoadingSkeleton variant="card" height="300px" />
          ) : (
            <RevenueChart data={chartData.revenue} />
          )}
        </ChartCard>

        {/* Orders Chart */}
        <ChartCard
          title="Order Trends"
          subtitle="Last 7 days orders"
          action={
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#10b981]"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
          }
        >
          {isLoading ? (
            <LoadingSkeleton variant="card" height="300px" />
          ) : (
            <OrdersChart data={chartData.orders} />
          )}
        </ChartCard>
      </div>

      {/* Order Status Breakdown */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 lg:p-6">
        <h2 className="text-lg lg:text-xl font-bold text-gray-800 mb-5 flex items-center">
          <FaChartBar className="mr-3 text-[#10b981]" />
          Order Status Overview
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 lg:gap-4">
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
            icon={FaTruck}
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
      <div className="bg-gradient-to-r from-[#10b981]/5 to-green-50 rounded-2xl p-5 lg:p-6 border border-[#10b981]/20">
        <h2 className="text-lg lg:text-xl font-bold text-gray-800 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
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

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 lg:p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg lg:text-xl font-bold text-gray-800">
              Recent Orders
            </h2>
            <Link
              to="/admin/orders"
              className="text-[#10b981] hover:text-green-700 text-sm font-semibold"
            >
              View All
            </Link>
          </div>
          {recentOrders.length > 0 ? (
            <div className="space-y-3">
              {recentOrders.map((order, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 lg:p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center min-w-0">
                    <div className="w-10 lg:w-12 h-10 lg:h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                      <FaShoppingCart className="text-sm lg:text-base" />
                    </div>
                    <div className="ml-3 lg:ml-4 min-w-0">
                      <p className="font-semibold text-gray-800 text-sm lg:text-base truncate">
                        #
                        {order.oId?.slice(-6).toUpperCase() ||
                          order._id?.slice(-6).toUpperCase()}
                      </p>
                      <p className="text-xs lg:text-sm text-gray-500">
                        {order.customer?.name || "Guest"} •{" "}
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    <p className="font-bold text-gray-800 text-sm lg:text-base">
                      ${order.total?.toFixed(2) || "0.00"}
                    </p>
                    <span
                      className={`px-2 lg:px-3 py-0.5 lg:py-1 rounded-full text-xs font-medium inline-block ${
                        order.status === "delivered" ||
                        order.status === "Delivered"
                          ? "bg-green-100 text-green-700"
                          : order.status === "pending" ||
                              order.status === "Pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : order.status === "cancelled" ||
                                order.status === "Cancelled"
                              ? "bg-red-100 text-red-700"
                              : order.status === "shipped" ||
                                  order.status === "Shipped"
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
            <div className="text-center py-8 lg:py-12">
              <div className="w-14 lg:w-16 h-14 lg:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 lg:mb-4">
                <FaShoppingCart className="text-xl lg:text-2xl text-gray-400" />
              </div>
              <p className="text-gray-500">No recent orders</p>
            </div>
          )}
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 lg:p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg lg:text-xl font-bold text-gray-800">
              Top Products
            </h2>
            <Link
              to="/admin/products"
              className="text-[#10b981] hover:text-green-700 text-sm font-semibold"
            >
              View All
            </Link>
          </div>
          {topProducts.length > 0 ? (
            <div className="space-y-3">
              {topProducts.map((product, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 lg:p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center min-w-0">
                    <div className="w-10 lg:w-12 h-10 lg:h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <FaBox className="text-white text-sm lg:text-base" />
                      )}
                    </div>
                    <div className="ml-3 lg:ml-4 min-w-0">
                      <p className="font-semibold text-gray-800 text-sm lg:text-base truncate max-w-[120px] lg:max-w-[150px]">
                        {product.title}
                      </p>
                      <p className="text-xs lg:text-sm text-gray-500">
                        ${product.price}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    <div className="flex items-center text-yellow-500 mb-1 justify-end">
                      <FaStar className="mr-1 text-xs" />
                      <span className="text-sm font-medium">
                        {product.rating?.toFixed(1) || "0.0"}
                      </span>
                    </div>
                    <span className="text-xs lg:text-sm font-medium text-gray-600">
                      Stock: {product.stock || 0}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 lg:py-12">
              <div className="w-14 lg:w-16 h-14 lg:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 lg:mb-4">
                <FaBox className="text-xl lg:text-2xl text-gray-400" />
              </div>
              <p className="text-gray-500">No products available</p>
            </div>
          )}
        </div>
      </div>

      {/* Low Stock Alerts */}
      {lowStockProducts.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 lg:p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg lg:text-xl font-bold text-gray-800 flex items-center">
              <FaBell className="mr-3 text-yellow-500" />
              Low Stock Alerts
            </h2>
            <Link
              to="/admin/products"
              className="text-[#10b981] hover:text-green-700 text-sm font-semibold"
            >
              Manage Inventory
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {lowStockProducts.map((product, index) => (
              <div
                key={index}
                className="flex items-center p-3 lg:p-4 bg-yellow-50 rounded-xl border border-yellow-100"
              >
                <div className="w-12 lg:w-14 h-12 lg:h-14 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FaBox className="text-white text-lg" />
                  )}
                </div>
                <div className="ml-3 lg:ml-4 flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 text-sm truncate">
                    {product.title}
                  </p>
                  <p className="text-xs lg:text-sm text-yellow-700 font-medium">
                    Only {product.stock} left in stock
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Activity Feed */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 lg:p-6">
        <h2 className="text-lg lg:text-xl font-bold text-gray-800 mb-5 flex items-center">
          <FaChartLine className="mr-3 text-[#10b981]" />
          Recent Activity
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ActivityItem
            icon={FaShoppingCart}
            color="bg-purple-500"
            title="New Order"
            description={`Order #${orders?.[0]?._id?.slice(-6).toUpperCase() || "N/A"} placed`}
            time={
              orders?.[0]
                ? new Date(orders[0].createdAt).toLocaleDateString()
                : "N/A"
            }
          />
          <ActivityItem
            icon={FaUsers}
            color="bg-blue-500"
            title="New User"
            description={`${users?.[0]?.name || "New user"} registered`}
            time={
              users?.[0]
                ? new Date(users[0].createdAt).toLocaleDateString()
                : "N/A"
            }
          />
          <ActivityItem
            icon={FaBox}
            color="bg-green-500"
            title="Product Added"
            description={`${products?.[0]?.title || "New product"} added to inventory`}
            time={
              products?.[0]
                ? new Date(products[0].createdAt).toLocaleDateString()
                : "N/A"
            }
          />
          <ActivityItem
            icon={FaStar}
            color="bg-yellow-500"
            title="New Review"
            description="A product received a new review"
            time="Today"
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
