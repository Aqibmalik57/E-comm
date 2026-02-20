import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addToCart } from "../../store/feature/CartSlice";
import {
  FaStar,
  FaMinus,
  FaPlus,
  FaTimes,
  FaEye,
  FaHeadset,
} from "react-icons/fa";
import { HiOutlineShoppingBag } from "react-icons/hi";
import { toast } from "react-toastify";

const QuickViewModal = ({ product, isOpen, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);

  if (!isOpen || !product) return null;

  const calculateRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  const handleAddToCart = async () => {
    try {
      await dispatch(addToCart({ productId: product._id, quantity })).unwrap();
    } catch (backendError) {
      toast.error(backendError || "Failed to add to cart");
    }
  };

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 text-left">
      {/* 1. Added max-h-[90vh] and overflow-y-auto so it's scrollable on mobile.
          2. Kept your p-8 and gap-8 for large screens.
      */}
      <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full relative overflow-y-auto md:overflow-hidden flex flex-col md:flex-row p-6 md:p-8 gap-6 md:gap-8 max-h-[95vh]">
        {/* Close Button - Added z-20 and mobile positioning */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-[#ff4b4b] text-white p-2 rounded-lg hover:bg-red-600 transition-colors z-20"
        >
          <FaTimes size={20} />
        </button>

        {/* Left Side: Product Image */}
        <div className="w-full md:w-1/2 flex items-center justify-center bg-white">
          <img
            src={product.imageUrl}
            alt={product.title}
            // Made height auto on mobile to prevent stretching, kept 400px for md+
            className="w-full h-auto max-h-[300px] md:h-[400px] object-contain rounded-lg"
          />
        </div>

        {/* Right Side: Product Details */}
        <div className="w-full md:w-1/2 flex flex-col items-start">
          {/* Stock Info */}
          <div className="text-[#10b981] text-sm mb-1">
            In stock: <span className="font-semibold">{product.stock}</span>
          </div>

          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-1">
            {product.title}
          </h2>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-3">
            <div className="flex text-[#ffb800]">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  size={14}
                  className={
                    i < Math.floor(calculateRating(product.reviews))
                      ? "fill-current"
                      : "text-gray-200"
                  }
                />
              ))}
            </div>
            <span className="text-gray-400 text-sm ml-1">
              {calculateRating(product.reviews)} ({product.reviews?.length || 0}{" "}
              reviews)
            </span>
          </div>

          {/* Description */}
          <p className="text-gray-500 text-[13px] leading-relaxed mb-4">
            {product.description}
          </p>

          {/* Price */}
          <div className="text-2xl font-bold text-gray-900 mb-6">
            ${product.price}
          </div>

          {/* Quantity and Action Buttons Row - Wrapped in flex-wrap for small screens */}
          <div className="flex flex-wrap items-center gap-3 mb-6 w-full">
            <div className="flex items-center border border-gray-200 rounded-md h-12">
              <button
                onClick={decrementQuantity}
                className="px-3 text-gray-400 hover:text-gray-600"
              >
                <FaMinus size={10} />
              </button>
              <span className="px-4 font-medium text-gray-700 w-12 text-center">
                {quantity}
              </span>
              <button
                onClick={incrementQuantity}
                className="px-3 text-gray-400 hover:text-gray-600"
              >
                <FaPlus size={10} />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className="flex-1 bg-[#10b981] text-white h-12 px-4 rounded-md font-medium flex items-center justify-center gap-2 hover:bg-[#059669] transition-all min-w-[140px]"
            >
              <div className="border border-white/30 rounded p-0.5">
                <HiOutlineShoppingBag size={18} />
              </div>
              <span>Add to cart</span>
            </button>

            <button
              onClick={() => navigate(`/product/${product._id}`)}
              className="bg-[#f3f4f6] text-gray-600 h-12 px-4 rounded-md font-medium flex items-center justify-center gap-2 hover:bg-gray-200 transition-all text-sm whitespace-nowrap w-full sm:w-auto"
            >
              <FaEye /> View details
            </button>
          </div>

          {/* Category & Tags */}
          <div className="space-y-3">
            <div className="text-sm font-semibold text-gray-800">
              Category:{" "}
              <span className="font-normal text-gray-500 ml-1">
                {typeof product.category === "object"
                  ? product.category.name
                  : product.category}
              </span>
            </div>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-[#f9fafb] text-gray-400 text-xs rounded border border-gray-100">
                {typeof product.category === "object"
                  ? product.category.name
                  : product.category}
              </span>
            </div>
          </div>

          {/* Contact Support Footer */}
          <div className="mt-8 flex items-center gap-2">
            <FaHeadset className="text-gray-400" />
            <span className="text-sm text-gray-600">Call Us for Order</span>
            <span className="text-[#10b981] font-bold">+099949343</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;
