import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./feature/userSlice";
import productReducer from "./feature/productSlice";
import cartReducer from "./feature/CartSlice";
import offerReducer from "./feature/offerSlice";
import orderReducer from "./feature/orderSlice";
import categoryReducer from "./feature/categorySlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    product: productReducer,
    cart: cartReducer,
    offer: offerReducer,
    order: orderReducer,
    category: categoryReducer,
  },
});

export default store;
