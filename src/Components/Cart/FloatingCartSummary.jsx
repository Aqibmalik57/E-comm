import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { FiShoppingBag } from "react-icons/fi";

const FloatingCartSummary = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.items);
  console.log("Cart Items:", cartItems);

  // 1. Calculate Total Items (This was likely working)
  const totalItems =
    cartItems?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0;

  const totalPrice =
    cartItems?.reduce((sum, item) => {
      // Check for price in both populated (productId.price)
      // and flat (item.price) structures
      const price = item.productId?.price || item.price || 0;

      return sum + price * item.quantity;
    }, 0) || 0;
  // Only show on home page and when cart has items
  if (location.pathname !== "/") return null;

  return (
    <div
      onClick={() => navigate("/cart")}
      className="fixed top-48 right-2 z-[999] cursor-pointer select-none"
    >
      {/* Container: Glass effect with a subtle border-glow */}
      <div className="flex items-center bg-white/80 backdrop-blur-xl border border-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-[22px] p-2 pr-5 gap-3 transition-transform active:scale-95">
        {/* Left Side: Icon with Gradient and Badge */}
        <div className="relative flex-shrink-0">
          <div className="h-12 w-12 bg-gradient-to-br from-[#10b981] to-[#059669] rounded-[18px] flex items-center justify-center shadow-lg shadow-[#10b981]/30">
            <FiShoppingBag className="text-white text-xl" />
          </div>

          {/* Item Count Badge: Clean and legible */}
          <div className="absolute -top-1.5 -right-1.5 bg-[#111827] text-white text-[10px] font-black h-5 w-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
            {totalItems}
          </div>
        </div>

        {/* Right Side: Textual Info */}
        <div className="flex flex-col">
          <span className="text-gray-400 font-bold text-[9px] uppercase tracking-[0.15em] leading-none mb-1">
            My Basket
          </span>
          <div className="flex items-center">
            <span className="text-gray-900 font-black text-lg tracking-tight">
              <span className="text-[#10b981] mr-0.5 text-sm font-bold">$</span>
              {totalPrice.toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}
            </span>
          </div>
        </div>

        {/* Vertical Separator line for a more "organized" feel */}
        <div className="h-8 w-[1px] bg-gray-200 ml-1" />

        {/* Action arrow - looks good without needing hover */}
        <div className="text-gray-300 text-lg">→</div>
      </div>
    </div>
  );
};

export default FloatingCartSummary;
