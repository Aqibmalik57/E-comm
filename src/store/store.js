import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./feature/userSlice";
import productReducer from "./feature/productSlice";
import cartReducer from "./feature/CartSlice";
import offerReducer from "./feature/offerSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    product: productReducer,
    cart: cartReducer,
    offer: offerReducer,
  },
});

export default store;
