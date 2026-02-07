import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  FaSearch,
  FaTrash,
  FaStar,
  FaUser,
  FaBox,
  FaFilter,
  FaComment,
  FaExclamationTriangle,
  FaRedo,
} from "react-icons/fa";
import { getAllProducts, deleteReview } from "../../store/feature/productSlice";

const ReviewsManagement = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.product);

  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [fetchError, setFetchError] = useState(null);

  const itemsPerPage = 10;

  const loadReviews = async () => {
    setFetchError(null);
    try {
      await dispatch(getAllProducts()).unwrap();
    } catch (err) {
      setFetchError(err || "Failed to load reviews");
      toast.error("Failed to load reviews. Please try again.");
    }
  };

  useEffect(() => {
    loadReviews();
  });

  // Extract all reviews from products
  const allReviews =
    products?.reduce((acc, product) => {
      if (product.reviews && product.reviews.length > 0) {
        const productReviews = product.reviews.map((review) => ({
          ...review,
          productId: product._id,
          productName: product.name,
          productImage: product.images?.[0],
        }));
        return [...acc, ...productReviews];
      }
      return acc;
    }, []) || [];

  // Filter reviews
  const filteredReviews = allReviews.filter((review) => {
    const matchesSearch =
      review.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.productName?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRating =
      ratingFilter === "all" || review.rating === parseInt(ratingFilter);

    return matchesSearch && matchesRating;
  });

  // Pagination
  const totalPages = Math.ceil((filteredReviews?.length || 0) / itemsPerPage);
  const paginatedReviews = filteredReviews?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleDelete = async (reviewId, productId) => {
    if (deleteConfirm === reviewId) {
      try {
        await dispatch(deleteReview({ reviewId, productId })).unwrap();
        setDeleteConfirm(null);
        toast.success("Review deleted successfully");
        loadReviews();
      } catch (err) {
        toast.error(err || "Failed to delete review");
        setDeleteConfirm(null);
      }
    } else {
      setDeleteConfirm(reviewId);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  const renderStars = (rating) => {
    return Array(5)
      .fill(0)
      .map((_, index) => (
        <FaStar
          key={index}
          className={index < rating ? "text-yellow-400" : "text-gray-300"}
          size={14}
        />
      ));
  };

  if (loading && !products?.length) {
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
            Failed to Load Reviews
          </h2>
          <p className="text-gray-600 mb-6">
            {fetchError || error || "An error occurred while loading reviews."}
          </p>
          <button
            onClick={loadReviews}
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
            Reviews Management
          </h1>
          <p className="text-gray-500 mt-1">
            Monitor and manage product reviews
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={loadReviews}
            className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            title="Refresh Reviews"
          >
            <FaRedo className="mr-2" />
            Refresh
          </button>
          <div className="bg-[#10b981] text-white px-4 py-2 rounded-lg flex items-center">
            <FaComment className="mr-2" />
            <span className="font-semibold">
              {allReviews.length} Total Reviews
            </span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search reviews by user, comment, or product..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#10b981] focus:border-transparent outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <FaFilter className="text-gray-400" />
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#10b981] focus:border-transparent outline-none"
            >
              <option value="all">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reviews Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        {[5, 4, 3, 2, 1].map((rating) => {
          const count = allReviews.filter((r) => r.rating === rating).length;
          const percentage =
            allReviews.length > 0 ? (count / allReviews.length) * 100 : 0;

          return (
            <div
              key={rating}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-4"
            >
              <div className="flex items-center mb-2">
                <span className="font-bold text-gray-800 mr-2">{rating}</span>
                <FaStar className="text-yellow-400" />
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div
                  className="bg-yellow-400 h-2 rounded-full"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-500">{count} reviews</p>
            </div>
          );
        })}
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {paginatedReviews?.length > 0 ? (
          paginatedReviews.map((review) => (
            <div
              key={review._id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                {/* Product Info */}
                <div className="flex items-center sm:w-48 flex-shrink-0">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg mr-3 flex items-center justify-center overflow-hidden">
                    {review.productImage ? (
                      <img
                        src={review.productImage}
                        alt={review.productName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FaBox className="text-gray-400 text-xl" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 text-sm line-clamp-2">
                      {review.productName}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      ID: {review.productId?.slice(-8)}
                    </p>
                  </div>
                </div>

                {/* Review Content */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-[#10b981] rounded-full flex items-center justify-center text-white font-bold mr-2">
                        {review.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">
                          {review.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-lg">
                      {renderStars(review.rating)}
                      <span className="ml-1 text-sm font-medium text-yellow-700">
                        {review.rating}/5
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-3">{review.comment}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <FaUser className="mr-1" />
                      <span>User ID: {review.user?.slice(-8) || "N/A"}</span>
                    </div>
                    <button
                      onClick={() => handleDelete(review._id, review.productId)}
                      className={`flex items-center px-3 py-1 rounded-lg transition-colors text-sm ${
                        deleteConfirm === review._id
                          ? "bg-red-500 text-white"
                          : "bg-red-50 text-red-600 hover:bg-red-100"
                      }`}
                    >
                      <FaTrash className="mr-1" />
                      {deleteConfirm === review._id
                        ? "Confirm Delete"
                        : "Delete Review"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-gray-500 bg-white rounded-xl shadow-sm border border-gray-100">
            <FaComment className="mx-auto text-4xl text-gray-300 mb-3" />
            <p>No reviews found</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <p className="text-sm text-gray-500">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, filteredReviews?.length)} of{" "}
            {filteredReviews?.length} reviews
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
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewsManagement;
