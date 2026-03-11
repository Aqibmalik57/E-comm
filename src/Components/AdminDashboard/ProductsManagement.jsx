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
  FaTag,
  FaThLarge,
  FaList,
  FaCheck,
  FaTimes,
  FaExclamationTriangle,
  FaToggleOn,
  FaToggleOff,
  FaUndo,
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
  const [stockFilter, setStockFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    discount: "",
    tags: "",
    subCategory: "",
    imageUrl: "",
  });

  const itemsPerPage = viewMode === "grid" ? 12 : 10;

  const loadProducts = async (showError = true) => {
    setFetchError(null);
    try {
      await dispatch(getAllProducts()).unwrap();
      await dispatch(getAllCategories()).unwrap();
    } catch (err) {
      if (showError) {
        toast.error("Failed to load products. Please try again.");
      }
      throw err;
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Filter products
  const filteredProducts = products?.filter((product) => {
    const matchesSearch =
      product.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const categoryName = product.category?.name || product.category;
    const matchesCategory =
      categoryFilter === "all" || categoryName === categoryFilter;

    const matchesStock =
      stockFilter === "all" ||
      (stockFilter === "in" && product.stock > 10) ||
      (stockFilter === "low" && product.stock > 0 && product.stock <= 10) ||
      (stockFilter === "out" && product.stock === 0);

    return matchesSearch && matchesCategory && matchesStock;
  });

  // Pagination
  const totalPages = Math.ceil((filteredProducts?.length || 0) / itemsPerPage);
  const paginatedProducts = filteredProducts?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Handle select all
  useEffect(() => {
    if (selectAll) {
      setSelectedProducts(paginatedProducts?.map((p) => p._id) || []);
    } else {
      setSelectedProducts([]);
    }
  }, [selectAll, paginatedProducts]);

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
      title: "",
      description: "",
      price: "",
      stock: "",
      category: "",
      discount: "",
      tags: "",
      subCategory: "",
      imageUrl: "",
    });
    setImagePreview("");
    setEditingProduct(null);
  };

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    const categoryName = product.category?.name || product.category || "";
    setFormData({
      title: product.title || "",
      description: product.description || "",
      price: product.price || "",
      stock: product.stock || "",
      category: categoryName,
      discount: product.discount || "",
      tags: product.tags?.join(", ") || "",
      subCategory: product.subCategory || "",
      imageUrl: product.imageUrl || "",
    });
    setImagePreview(product.imageUrl || "");
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const productData = {
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock),
      discount: Number(formData.discount) || 0,
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
      loadProducts(false);
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
        loadProducts(false);
      } catch (error) {
        toast.error(error || "Failed to delete product");
        setDeleteConfirm(null);
      }
    } else {
      setDeleteConfirm(productId);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  const toggleProductSelection = (productId) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId],
    );
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
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
            Products Management
          </h1>
          <p className="text-gray-500 mt-1">
            Manage your product inventory ({filteredProducts?.length || 0}{" "}
            products)
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => loadProducts()}
            className="flex items-center px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 hover:border-[#10b981] transition-colors shadow-sm"
            title="Refresh Products"
          >
            <FaRedo className="mr-2" />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <button
            onClick={openCreateModal}
            className="flex items-center px-4 py-2.5 bg-[#10b981] text-white rounded-xl hover:bg-green-700 transition-colors shadow-md hover:shadow-lg"
          >
            <FaPlus className="mr-2" />
            Add Product
          </button>
        </div>
      </div>

      {/* Filters & View Toggle */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products by title or description..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#10b981] focus:border-transparent outline-none"
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <FaFilter className="text-gray-400" />
              <select
                value={categoryFilter}
                onChange={(e) => {
                  setCategoryFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#10b981] focus:border-transparent outline-none"
              >
                <option value="all">All Categories</option>
                {categories?.map((cat) => (
                  <option key={cat._id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <select
              value={stockFilter}
              onChange={(e) => {
                setStockFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#10b981] focus:border-transparent outline-none"
            >
              <option value="all">All Stock</option>
              <option value="in">In Stock</option>
              <option value="low">Low Stock</option>
              <option value="out">Out of Stock</option>
            </select>
            <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2.5 transition-colors ${
                  viewMode === "grid"
                    ? "bg-[#10b981] text-white"
                    : "bg-white text-gray-500 hover:bg-gray-50"
                }`}
              >
                <FaThLarge size={16} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2.5 transition-colors ${
                  viewMode === "list"
                    ? "bg-[#10b981] text-white"
                    : "bg-white text-gray-500 hover:bg-gray-50"
                }`}
              >
                <FaList size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Products Display */}
      {viewMode === "grid" ? (
        /* Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
          {paginatedProducts?.length > 0 ? (
            paginatedProducts.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group"
              >
                {/* Product Image */}
                <div className="h-44 lg:h-48 bg-gray-100 relative">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FaBox className="text-gray-300 text-4xl" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2 flex flex-col gap-1">
                    {product.discount > 0 && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                        {product.discount}% OFF
                      </span>
                    )}
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
                  {/* Quick Actions Overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={() => openEditModal(product)}
                      className="p-2 bg-white rounded-lg text-gray-700 hover:bg-[#10b981] hover:text-white transition-colors"
                      title="Edit"
                    >
                      <FaEdit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className={`p-2 rounded-lg transition-colors ${
                        deleteConfirm === product._id
                          ? "bg-red-500 text-white"
                          : "bg-white text-red-500 hover:bg-red-500 hover:text-white"
                      }`}
                      title="Delete"
                    >
                      <FaTrash size={16} />
                    </button>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-1 truncate">
                    {product.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-3 line-clamp-2 h-10">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-[#10b981]">
                        ${product.price}
                      </span>
                      {product.discount > 0 && (
                        <span className="text-sm text-gray-400 line-through">
                          $
                          {(
                            product.price *
                            (1 + product.discount / 100)
                          ).toFixed(2)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center text-yellow-500">
                      <FaStar className="mr-1" />
                      <span className="text-sm">{product.ratings || 0}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{product.category?.name || product.category}</span>
                    <span>{product.reviews?.length || 0} reviews</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-gray-500 bg-white rounded-xl shadow-sm border border-gray-100">
              <FaBox className="mx-auto text-4xl text-gray-300 mb-3" />
              <p>No products found</p>
            </div>
          )}
        </div>
      ) : (
        /* List/Table View */
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={() => setSelectAll(!selectAll)}
                      className="rounded border-gray-300 text-[#10b981] focus:ring-[#10b981]"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                    Product
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                    Price
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                    Stock
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                    Rating
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedProducts?.length > 0 ? (
                  paginatedProducts.map((product) => (
                    <tr
                      key={product._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedProducts.includes(product._id)}
                          onChange={() => toggleProductSelection(product._id)}
                          className="rounded border-gray-300 text-[#10b981] focus:ring-[#10b981]"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                            {product.imageUrl ? (
                              <img
                                src={product.imageUrl}
                                alt={product.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <FaBox className="text-gray-400" />
                            )}
                          </div>
                          <div className="ml-3">
                            <p className="font-medium text-gray-800 truncate max-w-[200px]">
                              {product.title}
                            </p>
                            <p className="text-xs text-gray-500">
                              {product.reviews?.length || 0} reviews
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {product.category?.name || product.category || "N/A"}
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-medium text-gray-800">
                          ${product.price}
                        </span>
                        {product.discount > 0 && (
                          <span className="ml-2 text-xs text-green-600">
                            -{product.discount}%
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            product.stock > 10
                              ? "bg-green-100 text-green-700"
                              : product.stock > 0
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                          }`}
                        >
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center text-yellow-500">
                          <FaStar className="mr-1" />
                          <span>{product.ratings?.toFixed(1) || "0.0"}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(product)}
                            className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <FaEdit size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(product._id)}
                            className={`p-2 rounded-lg transition-colors ${
                              deleteConfirm === product._id
                                ? "bg-red-500 text-white"
                                : "text-red-500 hover:bg-red-50"
                            }`}
                            title="Delete"
                          >
                            <FaTrash size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-4 py-12 text-center text-gray-500"
                    >
                      No products found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

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
              className="px-4 py-2 border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors"
            >
              Previous
            </button>
            <div className="flex gap-1">
              {[...Array(Math.min(5, totalPages))].map((_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 py-2 rounded-lg transition-colors ${
                      currentPage === page
                        ? "bg-[#10b981] text-white"
                        : "border border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto my-8">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
              <h3 className="text-xl font-bold text-gray-800">
                {editingProduct ? "Edit Product" : "Create New Product"}
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#10b981] focus:border-transparent outline-none"
                    placeholder="Enter product title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#10b981] focus:border-transparent outline-none"
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
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Sub Category
                </label>
                <input
                  type="text"
                  name="subCategory"
                  value={formData.subCategory}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#10b981] focus:border-transparent outline-none"
                  placeholder="e.g., vegetables, fruits"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#10b981] focus:border-transparent outline-none"
                  placeholder="Product description..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
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
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#10b981] focus:border-transparent outline-none"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#10b981] focus:border-transparent outline-none"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Discount (%)
                  </label>
                  <input
                    type="number"
                    name="discount"
                    value={formData.discount}
                    onChange={handleInputChange}
                    min="0"
                    max="100"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#10b981] focus:border-transparent outline-none"
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Tags
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#10b981] focus:border-transparent outline-none"
                  placeholder="fresh, organic, local (comma separated)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Product Image
                </label>
                <div className="space-y-3">
                  <input
                    type="url"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleImageUrlChange}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#10b981] focus:border-transparent outline-none"
                    placeholder="Or enter image URL"
                  />

                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="hidden"
                      id="product-image-upload"
                    />
                    <label
                      htmlFor="product-image-upload"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <FaImage className="text-gray-400 text-3xl mb-2" />
                      <span className="text-sm text-gray-500">
                        Click to upload an image
                      </span>
                    </label>
                  </div>

                  {imagePreview && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 mb-2">Preview:</p>
                      <div className="w-32 h-32 rounded-xl overflow-hidden border border-gray-200">
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

              <div className="flex gap-4 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="flex-1 px-5 py-3 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-5 py-3 bg-[#10b981] text-white rounded-xl hover:bg-green-700 font-medium shadow-md hover:shadow-lg transition-all"
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
