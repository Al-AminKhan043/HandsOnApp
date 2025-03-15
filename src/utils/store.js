import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice"; // Adjust path as needed

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export default store;
