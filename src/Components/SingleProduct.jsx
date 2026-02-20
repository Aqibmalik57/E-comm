import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  getSingleProduct,
  getAllProducts,
} from "../store/feature/productSlice";
import { addToCart } from "../store/feature/CartSlice";
import {
  FaStar,
  FaMinus,
  FaPlus,
  FaRegHeart,
  FaTruck,
  FaLeaf,
} from "react-icons/fa";
import { HiOutlineShoppingBag } from "react-icons/hi";
import { toast } from "react-toastify";

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

  const handleAddToCart = async () => {
    try {
      if (user && product) {
        await dispatch(
          addToCart({ productId: product._id, quantity }),
        ).unwrap();
      } else if (!user) {
        toast.warn("Please login to add items to cart");
      }
    } catch (err) {
      toast.error(err?.message || "Failed to add to cart");
    }
  };

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="w-10 h-10 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
      </div>
    );

  if (error || !product)
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] font-sans">
        <h2 className="text-2xl font-black text-slate-900">
          Product Not Found
        </h2>
        <button
          onClick={() => navigate("/")}
          className="mt-4 text-emerald-600 font-bold uppercase tracking-widest text-xs"
        >
          Return Home
        </button>
      </div>
    );

  return (
    <div className="bg-white min-h-screen font-sans selection:bg-emerald-100 selection:text-emerald-900">
      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-4 lg:py-10">
        {/* Navigation - Hidden on very small screens to save space */}
        <nav className="hidden sm:flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-slate-400 mb-8">
          <button
            onClick={() => navigate("/")}
            className="hover:text-emerald-600 transition-colors"
          >
            Shop
          </button>
          <span>/</span>
          <span className="text-slate-900 font-bold">
            {typeof product.category === "object"
              ? product.category.name
              : product.category}
          </span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-8 xl:gap-20">
          {/* LEFT: Image Section - Fixed height on mobile, sticky on desktop */}
          <div className="w-full lg:w-[55%] xl:w-[60%]">
            <div className="lg:sticky lg:top-28">
              <div className="relative aspect-square sm:aspect-[4/3] lg:aspect-square bg-slate-50 rounded-[2rem] sm:rounded-[3rem] overflow-hidden flex items-center justify-center p-8 md:p-12">
                {/* Badges */}
                <div className="absolute top-6 left-6 flex flex-col gap-2 z-10">
                  {product.isNew && (
                    <span className="bg-emerald-500 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-tighter shadow-sm">
                      New
                    </span>
                  )}
                  {product.stock < 5 && (
                    <span className="bg-white/90 backdrop-blur-sm text-orange-600 border border-orange-100 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-tighter">
                      Low Stock
                    </span>
                  )}
                </div>

                <img
                  src={product.imageUrl}
                  alt={product.title}
                  className="w-full h-full object-contain mix-blend-multiply transition-transform duration-700 hover:scale-105"
                />
              </div>
            </div>
          </div>

          {/* RIGHT: Content Section */}
          <div className="w-full lg:w-[45%] xl:w-[40%] flex flex-col">
            <div className="space-y-6">
              {/* Product Header */}
              <div className="space-y-2">
                <p className="text-emerald-600 text-[10px] font-black uppercase tracking-[0.2em]">
                  {typeof product.category === "object"
                    ? product.category.name
                    : product.category}
                </p>
                <h1 className="text-3xl sm:text-4xl xl:text-5xl font-black text-slate-900 tracking-tight leading-[1.1]">
                  {product.title}
                </h1>
                <div className="flex items-center gap-3 pt-2">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        size={12}
                        className={i < 4 ? "fill-current" : "text-slate-200"}
                      />
                    ))}
                  </div>
                  <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                    {product.reviews?.length || 0} Reviews
                  </span>
                </div>
              </div>

              {/* Pricing */}
              <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
                <span className="text-4xl font-black text-slate-900">
                  ${product.price}
                </span>
                {product.oldPrice && (
                  <span className="text-slate-300 line-through text-lg font-bold">
                    ${product.oldPrice}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
                {product.description ||
                  "Crafted with precision and care, this product represents our commitment to quality and sustainable sourcing."}
              </p>

              {/* Interaction Area */}
              <div className="space-y-4 pt-4">
                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">
                  <span>Quantity</span>
                  <span
                    className={
                      product.stock > 0 ? "text-emerald-600" : "text-red-500"
                    }
                  >
                    {product.stock > 0
                      ? `In Stock (${product.stock})`
                      : "Out of Stock"}
                  </span>
                </div>

                <div className="flex flex-wrap sm:flex-nowrap gap-3">
                  {/* Qty Selector */}
                  <div className="flex items-center justify-between bg-slate-50 rounded-xl p-1 border border-slate-100 w-full sm:w-32">
                    <button
                      onClick={() => setQuantity((q) => (q > 1 ? q - 1 : 1))}
                      className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors"
                    >
                      <FaMinus size={10} />
                    </button>
                    <span className="font-bold text-slate-900 text-sm">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors"
                    >
                      <FaPlus size={10} />
                    </button>
                  </div>

                  {/* Add to Cart - Primary Button */}
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock <= 0}
                    className="flex-1 bg-slate-900 hover:bg-emerald-600 text-white h-[52px] rounded-xl font-black text-[11px] tracking-[0.1em] flex items-center justify-center gap-3 transition-all active:scale-[0.97] disabled:bg-slate-200"
                  >
                    <HiOutlineShoppingBag size={18} />
                    {product.stock > 0 ? "ADD TO CART" : "OUT OF STOCK"}
                  </button>

                  {/* Wishlist */}
                  <button className="w-[52px] h-[52px] rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all">
                    <FaRegHeart size={18} />
                  </button>
                </div>
              </div>

              {/* Trust Features */}
              <div className="grid grid-cols-2 gap-3 pt-6">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <FaTruck className="text-slate-900" size={14} />
                  <span className="text-[10px] font-bold text-slate-700 uppercase tracking-tight">
                    Fast Shipping
                  </span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <FaLeaf className="text-emerald-500" size={14} />
                  <span className="text-[10px] font-bold text-slate-700 uppercase tracking-tight">
                    Eco Friendly
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* REVIEWS SECTION - Vertical on mobile, Grid on desktop */}
        <section className="mt-20 lg:mt-32">
          <div className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase tracking-tighter">
              Customer Stories
            </h2>
            <div className="h-1 w-12 bg-emerald-500 mt-4"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {(product.reviews?.length > 0
              ? product.reviews
              : [
                  {
                    _id: "s1",
                    user: { name: "Sarah J." },
                    rating: 5,
                    comment:
                      "Exceptional quality. Exceeded my expectations in every way.",
                    date: "Feb 2026",
                  },
                  {
                    _id: "s2",
                    user: { name: "Mark W." },
                    rating: 5,
                    comment:
                      "Fast delivery and the packaging was completely plastic-free. Love it!",
                    date: "Jan 2026",
                  },
                ]
            ).map((rev) => (
              <div
                key={rev._id}
                className="bg-white p-6 sm:p-8 rounded-[2rem] border border-slate-100 hover:border-emerald-100 hover:shadow-xl hover:shadow-emerald-500/5 transition-all"
              >
                <div className="flex text-emerald-500 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      size={10}
                      className={
                        i < rev.rating ? "fill-current" : "text-slate-100"
                      }
                    />
                  ))}
                </div>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6 italic">
                  "{rev.comment}"
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-slate-50">
                  <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center text-[10px] font-black">
                    {rev.user.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-900 uppercase">
                      {rev.user.name}
                    </p>
                    <p className="text-[9px] text-slate-400 font-bold">
                      {rev.date}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default SingleProduct;
