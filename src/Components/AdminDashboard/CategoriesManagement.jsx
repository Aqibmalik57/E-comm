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
  FaTags,
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
  const [imagePreview, setImagePreview] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    subcategories: "",
    imageUrl: "",
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
  }, []);

  // Filter categories by name
  const filteredCategories = categories?.filter((category) =>
    category.name?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUrlChange = (e) => {
    const url = e.target.value;
    setImagePreview(url);
    setFormData((prev) => ({ ...prev, imageUrl: url }));
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData((prev) => ({ ...prev, imageUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      subcategories: "",
      imageUrl: "",
    });
    setImagePreview("");
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
      subcategories: category.subcategories?.join(", ") || "",
      imageUrl: category.imageUrl || "",
    });
    setImagePreview(category.imageUrl || "");
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convert subcategories string to array
    const subcategoriesArray = formData.subcategories
      ? formData.subcategories
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

    const categoryData = {
      name: formData.name,
      subcategories: subcategoriesArray,
      image: formData.imageUrl,
    };

    try {
      if (editingCategory) {
        await dispatch(
          updateCategory({
            categoryId: editingCategory._id,
            updateData: categoryData,
          }),
        ).unwrap();
        toast.success("Category updated successfully");
      } else {
        await dispatch(createCategory(categoryData)).unwrap();
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
            placeholder="Search categories by name..."
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
                {category.imageUrl ? (
                  <img
                    src={category.imageUrl}
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FaFolder className="text-white text-5xl opacity-50" />
                )}
                <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                <h3 className="absolute bottom-4 left-4 text-white font-bold text-xl capitalize">
                  {category.name}
                </h3>
              </div>

              {/* Category Info */}
              <div className="p-4">
                {/* Subcategories */}
                {category.subcategories &&
                  category.subcategories.length > 0 && (
                    <div className="mb-3">
                      <div className="flex items-center mb-2">
                        <FaTags className="text-gray-400 text-xs mr-1" />
                        <span className="text-xs text-gray-500">
                          Subcategories ({category.subcategories.length})
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {category.subcategories
                          .slice(0, 3)
                          .map((sub, index) => (
                            <span
                              key={index}
                              className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded capitalize"
                            >
                              {sub}
                            </span>
                          ))}
                        {category.subcategories.length > 3 && (
                          <span className="text-xs text-gray-400">
                            +{category.subcategories.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>Products: {category.productCount || 0}</span>
                  <span>
                    Created:{" "}
                    {category.createdAt
                      ? new Date(category.createdAt).toLocaleDateString()
                      : "N/A"}
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#10b981] focus:border-transparent outline-none capitalize"
                  placeholder="e.g., Electronics"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subcategories
                </label>
                <input
                  type="text"
                  name="subcategories"
                  value={formData.subcategories}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#10b981] focus:border-transparent outline-none"
                  placeholder="e.g., mobile, laptop, accessories (comma separated)"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Separate subcategories with commas
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category Image *
                </label>
                <div className="space-y-2">
                  {/* Image URL Input */}
                  <input
                    type="url"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleImageUrlChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#10b981] focus:border-transparent outline-none"
                    placeholder="Or enter image URL"
                  />

                  {/* File Upload */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="hidden"
                      id="category-image-upload"
                    />
                    <label
                      htmlFor="category-image-upload"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <FaImage className="text-gray-400 text-3xl mb-2" />
                      <span className="text-sm text-gray-500">
                        Click to upload an image
                      </span>
                    </label>
                  </div>

                  {/* Image Preview */}
                  {imagePreview && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 mb-1">Preview:</p>
                      <div className="w-32 h-32 rounded-lg overflow-hidden border border-gray-200">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}
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
