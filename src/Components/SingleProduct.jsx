import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  getSingleProduct,
  getAllProducts,
} from "../store/feature/productSlice";
import { addToCart } from "../store/feature/CartSlice";
import Navbar from "./Navbar/Navbar";
import Footer from "./Footer/Footer";
import {
  FaStar,
  FaMinus,
  FaPlus,
  FaHeadset,
  FaRegHeart,
  FaTruck,
  FaLeaf,
} from "react-icons/fa";
import { HiOutlineShoppingBag } from "react-icons/hi";

const SingleProduct = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { product, loading, error } = useSelector((state) => state.product);
  const { user } = useSelector((state) => state.user);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (id) dispatch(getSingleProduct(id));
    dispatch(getAllProducts());
  }, [dispatch, id]);

  const handleAddToCart = () => {
    if (user && product) {
      dispatch(
        addToCart({ userId: user._id, productId: product._id, quantity }),
      );
    }
  };

  const rating = product?.reviews?.length
    ? (
        product.reviews.reduce((sum, r) => sum + r.rating, 0) /
        product.reviews.length
      ).toFixed(1)
    : "4.8";

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-500 rounded-full animate-spin"></div>
      </div>
    );

  if (error || !product)
    return (
      <div className="text-center py-20 text-red-500 font-bold">
        Product Not Found
      </div>
    );

  return (
    <div className="bg-[#fcfcfd] min-h-screen font-sans antialiased text-gray-900">
      <Navbar />

      <main className="max-w-[1400px] mx-auto px-4 md:px-12 py-6">
        {/* Breadcrumb - Minimalist */}
        <nav className="flex items-center gap-2 text-[11px] uppercase tracking-[2px] text-gray-400 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="hover:text-emerald-600 transition-colors"
          >
            Product
          </button>
          <span className="text-gray-300">/</span>
          <span className="text-gray-900 font-bold">{product.category}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          {/* LEFT: Image Stage */}
          <div className="lg:col-span-7">
            <div className="sticky top-24 bg-white rounded-[40px] border border-gray-100 p-8 md:p-16 flex items-center justify-center min-h-[400px] lg:min-h-[550px] shadow-sm overflow-hidden group">
              {/* Dynamic Badge System */}
              <div className="absolute top-10 left-10 flex flex-wrap gap-2 z-10">
                {product.stock < 5 && product.stock > 0 && (
                  <span className="bg-orange-100 text-orange-600 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border border-orange-200">
                    Low Stock
                  </span>
                )}
                {product.isNew && (
                  <span className="bg-emerald-500 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-emerald-100">
                    New
                  </span>
                )}
                {product.tags?.includes("organic") && (
                  <span className="bg-white border border-gray-100 text-gray-900 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest flex items-center gap-2 shadow-sm">
                    <FaLeaf className="text-emerald-500" /> Organic
                  </span>
                )}
              </div>

              {/* Decorative background circle */}
              <div className="absolute inset-0 bg-[radial-gradient(#f0fdf4_1px,transparent_1px)] [background-size:20px_20px] opacity-40"></div>

              <img
                src={product.imageUrl}
                alt={product.title}
                className="w-full max-w-[450px] relative z-10 h-auto object-contain drop-shadow-2xl transform group-hover:scale-110 transition-transform duration-1000 ease-in-out"
              />
            </div>
          </div>

          {/* RIGHT: Product Details */}
          <div className="lg:col-span-5 flex flex-col pt-4">
            <div className="space-y-6">
              <div className="space-y-2">
                <p className="text-emerald-600 text-xs font-black uppercase tracking-[0.2em]">
                  {product.category}
                </p>
                <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight tracking-tighter">
                  {product.title}
                </h1>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex text-[#ffb800] gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      size={14}
                      className={
                        i < Math.floor(rating)
                          ? "fill-current"
                          : "text-gray-200"
                      }
                    />
                  ))}
                </div>
                <span className="text-gray-400 text-[11px] font-bold tracking-widest uppercase border-l border-gray-200 pl-4">
                  {product.reviews?.length || 0} Reviews
                </span>
              </div>

              <div className="flex items-baseline gap-4">
                <span className="text-5xl font-black text-gray-900">
                  ${product.price}
                </span>
                {product.oldPrice && (
                  <span className="text-gray-300 line-through text-xl font-bold">
                    ${product.oldPrice}
                  </span>
                )}
              </div>

              <p className="text-gray-500 text-lg leading-relaxed font-medium">
                {product.description ||
                  "Premium quality product selected for its durability and exceptional performance."}
              </p>

              {/* Purchase Experience Card */}
              <div className="bg-[#f8fafc] rounded-[32px] p-8 border border-gray-200/50 mt-8">
                <div className="flex items-center justify-between mb-6">
                  <label className="text-xs font-black text-gray-500 uppercase tracking-widest">
                    Quantity
                  </label>
                  <span
                    className={`text-[10px] font-black px-3 py-1 rounded-full uppercase ${product.stock > 0 ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}
                  >
                    {product.stock > 0
                      ? `In Stock (${product.stock})`
                      : "Sold Out"}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex items-center justify-between bg-white rounded-2xl p-1 border border-gray-200 w-full sm:w-32">
                    <button
                      onClick={() => setQuantity((q) => (q > 1 ? q - 1 : 1))}
                      className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-emerald-500 transition-colors"
                    >
                      <FaMinus size={10} />
                    </button>
                    <span className="font-black text-gray-900">{quantity}</span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-emerald-500 transition-colors"
                    >
                      <FaPlus size={10} />
                    </button>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock <= 0}
                    className="flex-1 bg-gray-900 hover:bg-emerald-600 text-white h-[52px] rounded-2xl font-black flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50 disabled:bg-gray-400"
                  >
                    <HiOutlineShoppingBag size={20} />
                    {product.stock > 0 ? "ADD TO CART" : "OUT OF STOCK"}
                  </button>

                  <button className="w-[52px] h-[52px] rounded-2xl bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-100 transition-all shadow-sm">
                    <FaRegHeart size={18} />
                  </button>
                </div>
              </div>

              {/* Trust Badges - Generic & Professional */}
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="flex items-center gap-3 p-4 rounded-2xl border border-gray-100 bg-white shadow-sm">
                  <div className="text-gray-900 bg-gray-50 w-10 h-10 rounded-xl flex items-center justify-center">
                    <FaTruck size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-gray-400 leading-none mb-1">
                      Shipping
                    </p>
                    <p className="text-xs font-bold text-gray-800">Worldwide</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-2xl border border-gray-100 bg-white shadow-sm">
                  <div className="text-gray-900 bg-gray-50 w-10 h-10 rounded-xl flex items-center justify-center">
                    <FaHeadset size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-gray-400 leading-none mb-1">
                      Support
                    </p>
                    <p className="text-xs font-bold text-gray-800">
                      24/7 Policy
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- REVIEWS: Ultra-Modern Layout --- */}
        <div className="mt-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div className="max-w-md">
              <h2 className="text-4xl font-black mb-4 tracking-tighter uppercase">
                What the community says
              </h2>
              <p className="text-gray-400 font-medium">
                Join over 1,000+ happy customers who have integrated our fresh
                produce into their daily lifestyle.
              </p>
            </div>
            <div className="flex items-center gap-8 bg-white p-6 rounded-[30px] border border-gray-100 shadow-sm">
              <div className="text-center">
                <p className="text-4xl font-black text-gray-900">{rating}</p>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Avg. Rating
                </p>
              </div>
              <div className="h-12 w-[1px] bg-gray-100"></div>
              <div className="text-center">
                <p className="text-4xl font-black text-gray-900">
                  {product.reviews?.length || 24}
                </p>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Reviews
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {(product.reviews?.length > 0
              ? product.reviews
              : [
                  {
                    _id: "s1",
                    user: { name: "Sarah J." },
                    rating: 5,
                    comment:
                      "I'm extremely picky about my organic produce, but this blew me away. The color, the scent, and the taste are all 10/10.",
                    date: "Feb 12, 2026",
                  },
                  {
                    _id: "s2",
                    user: { name: "Mark Wilson" },
                    rating: 5,
                    comment:
                      "Shipped in eco-friendly packaging which I love. Everything arrived crisp and cold. Incredible service!",
                    date: "Jan 30, 2026",
                  },
                  {
                    _id: "s3",
                    user: { name: "Elena R." },
                    rating: 4,
                    comment:
                      "The quality is undeniable. I wish there were more size options, but otherwise, this is my new go-to store.",
                    date: "Jan 15, 2026",
                  },
                ]
            ).map((rev) => (
              <div
                key={rev._id}
                className="bg-white p-10 rounded-[40px] border border-gray-100 hover:shadow-2xl hover:shadow-emerald-100/50 transition-all duration-500 flex flex-col justify-between"
              >
                <div>
                  <div className="flex text-emerald-500 mb-6 gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        size={12}
                        className={
                          i < rev.rating ? "fill-current" : "text-gray-100"
                        }
                      />
                    ))}
                  </div>
                  <p className="text-gray-600 font-medium leading-relaxed mb-8 italic">
                    "{rev.comment}"
                  </p>
                </div>
                <div className="flex items-center gap-4 pt-6 border-t border-gray-50">
                  <div className="w-12 h-12 bg-gray-900 text-white rounded-2xl flex items-center justify-center font-black">
                    {rev.user.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-black text-sm text-gray-900 uppercase tracking-wider">
                      {rev.user.name}
                    </p>
                    <p className="text-[10px] font-bold text-gray-400">
                      {rev.date || "Verified Purchase"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SingleProduct;
