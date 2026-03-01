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
import AdminDashboard from "./Components/AdminDashboard/AdminDashboard";
import AdminLayout from "./Components/AdminDashboard/AdminLayout";
import UsersManagement from "./Components/AdminDashboard/UsersManagement";
import ProductsManagement from "./Components/AdminDashboard/ProductsManagement";
import CategoriesManagement from "./Components/AdminDashboard/CategoriesManagement";
import OrdersManagement from "./Components/AdminDashboard/OrdersManagement";
import CouponsManagement from "./Components/AdminDashboard/CouponsManagement";
import ReviewsManagement from "./Components/AdminDashboard/ReviewsManagement";
import SingleUserProfile from "./Components/Profile/SingleUserProfile";
import UpdatePassword from "./Components/UpdateProfile/updatePassword";
import UpdateUserProfile from "./Components/AdminDashboard/UpdateUserProfile";
import ForgotPassword from "./Components/Password/forgotPassword";
import ResetPassword from "./Components/Password/resetPassword";
import NotFound from "./Notfound-404";
import Category from "./Components/Categories/Categ.jsx";
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
import FAQs from "./Components/FAQs.jsx";
import Checkout from "./Components/Cart/Checkout.jsx";
import Invoice from "./Components/Cart/invoice.jsx";

// ProtectedRoute component
const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, loading } = useSelector((state) => state.user);

  // While checking if the user is logged in (on refresh), show loading spinner
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#10b981]"></div>
      </div>
    );
  }

  // Use 'replace' to prevent the user from clicking 'back' into a protected route
  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

// AdminProtectedRoute component - checks for admin role
const AdminProtectedRoute = ({ children }) => {
  const { isLoggedIn, loading, user } = useSelector((state) => state.user);

  // While checking if the user is logged in (on refresh), show loading spinner
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#10b981]"></div>
      </div>
    );
  }

  // If not logged in, redirect to login
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // If logged in but not admin, redirect to home
  if (user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

const LayoutWrapper = ({ children }) => {
  const location = useLocation();

  // Check if current path is an admin route
  const isAdminRoute = location.pathname.startsWith("/admin");

  // If it's an admin route, don't show navbar and footer
  if (isAdminRoute) {
    return <>{children}</>;
  }

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
    "/faqs",
    "/checkout",
    "/Invoice-order-success",
    "/invoice",
  ];

  const isDynamicRoute =
    location.pathname.startsWith("/category/") ||
    location.pathname.startsWith("/product/") ||
    location.pathname.startsWith("/singleUser/") ||
    location.pathname.startsWith("/updateUser/") ||
    location.pathname.startsWith("/invoice/");

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
            <Route path="/faqs" element={<FAQs />} />
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
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              }
            />
            <Route
              path="/Invoice-order-success"
              element={
                <ProtectedRoute>
                  <Invoice />
                </ProtectedRoute>
              }
            />
            <Route
              path="/invoice/:oId"
              element={
                <ProtectedRoute>
                  <Invoice />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <AdminProtectedRoute>
                  <AdminLayout />
                </AdminProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<UsersManagement />} />
              <Route path="products" element={<ProductsManagement />} />
              <Route path="categories" element={<CategoriesManagement />} />
              <Route path="orders" element={<OrdersManagement />} />
              <Route path="coupons" element={<CouponsManagement />} />
              <Route path="reviews" element={<ReviewsManagement />} />
            </Route>
          </Routes>
        </LayoutWrapper>
      </BrowserRouter>
    </div>
  );
}

export default App;
