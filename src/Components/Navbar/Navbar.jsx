import React, { useEffect, useState, useRef } from "react";
import "./Navbar.css";
import { FiPhoneCall, FiShoppingCart } from "react-icons/fi";
import { RxPerson } from "react-icons/rx";
import Logo from "../../Assets/Images/logo-light_hls14v.svg";
import { IoIosArrowDown, IoIosArrowForward, IoIosSearch } from "react-icons/io";
import { FaRegBell } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/feature/userSlice";
import { fetchCart } from "../../store/feature/CartSlice";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isPagesOpen, setIsPagesOpen] = useState(false);
  const [navbarHeight, setNavbarHeight] = useState(0);
  const [isLogout, setIsLogout] = useState(false);
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

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

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const togglePagesDropdown = () => {
    setIsPagesOpen(!isPagesOpen);
  };
  const { items } = useSelector((state) => state.cart);

  useEffect(() => {
    if (user._id) {
      dispatch(fetchCart(user._id));
    }
  }, [dispatch, user._id]);

  const totalQuantity = items?.reduce((acc, curr) => {
    return acc + curr.quantity;
  }, 0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };

    const handleResize = () => {
      const navbar = document.querySelector(".Second-nav");
      if (navbar) {
        setNavbarHeight(navbar.offsetHeight);
      }
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
    if (isLogout) {
      navigate("/");
    }
  }, [navigate, isLogout]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    dispatch(logout());
    setIsLogout(true);
  };

  return (
    <div className="Navbar">
      <div className="starter-nav h-8 flex justify-between items-center">
        <p className="flex items-center text-xs ms-11 text-neutral-700">
          <FiPhoneCall className="h-8" />
          &nbsp;&nbsp; We are available 24/7, Need help?&nbsp;
          <p className="text-green-500 font-bold">+099949343</p>
        </p>
        <ul className="flex justify-evenly text-xs text-neutral-700 me-11">
          <li className="border-r-2 w-20 border-neutral-500 text-center">
            <Link to="/about">About Us</Link>
          </li>
          <li className="border-r-2 w-20 border-neutral-500 text-center">
            <Link to="/contact">Contact Us</Link>
          </li>
          <li className="border-r-2 w-20 border-neutral-500 text-center">
            <Link to="/profile">My Account</Link>
          </li>
          <li className="w-16 flex justify-center">
            {!user ? (
              isLoggedIn ? (
                <Link to="/home" className="flex justify-center">
                  <RxPerson className="h-auto me-1" />
                  Login
                </Link>
              ) : (
                <Link to="/" className="flex justify-center">
                  <RxPerson className="h-auto me-1" />
                  Login
                </Link>
              )
            ) : (
              <button
                onClick={handleLogout}
                className="flex justify-center items-center"
              >
                <RxPerson className="h-auto me-1" />
                Logout
              </button>
            )}
          </li>
        </ul>
      </div>

      <div style={{ height: isScrolled ? `${navbarHeight}px` : "auto" }}></div>

      <div
        className={`Second-nav ${
          isScrolled ? "fixed top-0 left-0 w-full z-50" : "relative"
        }`}
      >
        <div className="Search-nav h-20 flex items-center">
          <Link to="/home">
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
            <div className="relative inline-block">
              <FiShoppingCart
                className="text-2xl"
                onClick={() => navigate("/cart/add")}
              />
              <span className="absolute top-[-5px] right-[-15px] inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-white bg-red-600 rounded-full">
                {totalQuantity}
              </span>
            </div>
            <Link to="/profile">
              <RxPerson />
            </Link>
          </div>
        </div>
        <div className="footer-nav bg-white border-b flex justify-between">
          <ul className="flex h-12 items-center justify-between w-[500px] ms-11 text-sm">
            <li className="flex items-center">
              <button
                onClick={toggleDropdown}
                className="flex items-center focus:outline-none"
              >
                Categories&nbsp;
                <IoIosArrowDown className="mt-1" />
              </button>
              {isOpen && (
                <ul
                  ref={dropdownRef}
                  className="dropdown-list absolute top-[115px] mt-2 rounded-md w-64 bg-white border border-gray-200 shadow-lg z-50 max-h-96 overflow-y-auto"
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                  {categories.map((category, index) => (
                    <li
                      key={index}
                      className="px-4 py-3 hover:bg-blue-50 transition-colors duration-200"
                    >
                      <Link
                        to={category.path}
                        onClick={() => setIsOpen(false)} // Close dropdown on click
                        className="block capitalize font-medium text-gray-800"
                      >
                        {category.name}
                      </Link>
                      {category.subcategories.length > 0 && (
                        <ul className="mt-1 ml-4">
                          {category.subcategories.map((sub, subIndex) => (
                            <li
                              key={subIndex}
                              className="flex items-center text-sm text-gray-600 hover:text-blue-600 py-1"
                            >
                              <Link
                                to={`/category/${sub.toLowerCase()}`} // Subcategory navigation
                                onClick={() => setIsOpen(false)}
                                className="flex items-center"
                              >
                                <IoIosArrowForward className="mr-1 text-xs" />
                                <span>{sub}</span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </li>
            <li>
              <Link to="/about">About Us</Link>
            </li>
            <li>
              <Link to="/contact">Contact Us</Link>
            </li>
            <li className="flex items-center relative">
              <button
                onClick={togglePagesDropdown}
                className="flex items-center focus:outline-none"
              >
                Pages&nbsp;
                <IoIosArrowDown className="mt-1" />
              </button>
              {isPagesOpen && (
                <ul className="dropdown-list absolute top-[22px] mt-2 rounded-md w-48 bg-white border border-gray-200 shadow-lg z-50">
                  <li className="px-4 py-3 hover:bg-blue-50 transition-colors duration-200">
                    <Link
                      to="/offers"
                      className="block capitalize font-medium text-gray-800"
                    >
                      Offers
                    </Link>
                  </li>
                  <li className="px-4 py-3 hover:bg-blue-50 transition-colors duration-200">
                    <Link
                      to="/faqs"
                      className="block capitalize font-medium text-gray-800"
                    >
                      FAQS
                    </Link>
                  </li>
                  <li className="px-4 py-3 hover:bg-blue-50 transition-colors duration-200">
                    <Link
                      to="/privacy-policy"
                      className="block capitalize font-medium text-gray-800"
                    >
                      Privacy Policy
                    </Link>
                  </li>
                  <li className="px-4 py-3 hover:bg-blue-50 transition-colors duration-200">
                    <Link
                      to="/terms-conditions"
                      className="block capitalize font-medium text-gray-800"
                    >
                      Term & Conditions
                    </Link>
                  </li>
                </ul>
              )}
            </li>
            <li className="relative text-red-600 bg-red-100 mt-1 font-medium px-2 rounded-md">
              <Link to="/offers">Offers</Link>
              <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4">
                <span className="absolute inline-flex items-center justify-center w-2 h-2 text-xxs font-bold text-white bg-red-600 rounded-full transform translate-x-[7px] -translate-y-[7px]"></span>
                <span className="absolute top-[-5.6px] right-[-5.5px] w-7 h-7 border-2 border-red-600 rounded-full heartbeat"></span>
              </span>
            </li>
          </ul>
          <select name="Languages" id="Languages" className="ms-auto">
            <option value="english" selected>
              English
            </option>
            <option value="bangla">Bangla</option>
            <option value="arabic">Arabic</option>
          </select>
          <ul className="flex h-12 items-center justify-between w-[250px] me-11 text-sm">
            <li>
              <Link>Privacy Policy</Link>
            </li>
            <li>
              <Link>Terms & Conditions</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
