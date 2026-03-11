import React from "react";

const ChartCard = ({
  title,
  subtitle,
  children,
  action,
  className = "",
  noPadding = false,
}) => {
  return (
    <div
      className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden ${className}`}
    >
      {/* Header */}
      <div className="px-5 lg:px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-800">{title}</h3>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>
          )}
        </div>
        {action && <div className="flex items-center gap-2">{action}</div>}
      </div>

      {/* Chart Content */}
      <div className={noPadding ? "" : "p-5 lg:p-6"}>{children}</div>
    </div>
  );
};

// Loading skeleton for charts
export const ChartSkeleton = ({ height = "300px" }) => {
  return (
    <div className="animate-pulse" style={{ height }}>
      <div className="flex items-end justify-between h-full gap-2 px-4">
        {[...Array(7)].map((_, i) => (
          <div
            key={i}
            className="w-full bg-gray-200 rounded-t-lg"
            style={{
              height: `${Math.random() * 60 + 20}%`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ChartCard;
