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
  FaArrowUp,
  FaArrowDown,
  FaPlus,
  FaExclamationTriangle,
  FaRedo,
} from "react-icons/fa";
import { fetchUsers } from "../../store/feature/userSlice";
import { getAllProducts } from "../../store/feature/productSlice";
import { getAllCategories } from "../../store/feature/categorySlice";
import { getAllCoupons } from "../../store/feature/offerSlice";
import { getMyOrders } from "../../store/feature/orderSlice";

const StatCard = ({
  title,
  value,
  icon: Icon,
  color,
  link,
  trend,
  trendUp,
}) => (
  <Link to={link} className="block">
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
          {trend && (
            <div
              className={`flex items-center mt-2 text-sm ${trendUp ? "text-green-500" : "text-red-500"}`}
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
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon size={24} className="text-white" />
        </div>
      </div>
    </div>
  </Link>
);

const QuickAction = ({ label, icon: Icon, color, onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center px-4 py-3 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 w-full text-left"
  >
    <div className={`p-2 rounded-lg ${color} mr-3`}>
      <Icon size={18} className="text-white" />
    </div>
    <span className="font-medium text-gray-700">{label}</span>
  </button>
);

const DashboardOverview = () => {
  const dispatch = useDispatch();
  const [fetchError, setFetchError] = useState(null);

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

  const fetchDashboardData = async () => {
    setFetchError(null);
    try {
      await Promise.all([
        dispatch(fetchUsers()).unwrap(),
        dispatch(getAllProducts()).unwrap(),
        dispatch(getAllCategories()).unwrap(),
        dispatch(getAllCoupons()).unwrap(),
        dispatch(getMyOrders()).unwrap(),
      ]);
    } catch (error) {
      setFetchError(error || "Failed to load dashboard data");
      toast.error("Failed to load dashboard data. Please try again.");
    }
  };

  useEffect(() => {
    fetchDashboardData();
  });

  const stats = [
    {
      title: "Total Users",
      value: usersLoading ? "..." : users?.length || 0,
      icon: FaUsers,
      color: "bg-blue-500",
      link: "/admin/users",
      trend: "12%",
      trendUp: true,
    },
    {
      title: "Total Products",
      value: productsLoading ? "..." : products?.length || 0,
      icon: FaBox,
      color: "bg-green-500",
      link: "/admin/products",
      trend: "8%",
      trendUp: true,
    },
    {
      title: "Total Orders",
      value: ordersLoading ? "..." : orders?.length || 0,
      icon: FaShoppingCart,
      color: "bg-purple-500",
      link: "/admin/orders",
      trend: "15%",
      trendUp: true,
    },
    {
      title: "Categories",
      value: categoriesLoading ? "..." : categories?.length || 0,
      icon: FaTags,
      color: "bg-orange-500",
      link: "/admin/categories",
    },
    {
      title: "Active Coupons",
      value: couponsLoading ? "..." : availableCoupons?.length || 0,
      icon: FaTicketAlt,
      color: "bg-pink-500",
      link: "/admin/coupons",
    },
    {
      title: "Reviews",
      value: "0", // Will calculate from products
      icon: FaComments,
      color: "bg-yellow-500",
      link: "/admin/reviews",
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

  if (hasErrors) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 max-w-md w-full text-center">
          <FaExclamationTriangle className="mx-auto text-5xl text-red-500 mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">
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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Dashboard Overview
          </h1>
          <p className="text-gray-500 mt-1">
            Welcome back! Here's what's happening with your store.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={fetchDashboardData}
            className="p-2 text-gray-500 hover:text-[#10b981] hover:bg-green-50 rounded-lg transition-colors"
            title="Refresh Data"
          >
            <FaRedo />
          </button>
          <div className="text-sm text-gray-500">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/admin/products" className="block">
            <QuickAction
              label="Add New Product"
              icon={FaPlus}
              color="bg-green-500"
            />
          </Link>
          <Link to="/admin/categories" className="block">
            <QuickAction
              label="Add Category"
              icon={FaPlus}
              color="bg-orange-500"
            />
          </Link>
          <Link to="/admin/coupons" className="block">
            <QuickAction
              label="Create Coupon"
              icon={FaPlus}
              color="bg-pink-500"
            />
          </Link>
          <Link to="/admin/users" className="block">
            <QuickAction
              label="Manage Users"
              icon={FaUsers}
              color="bg-blue-500"
            />
          </Link>
        </div>
      </div>

      {/* Recent Activity & Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800">Recent Orders</h2>
            <Link
              to="/admin/orders"
              className="text-[#10b981] hover:text-green-700 text-sm font-medium"
            >
              View All
            </Link>
          </div>
          {orders?.length > 0 ? (
            <div className="space-y-3">
              {orders.slice(0, 5).map((order, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-800">
                      Order #{order._id?.slice(-6)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      order.status === "delivered"
                        ? "bg-green-100 text-green-700"
                        : order.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : order.status === "cancelled"
                            ? "bg-red-100 text-red-700"
                            : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {order.status || "Processing"}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No recent orders</p>
          )}
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800">Top Products</h2>
            <Link
              to="/admin/products"
              className="text-[#10b981] hover:text-green-700 text-sm font-medium"
            >
              View All
            </Link>
          </div>
          {products?.length > 0 ? (
            <div className="space-y-3">
              {products.slice(0, 5).map((product, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-200 rounded-lg mr-3 flex items-center justify-center">
                      {product.images?.[0] ? (
                        <img
                          src={product.images[0]}
                          alt=""
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <FaBox className="text-gray-400" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 truncate max-w-[150px]">
                        {product.name}
                      </p>
                      <p className="text-sm text-gray-500">${product.price}</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-600">
                    Stock: {product.stock || 0}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              No products available
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
