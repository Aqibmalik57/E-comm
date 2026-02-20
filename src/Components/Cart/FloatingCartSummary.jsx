import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { FiShoppingBag } from "react-icons/fi";

const FloatingCartSummary = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Access cart data from the nested state structure
  const cart = useSelector((state) => state.cart.cart);
  const cartItems = cart?.items || [];
  const total = cart?.total || 0;

  // Calculate Total Items
  const totalItems =
    cartItems?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0;

  // Use total from cart state (which includes discount calculation)
  const totalPrice = total;

  // Only show on home page and when cart has items
  if (location.pathname !== "/" || totalItems === 0) return null;

  return (
    <div
      onClick={() => navigate("/cart")}
      className="fixed top-32 lg:top-48 right-0 sm:right-2 z-[999] cursor-pointer select-none transition-all duration-300"
    >
      {/* Container: Glass effect - slightly smaller on mobile (p-1.5 vs p-2) */}
      <div className="flex items-center bg-white/90 backdrop-blur-xl border border-white shadow-[0_10px_30px_rgba(0,0,0,0.15)] rounded-l-full sm:rounded-[22px] p-1.5 lg:p-2 pr-4 lg:pr-5 gap-2 lg:gap-3 transition-transform active:scale-95">
        {/* Left Side: Icon with Badge */}
        <div className="relative flex-shrink-0">
          <div className="h-10 w-10 lg:h-12 lg:w-12 bg-gradient-to-br from-[#10b981] to-[#059669] rounded-full sm:rounded-[18px] flex items-center justify-center shadow-lg shadow-[#10b981]/30">
            <FiShoppingBag className="text-white text-lg lg:text-xl" />
          </div>

          {/* Item Count Badge */}
          <div className="absolute -top-1 -right-1 bg-[#111827] text-white text-[9px] lg:text-[10px] font-black h-4 w-4 lg:h-5 lg:w-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
            {totalItems}
          </div>
        </div>

        {/* Right Side: Textual Info (Hidden on very small screens if preferred, but here kept compact) */}
        <div className="flex flex-col">
          <span className="text-gray-400 font-bold text-[8px] lg:text-[9px] uppercase tracking-[0.1em] lg:tracking-[0.15em] leading-none mb-1">
            My Basket
          </span>
          <div className="flex items-center">
            <span className="text-gray-900 font-black text-sm lg:text-lg tracking-tight">
              <span className="text-[#10b981] mr-0.5 text-xs lg:text-sm font-bold">
                $
              </span>
              {totalPrice.toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}
            </span>
          </div>
        </div>

        {/* Vertical Separator line - Hidden on mobile to save space */}
        <div className="hidden sm:block h-8 w-[1px] bg-gray-200 ml-1" />

        {/* Action arrow - Hidden on mobile */}
        <div className="hidden sm:block text-gray-300 text-lg">→</div>
      </div>
    </div>
  );
};

export default FloatingCartSummary;
