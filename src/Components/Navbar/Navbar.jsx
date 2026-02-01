import { useEffect, useState, useRef } from "react";
import "./Navbar.css";
import { FiPhoneCall, FiShoppingCart } from "react-icons/fi";
import { RxPerson } from "react-icons/rx";
import Logo from "../../Assets/Images/logo-light_hls14v.svg";
import { IoIosArrowDown, IoIosSearch } from "react-icons/io";
import { FaRegBell } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearUserState, logout } from "../../store/feature/userSlice";
import { fetchCart } from "../../store/feature/CartSlice";
import { useTranslation } from "react-i18next";

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isPagesOpen, setIsPagesOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [navbarHeight, setNavbarHeight] = useState(0);
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const { user } = useSelector((state) => state.user);
  const { items } = useSelector((state) => state.cart);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const dropdownRef = useRef(null);
  const pagesRef = useRef(null);
  const langRef = useRef(null);

  const categories = [
    { name: "men", path: "/category/men", subcategories: [] },
    {
      name: "fish & meat",
      path: "/category/fish & meat",
      subcategories: ["Fish", "Meat"],
    },
    {
      name: "fruits & vegetable",
      path: "/category/fruits & vegetable",
      subcategories: ["Baby Food", "Fresh Fruit", "Dry Fruits"],
    },
    {
      name: "cooking",
      path: "/category/cooking",
      subcategories: ["Flour", "Oil"],
    },
    {
      name: "biscuit & cake",
      path: "/category/biscuit & cake",
      subcategories: ["Biscuits", "Cakes"],
    },
    {
      name: "household tools",
      path: "/category/household tools",
      subcategories: ["Water Filter", "Cleaning Tools", "Pest Control"],
    },
    {
      name: "pet care",
      path: "/category/pet care",
      subcategories: ["Dog Care", "Cat Care"],
    },
    {
      name: "Beauty & Health",
      path: "/category/Beauty & Health",
      subcategories: ["Women", "Men"],
    },
    { name: "jam & jelly", path: "/category/jam & jelly", subcategories: [] },
    {
      name: "milk & dairy",
      path: "/category/milk & dairy",
      subcategories: ["Milk", "Dairy"],
    },
    {
      name: "drinks",
      path: "/category/drinks",
      subcategories: ["Tea", "Water", "Juice"],
    },
    {
      name: "breakfast",
      path: "/category/breakfast",
      subcategories: ["Bread", "Cereal"],
    },
  ];

  const totalQuantity = items?.reduce((acc, curr) => acc + curr.quantity, 0);

  useEffect(() => {
    if (user?._id) {
      dispatch(fetchCart(user._id));
    }
  }, [dispatch, user?._id]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 30);
    const handleResize = () => {
      const navbar = document.querySelector(".Second-nav");
      if (navbar) setNavbarHeight(navbar.offsetHeight);
    };

    handleResize();
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target))
        setIsOpen(false);
      if (pagesRef.current && !pagesRef.current.contains(event.target))
        setIsPagesOpen(false);
      if (langRef.current && !langRef.current.contains(event.target))
        setIsLangOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      // This waits for the server to clear the cookie/session
      await dispatch(logout()).unwrap();

      // This wipes the Redux state completely
      dispatch(clearUserState());

      // Navigate immediately to home or login
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
      // Even if server fails, clear local state for safety
      dispatch(clearUserState());
      navigate("/login", { replace: true });
    }
  };

  return (
    <div className="Navbar">
      {/* Top Starter Nav */}
      <div className="starter-nav h-8 flex justify-between items-center">
        <div className="flex items-center text-xs ms-11 font-semibold text-neutral-700">
          <FiPhoneCall className="h-8" />
          &nbsp;&nbsp; {t("navbar.available")}&nbsp;
          <p className="text-green-500 font-bold">{t("navbar.phone")}</p>
        </div>
        <ul className="flex justify-evenly text-xs font-semibold text-neutral-700 me-11">
          <li className="border-r-2 w-20 border-neutral-500 text-center">
            <Link to="/about">{t("navbar.aboutUs")}</Link>
          </li>
          <li className="border-r-2 w-20 border-neutral-500 text-center">
            <Link to="/contact">{t("navbar.contactUs")}</Link>
          </li>
          <li className="border-r-2 w-20 border-neutral-500 text-center">
            <Link to={isLoggedIn ? "/profile" : "/login"}>
              {t("navbar.myAccount")}
            </Link>
          </li>
          <li className="w-16 flex justify-center">
            {!user ? (
              <Link
                to={isLoggedIn ? "/" : "/login"}
                className="flex justify-center"
              >
                <RxPerson className="h-auto me-1" /> {t("navbar.login")}
              </Link>
            ) : (
              <button
                onClick={handleLogout}
                className="flex justify-center items-center"
              >
                <RxPerson className="h-auto me-1" /> {t("navbar.logout")}
              </button>
            )}
          </li>
        </ul>
      </div>

      {/* Sticky Spacer */}
      <div style={{ height: isScrolled ? `${navbarHeight}px` : "auto" }}></div>

      {/* Main Nav Container */}
      <div
        className={`Second-nav ${isScrolled ? "fixed top-0 left-0 w-full z-50 shadow-md" : "relative"}`}
      >
        {/* Middle Search Nav */}
        <div className="Search-nav h-20 flex items-center">
          <Link to="/">
            <img src={Logo} alt="Logo" className="ms-11 h-9" />
          </Link>
          <div className="input ms-20 w-7/12 relative">
            <input
              type="text"
              placeholder="Search for products (e.g. fish, apple, oil)"
              className="p-2.5 px-5 w-full outline-0 rounded-md"
            />
            <IoIosSearch className="absolute right-3 top-2.5 text-2xl Iosearch" />
          </div>
          <div className="flex justify-between w-36 ms-auto me-14 text-white text-2xl">
            <FaRegBell />
            <div
              className="relative inline-block cursor-pointer"
              onClick={() => navigate("/cart")}
            >
              <FiShoppingCart className="text-2xl" />
              {user ? (
                <span className="absolute top-[-5px] right-[-15px] inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-white bg-red-600 rounded-full">
                  {totalQuantity}
                </span>
              ) : null}
            </div>
            <Link to={isLoggedIn ? "/profile" : "/login"}>
              <RxPerson />
            </Link>
          </div>
        </div>

        {/* Bottom Footer Nav */}
        <div className="footer-nav bg-white border-b flex items-center px-11 h-12">
          <ul className="flex items-center justify-between w-[550px] text-sm">
            {/* Categories */}
            <li className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center focus:outline-none font-medium"
              >
                {t("navbar.categories")}&nbsp;
                <IoIosArrowDown
                  className={`mt-1 transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
              </button>
              {isOpen && (
                <ul className="absolute top-full mt-2 rounded-md w-64 bg-white border border-gray-200 shadow-lg z-50 max-h-96 overflow-y-auto">
                  {categories.map((cat, i) => (
                    <li key={i} className="px-4 py-3 hover:bg-green-50">
                      <Link
                        to={cat.path}
                        onClick={() => setIsOpen(false)}
                        className="block capitalize font-medium text-gray-800"
                      >
                        {cat.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>

            <li>
              <Link
                to="/about"
                className="hover:text-green-600 text-sm font-medium"
              >
                {t("navbar.aboutUs")}
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="hover:text-green-600 text-sm font-medium"
              >
                {t("navbar.contactUs")}
              </Link>
            </li>

            {/* Pages */}
            <li className="relative" ref={pagesRef}>
              <button
                onClick={() => setIsPagesOpen(!isPagesOpen)}
                className="flex items-center focus:outline-none font-medium"
              >
                {t("navbar.pages")}&nbsp;
                <IoIosArrowDown
                  className={`mt-1 transition-transform ${isPagesOpen ? "rotate-180" : ""}`}
                />
              </button>
              {isPagesOpen && (
                <ul className="absolute top-full mt-2 rounded-md w-48 bg-white border border-gray-200 shadow-lg z-50">
                  {["offers", "faqs", "privacy-policy", "terms-conditions"].map(
                    (page) => (
                      <li key={page} className="px-4 py-2 hover:bg-green-50">
                        <Link
                          to={`/${page}`}
                          onClick={() => setIsPagesOpen(false)}
                          className="block capitalize text-gray-800"
                        >
                          {t(`${page.replace("-", "")}`)}
                        </Link>
                      </li>
                    ),
                  )}
                </ul>
              )}
            </li>

            <li className="relative text-red-600 bg-red-50 font-medium px-3 py-1 rounded-md">
              <Link to="/offers">{t("navbar.offers")}</Link>
              <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
            </li>
          </ul>

          {/* Language Switcher */}
          <div className="relative ms-auto flex items-center" ref={langRef}>
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-2 px-3 py-1 text-sm font-bold text-gray-700 border border-gray-200 rounded-lg bg-gray-50 hover:bg-white hover:border-green-500 transition-all"
            >
              <span className="uppercase">{i18n.language}</span>
              <IoIosArrowDown
                className={`text-xs transition-transform ${isLangOpen ? "rotate-180" : ""}`}
              />
            </button>

            {isLangOpen && (
              <ul className="absolute top-full right-0 mt-2 w-36 bg-white border border-gray-100 shadow-xl rounded-xl overflow-hidden z-[60]">
                {[
                  { code: "en", label: "English", flag: "🇺🇸" },
                  { code: "bn", label: "Bangla", flag: "🇧🇩" },
                  { code: "ar", label: "Arabic", flag: "🇸🇦" },
                ].map((lang) => (
                  <li key={lang.code}>
                    <button
                      onClick={() => {
                        i18n.changeLanguage(lang.code);
                        setIsLangOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                        i18n.language === lang.code
                          ? "bg-green-50 text-green-700 font-bold"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <span className="text-base">{lang.flag}</span>
                      {lang.label}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <ul className="flex items-center gap-6 ms-8 text-sm font-medium text-gray-600">
            <li>
              <Link to="/privacy-policy" className="hover:text-green-600">
                {t("navbar.privacyPolicy")}
              </Link>
            </li>
            <li>
              <Link to="/terms&Conditions" className="hover:text-green-600">
                {t("navbar.termsConditions")}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
