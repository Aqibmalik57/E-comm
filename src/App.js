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
import { MyProfile } from "./store/feature/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
// import AdminDashboard from "./Components/AdminDashboard/AdminDashboard";
import SingleUserProfile from "./Components/Profile/SingleUserProfile";
import UpdatePassword from "./Components/UpdateProfile/updatePassword";
import UpdateUserProfile from "./Components/AdminDashboard/UpdateUserProfile";
import ForgotPassword from "./Components/Password/forgotPassword";
import ResetPassword from "./Components/Password/resetPassword";
import NotFound from "./Notfound-404";
import { toast } from "react-toastify";
import Category from "./Components/Categories/Categ.jsx";
// import Add from "./Components/Add.jsx";
import AddCart from "./Components/Cart/Cart.jsx";
import SingleProduct from "./Components/SingleProduct.jsx";
import Offers from "./Components/Offers/Offers.jsx";
import Privacy from "./Components/Privacy&Term/Privacy.jsx";
import Terms from "./Components/Privacy&Term/Terms.jsx";
import Navbar from "./Components/Navbar/Navbar.jsx";
import Footer from "./Components/Footer/Footer.jsx";

// ProtectedRoute component
const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useSelector((state) => state.user);
  return isLoggedIn ? children : <Navigate to="/login" />;
};

const LayoutWrapper = ({ children }) => {
  const location = useLocation();

  // Add the paths where you DON'T want the Navbar and Footer to appear
  const excludePaths = ["/notfound", "/cart/add"];

  const isExcluded =
    excludePaths.includes(location.pathname) ||
    location.pathname.startsWith("/reset/");

  return (
    <>
      {!isExcluded && <Navbar />}
      {children}
      {!isExcluded && <Footer />}
    </>
  );
};

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(MyProfile());
  }, [dispatch]);

  const { user, error } = useSelector((state) => state.user);

  useEffect(() => {
    if (error && !user) {
      toast.error(error.response?.data?.message);
    }
  }, [error, user]);

  return (
    <div className="App">
      <BrowserRouter>
        <LayoutWrapper>
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
            <Route path="/cart/add" element={<AddCart />} />
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
