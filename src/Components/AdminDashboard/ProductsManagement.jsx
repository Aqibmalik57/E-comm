import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  FaSearch,
  FaEdit,
  FaTrash,
  FaPlus,
  FaFilter,
  FaImage,
  FaStar,
  FaBox,
  FaRedo,
} from "react-icons/fa";
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../store/feature/productSlice";
import { getAllCategories } from "../../store/feature/categorySlice";

const ProductsManagement = () => {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.product);
  const { categories } = useSelector((state) => state.category);

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [imagePreview, setImagePreview] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    images: [],
    rating: 0,
    numOfReviews: 0,
  });

  const itemsPerPage = 10;

  const loadProducts = async () => {
    try {
      await Promise.all([
        dispatch(getAllProducts()).unwrap(),
        dispatch(getAllCategories()).unwrap(),
      ]);
    } catch (err) {
      toast.error("Failed to load products. Please try again.");
    }
  };

  useEffect(() => {
    loadProducts();
  });

  // Filter products
  const filteredProducts = products?.filter((product) => {
    const matchesSearch =
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" || product.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  // Pagination
  const totalPages = Math.ceil((filteredProducts?.length || 0) / itemsPerPage);
  const paginatedProducts = filteredProducts?.slice(
    (currentPage - 1) * itemsPerPage,
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreview(previews);
    setFormData((prev) => ({ ...prev, images: files }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      stock: "",
      category: "",
      images: [],
      rating: 0,
      numOfReviews: 0,
    });
    setImagePreview([]);
    setEditingProduct(null);
  };

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || "",
      description: product.description || "",
      price: product.price || "",
      stock: product.stock || "",
      category: product.category || "",
      images: [],
      rating: product.rating || 0,
      numOfReviews: product.numOfReviews || 0,
    });
    setImagePreview(product.images || []);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const productData = {
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock),
    };

    try {
      if (editingProduct) {
        await dispatch(
          updateProduct({
            productId: editingProduct._id,
            updateData: productData,
          }),
        ).unwrap();
        toast.success("Product updated successfully");
      } else {
        await dispatch(createProduct(productData)).unwrap();
        toast.success("Product created successfully");
      }

      setShowModal(false);
      resetForm();
      loadProducts();
    } catch (error) {
      toast.error(error || "Failed to save product");
    }
  };

  const handleDelete = async (productId) => {
    if (deleteConfirm === productId) {
      try {
        await dispatch(deleteProduct(productId)).unwrap();
        setDeleteConfirm(null);
        toast.success("Product deleted successfully");
        loadProducts();
      } catch (error) {
        toast.error(error || "Failed to delete product");
        setDeleteConfirm(null);
      }
    } else {
      setDeleteConfirm(productId);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  if (loading && !products?.length) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#10b981]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Products Management
          </h1>
          <p className="text-gray-500 mt-1">Manage your product inventory</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={loadProducts}
            className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            title="Refresh Products"
          >
            <FaRedo className="mr-2" />
            Refresh
          </button>
          <button
            onClick={openCreateModal}
            className="flex items-center px-4 py-2 bg-[#10b981] text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <FaPlus className="mr-2" />
            Add Product
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#10b981] focus:border-transparent outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <FaFilter className="text-gray-400" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#10b981] focus:border-transparent outline-none"
            >
              <option value="all">All Categories</option>
              {categories?.map((cat) => (
                <option key={cat._id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {paginatedProducts?.length > 0 ? (
          paginatedProducts.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Product Image */}
              <div className="h-48 bg-gray-100 relative">
                {product.images?.[0] ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FaBox className="text-gray-300 text-4xl" />
                  </div>
                )}
                <div className="absolute top-2 right-2 flex gap-1">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      product.stock > 10
                        ? "bg-green-100 text-green-700"
                        : product.stock > 0
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                    }`}
                  >
                    {product.stock > 0
                      ? `${product.stock} in stock`
                      : "Out of stock"}
                  </span>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-1 truncate">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-500 mb-2 line-clamp-2">
                  {product.description}
                </p>

                <div className="flex items-center justify-between mb-3">
                  <span className="text-lg font-bold text-[#10b981]">
                    ${product.price}
                  </span>
                  <div className="flex items-center text-yellow-500">
                    <FaStar className="mr-1" />
                    <span className="text-sm">{product.rating || 0}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>{product.category}</span>
                  <span>{product.numOfReviews || 0} reviews</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => openEditModal(product)}
                    className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <FaEdit className="mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className={`flex-1 flex items-center justify-center px-3 py-2 rounded-lg transition-colors ${
                      deleteConfirm === product._id
                        ? "bg-red-500 text-white"
                        : "bg-red-50 text-red-600 hover:bg-red-100"
                    }`}
                  >
                    <FaTrash className="mr-1" />
                    {deleteConfirm === product._id ? "Confirm" : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-gray-500">
            No products found
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <p className="text-sm text-gray-500">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, filteredProducts?.length)} of{" "}
            {filteredProducts?.length} products
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

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-800">
                {editingProduct ? "Edit Product" : "Create New Product"}
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#10b981] focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#10b981] focus:border-transparent outline-none"
                  >
                    <option value="">Select Category</option>
                    {categories?.map((cat) => (
                      <option key={cat._id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
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
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#10b981] focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#10b981] focus:border-transparent outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Images
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="product-images"
                  />
                  <label
                    htmlFor="product-images"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <FaImage className="text-gray-400 text-3xl mb-2" />
                    <span className="text-sm text-gray-500">
                      Click to upload images
                    </span>
                  </label>
                </div>

                {/* Image Previews */}
                {imagePreview.length > 0 && (
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {imagePreview.map((img, index) => (
                      <div
                        key={index}
                        className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200"
                      >
                        <img
                          src={img}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
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
                  {editingProduct ? "Update Product" : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsManagement;
