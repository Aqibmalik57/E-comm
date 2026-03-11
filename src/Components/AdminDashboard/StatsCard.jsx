import React from "react";
import { Link } from "react-router-dom";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

const StatsCard = ({
  title,
  value,
  icon: Icon,
  color,
  link,
  trend,
  trendUp,
  subtitle,
  loading = false,
  iconBgColor,
}) => {
  const colorClasses = {
    blue: "from-blue-400 to-blue-600",
    green: "from-green-400 to-green-600",
    purple: "from-purple-400 to-purple-600",
    orange: "from-orange-400 to-orange-600",
    pink: "from-pink-400 to-pink-600",
    yellow: "from-yellow-400 to-yellow-600",
    emerald: "from-emerald-400 to-emerald-600",
    indigo: "from-indigo-400 to-indigo-600",
    red: "from-red-400 to-red-600",
    cyan: "from-cyan-400 to-cyan-600",
  };

  const gradientClass = colorClasses[color] || colorClasses.green;

  const CardWrapper = link ? Link : "div";
  const wrapperProps = link ? { to: link } : {};

  return (
    <CardWrapper {...wrapperProps} className="block group">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1 h-full">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
            {loading ? (
              <div className="space-y-2">
                <div className="h-9 w-24 bg-gray-200 animate-pulse rounded-lg" />
                <div className="h-3 w-16 bg-gray-200 animate-pulse rounded" />
              </div>
            ) : (
              <>
                <h3 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-1">
                  {value}
                </h3>
                {subtitle && (
                  <p className="text-xs text-gray-400">{subtitle}</p>
                )}
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
              </>
            )}
          </div>
          <div
            className={`p-3 lg:p-4 rounded-2xl bg-gradient-to-br ${gradientClass} transform group-hover:scale-110 transition-transform duration-300`}
          >
            <Icon size={22} className="text-white" />
          </div>
        </div>
      </div>
    </CardWrapper>
  );
};

// Compact Stats Card for smaller displays
export const CompactStatsCard = ({ title, value, color, icon: Icon }) => {
  const colorClasses = {
    blue: "bg-blue-50 border-blue-200",
    green: "bg-green-50 border-green-200",
    purple: "bg-purple-50 border-purple-200",
    orange: "bg-orange-50 border-orange-200",
    pink: "bg-pink-50 border-pink-200",
    yellow: "bg-yellow-50 border-yellow-200",
    emerald: "bg-emerald-50 border-emerald-200",
  };

  const iconColorClasses = {
    blue: "text-blue-500",
    green: "text-green-500",
    purple: "text-purple-500",
    orange: "text-orange-500",
    pink: "text-pink-500",
    yellow: "text-yellow-500",
    emerald: "text-emerald-500",
  };

  const bgClass = colorClasses[color] || colorClasses.green;
  const iconClass = iconColorClasses[color] || iconColorClasses.green;

  return (
    <div className={`p-4 rounded-xl border ${bgClass}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500 mb-1">{title}</p>
          <p className="text-xl font-bold text-gray-800">{value}</p>
        </div>
        <div className={`p-2 rounded-lg ${bgClass}`}>
          <Icon className={iconClass} size={18} />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
