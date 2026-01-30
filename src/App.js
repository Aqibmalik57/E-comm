import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import AdminDashboard from "./Components/AdminDashboard/AdminDashboard";
import SingleUserProfile from "./Components/Profile/SingleUserProfile";
import UpdatePassword from "./Components/UpdateProfile/updatePassword";
import UpdateUserProfile from "./Components/AdminDashboard/UpdateUserProfile";
import ForgotPassword from "./Components/Password/forgotPassword";
import ResetPassword from "./Components/Password/resetPassword";
import NotFound from "./Notfound-404";
import { toast } from "react-toastify";
import Category from "./Components/Categories/Categ.jsx";
import Add from "./Components/Add.jsx";
import AddCart from "./Components/Cart/Cart.jsx";
import SingleProduct from "./Components/SingleProduct";
// import Navbar from './Components/Navbar/Navbar.jsx';

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
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          {user && <Route path="/home" element={<Home />} />}
          {user && <Route path="/about" element={<About />} />}
          {user && <Route path="/contact" element={<Contact />} />}
          {user && <Route path="/profile" element={<Profile />} />}
          {user && <Route path="/updateprofile" element={<UpdateProfile />} />}
          {user && <Route path="/dashboard" element={<AdminDashboard />} />}
          {user && <Route path="/cart/add" element={<AddCart />} />}
          {user && (
            <Route path="/singleUser/:id" element={<SingleUserProfile />} />
          )}
          {user && (
            <Route path="/updatepassword" element={<UpdatePassword />} />
          )}
          {user && (
            <Route path="/updateUser/:id" element={<UpdateUserProfile />} />
          )}
          {user && <Route path="/category/:category" element={<Category />} />}
          <Route path="/forgetpassword" element={<ForgotPassword />} />
          <Route path="/reset/:token" element={<ResetPassword />} />
          {user && <Route path="/add" element={<Add />} />}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
