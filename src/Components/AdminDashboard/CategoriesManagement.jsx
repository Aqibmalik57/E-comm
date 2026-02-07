import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  FaSearch,
  FaEdit,
  FaTrash,
  FaPlus,
  FaFolder,
  FaImage,
  FaExclamationTriangle,
  FaRedo,
} from "react-icons/fa";
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../store/feature/categorySlice";

const CategoriesManagement = () => {
  const dispatch = useDispatch();
  const { categories, loading, error } = useSelector((state) => state.category);

  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [fetchError, setFetchError] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
  });

  const loadCategories = async () => {
    setFetchError(null);
    try {
      await dispatch(getAllCategories()).unwrap();
    } catch (err) {
      setFetchError(err || "Failed to load categories");
      toast.error("Failed to load categories. Please try again.");
    }
  };

  useEffect(() => {
    loadCategories();
  });

  // Filter categories
  const filteredCategories = categories?.filter(
    (category) =>
      category.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      image: "",
    });
    setEditingCategory(null);
  };

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name || "",
      description: category.description || "",
      image: category.image || "",
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingCategory) {
        await dispatch(
          updateCategory({
            categoryId: editingCategory._id,
            updateData: formData,
          }),
        ).unwrap();
        toast.success("Category updated successfully");
      } else {
        await dispatch(createCategory(formData)).unwrap();
        toast.success("Category created successfully");
      }

      setShowModal(false);
      resetForm();
      loadCategories();
    } catch (err) {
      toast.error(err || "Failed to save category");
    }
  };

  const handleDelete = async (categoryId) => {
    if (deleteConfirm === categoryId) {
      try {
        await dispatch(deleteCategory(categoryId)).unwrap();
        setDeleteConfirm(null);
        toast.success("Category deleted successfully");
        loadCategories();
      } catch (err) {
        toast.error(err || "Failed to delete category");
        setDeleteConfirm(null);
      }
    } else {
      setDeleteConfirm(categoryId);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  if (loading && !categories?.length) {
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
            Failed to Load Categories
          </h2>
          <p className="text-gray-600 mb-6">
            {fetchError ||
              error ||
              "An error occurred while loading categories."}
          </p>
          <button
            onClick={loadCategories}
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
            Categories Management
          </h1>
          <p className="text-gray-500 mt-1">
            Organize your products with categories
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={loadCategories}
            className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            title="Refresh Categories"
          >
            <FaRedo className="mr-2" />
            Refresh
          </button>
          <button
            onClick={openCreateModal}
            className="flex items-center px-4 py-2 bg-[#10b981] text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <FaPlus className="mr-2" />
            Add Category
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#10b981] focus:border-transparent outline-none"
          />
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredCategories?.length > 0 ? (
          filteredCategories.map((category) => (
            <div
              key={category._id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Category Image */}
              <div className="h-40 bg-gradient-to-br from-[#10b981] to-green-600 relative flex items-center justify-center">
                {category.image ? (
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FaFolder className="text-white text-5xl opacity-50" />
                )}
                <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                <h3 className="absolute bottom-4 left-4 text-white font-bold text-xl">
                  {category.name}
                </h3>
              </div>

              {/* Category Info */}
              <div className="p-4">
                <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                  {category.description || "No description available"}
                </p>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>Products: {category.productCount || 0}</span>
                  <span>
                    Created: {new Date(category.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => openEditModal(category)}
                    className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <FaEdit className="mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(category._id)}
                    className={`flex-1 flex items-center justify-center px-3 py-2 rounded-lg transition-colors ${
                      deleteConfirm === category._id
                        ? "bg-red-500 text-white"
                        : "bg-red-50 text-red-600 hover:bg-red-100"
                    }`}
                  >
                    <FaTrash className="mr-1" />
                    {deleteConfirm === category._id ? "Confirm" : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-gray-500 bg-white rounded-xl shadow-sm border border-gray-100">
            <FaFolder className="mx-auto text-4xl text-gray-300 mb-3" />
            <p>No categories found</p>
            <button
              onClick={openCreateModal}
              className="mt-4 text-[#10b981] hover:text-green-700 font-medium"
            >
              Create your first category
            </button>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-800">
                {editingCategory ? "Edit Category" : "Create New Category"}
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#10b981] focus:border-transparent outline-none"
                  placeholder="e.g., Electronics"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#10b981] focus:border-transparent outline-none"
                  placeholder="Brief description of the category..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL
                </label>
                <div className="relative">
                  <FaImage className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#10b981] focus:border-transparent outline-none"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#10b981] text-white rounded-lg hover:bg-green-700"
                >
                  {editingCategory ? "Update Category" : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesManagement;
