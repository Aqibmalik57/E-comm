import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./feature/userSlice";
import productReducer from "./feature/productSlice";
import cartReducer from "./feature/CartSlice"

const store = configureStore({
  reducer: {
    user: userReducer,
    product: productReducer,
    cart: cartReducer,
  },
});

export default store;
