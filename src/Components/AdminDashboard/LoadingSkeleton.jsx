import React from "react";

const LoadingSkeleton = ({
  variant = "text",
  width,
  height,
  className = "",
  rounded = "rounded-lg",
}) => {
  const baseClasses = "animate-pulse bg-gray-200";

  const variantClasses = {
    text: "h-4",
    title: "h-8 w-3/4",
    avatar: "rounded-full",
    card: "h-48",
    button: "h-10 w-24",
    input: "h-10",
    table: "h-12",
    image: "",
  };

  const style = {
    width: width || (variant === "image" ? "100%" : undefined),
    height: height || (variant === "image" ? "200px" : undefined),
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${rounded} ${className}`}
      style={style}
    />
  );
};

// Table row skeleton
export const TableRowSkeleton = ({ columns = 5 }) => {
  return (
    <tr className="animate-pulse">
      {[...Array(columns)].map((_, i) => (
        <td key={i} className="px-6 py-4">
          <LoadingSkeleton variant="text" />
        </td>
      ))}
    </tr>
  );
};

// Card skeleton
export const CardSkeleton = ({ count = 1 }) => {
  return (
    <>
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-5"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 space-y-3">
              <LoadingSkeleton variant="text" width="60%" />
              <LoadingSkeleton variant="title" width="40%" />
            </div>
            <LoadingSkeleton
              variant="avatar"
              width="48px"
              height="48px"
              rounded="rounded-xl"
            />
          </div>
        </div>
      ))}
    </>
  );
};

// Dashboard stats skeleton
export const DashboardStatsSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 space-y-3">
              <LoadingSkeleton variant="text" width="50%" />
              <LoadingSkeleton variant="title" width="70%" />
              <LoadingSkeleton variant="text" width="30%" />
            </div>
            <LoadingSkeleton
              variant="avatar"
              width="48px"
              height="48px"
              rounded="rounded-xl"
            />
          </div>
        </div>
      ))}
    </div>
  );
};

// Chart skeleton
export const ChartSkeleton = ({ height = "300px" }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 lg:p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-2">
          <LoadingSkeleton variant="text" width="120px" />
          <LoadingSkeleton variant="text" width="80px" />
        </div>
        <div className="flex gap-2">
          <LoadingSkeleton variant="button" width="80px" />
          <LoadingSkeleton variant="button" width="80px" />
        </div>
      </div>
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
    </div>
  );
};

// List item skeleton
export const ListItemSkeleton = () => {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
      <div className="flex items-center gap-3">
        <LoadingSkeleton
          variant="avatar"
          width="40px"
          height="40px"
          rounded="rounded-lg"
        />
        <div className="space-y-2">
          <LoadingSkeleton variant="text" width="100px" />
          <LoadingSkeleton variant="text" width="60px" />
        </div>
      </div>
      <LoadingSkeleton variant="text" width="50px" />
    </div>
  );
};

export default LoadingSkeleton;
