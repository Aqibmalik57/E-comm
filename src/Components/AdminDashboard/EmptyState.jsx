import React from "react";
import {
  FaBox,
  FaUsers,
  FaShoppingCart,
  FaTags,
  FaTicketAlt,
  FaComment,
  FaPlus,
} from "react-icons/fa";

const icons = {
  users: FaUsers,
  products: FaBox,
  orders: FaShoppingCart,
  categories: FaTags,
  coupons: FaTicketAlt,
  reviews: FaComment,
};

const EmptyState = ({
  type = "generic",
  title = "No items found",
  description = "Get started by creating your first item.",
  actionLabel = "Create New",
  onAction,
  icon: CustomIcon,
}) => {
  const Icon = CustomIcon || icons[type] || FaBox;

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Icon className="text-gray-400 text-3xl" />
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-500 text-center max-w-sm mb-6">{description}</p>
      {onAction && (
        <button
          onClick={onAction}
          className="flex items-center px-4 py-2 bg-[#10b981] text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <FaPlus className="mr-2" />
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
