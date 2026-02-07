import React from "react";

const LoadingSpinner = ({
  size = "md",
  fullScreen = false,
  text = "Loading...",
}) => {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-10 h-10",
    lg: "w-16 h-16",
    xl: "w-24 h-24",
  };

  const spinner = (
    <div
      className={`${sizeClasses[size]} border-4 border-gray-200 border-t-[#10b981] rounded-full animate-spin`}
    />
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-90 flex flex-col items-center justify-center z-50">
        {spinner}
        {text && <p className="mt-4 text-gray-600 font-medium">{text}</p>}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-12">
      {spinner}
      {text && <p className="mt-4 text-gray-500 text-sm">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
