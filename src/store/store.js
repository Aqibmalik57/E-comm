import { configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import userReducer from "./feature/userSlice";
import productReducer from "./feature/productSlice";
import cartReducer from "./feature/CartSlice";
import offerReducer from "./feature/offerSlice";
import orderReducer from "./feature/orderSlice";
import categoryReducer from "./feature/categorySlice";

// Persist config for user state
const userPersistConfig = {
  key: "user",
  storage,
  whitelist: ["user", "isLoggedIn"],
};

const persistedUserReducer = persistReducer(userPersistConfig, userReducer);

export const store = configureStore({
  reducer: {
    user: persistedUserReducer,
    product: productReducer,
    cart: cartReducer,
    offer: offerReducer,
    order: orderReducer,
    category: categoryReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
export default store;
