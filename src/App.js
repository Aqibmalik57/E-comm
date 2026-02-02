import "./App.css";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Home from "./Components/Home/Home";
import About from "./Components/About/About";
import Contact from "./Components/Contact/Contact";
import Login from "./Components/Login/Login";
import Signup from "./Components/Signup/Signup";
import Profile from "./Components/Profile/Profile";
import UpdateProfile from "./Components/UpdateProfile/updateprofile";
import { useDispatch, useSelector } from "react-redux";
// import AdminDashboard from "./Components/AdminDashboard/AdminDashboard";
import SingleUserProfile from "./Components/Profile/SingleUserProfile";
import UpdatePassword from "./Components/UpdateProfile/updatePassword";
import UpdateUserProfile from "./Components/AdminDashboard/UpdateUserProfile";
import ForgotPassword from "./Components/Password/forgotPassword";
import ResetPassword from "./Components/Password/resetPassword";
import NotFound from "./Notfound-404";
import Category from "./Components/Categories/Categ.jsx";
// import Add from "./Components/Add.jsx";
import AddCart from "./Components/Cart/Cart.jsx";
import SingleProduct from "./Components/SingleProduct.jsx";
import Offers from "./Components/Offers/Offers.jsx";
import Privacy from "./Components/Privacy&Term/Privacy.jsx";
import Terms from "./Components/Privacy&Term/Terms.jsx";
import Navbar from "./Components/Navbar/Navbar.jsx";
import Footer from "./Components/Footer/Footer.jsx";
import FloatingCartSummary from "./Components/Cart/FloatingCartSummary.jsx";
import { MyProfile } from "./store/feature/userSlice.js";
import { useEffect } from "react";

// ProtectedRoute component
const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, loading } = useSelector((state) => state.user);

  // While checking if the user is logged in (on refresh), show nothing.
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  // Use 'replace' to prevent the user from clicking 'back' into a protected route
  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

const LayoutWrapper = ({ children }) => {
  const location = useLocation();

  // 1. Define all your valid existing paths here
  const validPaths = [
    "/",
    "/login",
    "/signup",
    "/about",
    "/contact",
    "/forgetpassword",
    "/offers",
    "/privacy-policy",
    "/terms&Conditions",
    "/cart",
    "/profile",
    "/updateprofile",
    "/updatepassword",
  ];

  // 2. Check for dynamic routes (regex)
  const isDynamicRoute =
    location.pathname.startsWith("/category/") ||
    // location.pathname.startsWith("/reset/") ||
    location.pathname.startsWith("/product/") ||
    location.pathname.startsWith("/singleUser/") ||
    location.pathname.startsWith("/updateUser/");

  const isValidPath = validPaths.includes(location.pathname) || isDynamicRoute;

  const isCart = location.pathname === "/cart";

  const shouldHide = !isValidPath || isCart;

  return (
    <>
      {!shouldHide && <Navbar />}
      {children}
      {!shouldHide && <Footer />}
    </>
  );
};

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(MyProfile());
  }, [dispatch]);

  return (
    <div className="App">
      <BrowserRouter>
        <LayoutWrapper>
          <FloatingCartSummary />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/category/:category" element={<Category />} />
            <Route path="/forgetpassword" element={<ForgotPassword />} />
            <Route path="/reset/:token" element={<ResetPassword />} />
            <Route path="/product/:id" element={<SingleProduct />} />
            <Route path="/offers" element={<Offers />} />
            <Route path="/privacy-policy" element={<Privacy />} />
            <Route path="/terms&Conditions" element={<Terms />} />
            <Route path="/cart" element={<AddCart />} />
            <Route path="*" element={<NotFound />} />

            {/* Protected Routes */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/updateprofile"
              element={
                <ProtectedRoute>
                  <UpdateProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/singleUser/:id"
              element={
                <ProtectedRoute>
                  <SingleUserProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/updatepassword"
              element={
                <ProtectedRoute>
                  <UpdatePassword />
                </ProtectedRoute>
              }
            />
            <Route
              path="/updateUser/:id"
              element={
                <ProtectedRoute>
                  <UpdateUserProfile />
                </ProtectedRoute>
              }
            />
          </Routes>
        </LayoutWrapper>
      </BrowserRouter>
    </div>
  );
}

export default App;
