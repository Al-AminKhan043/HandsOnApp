import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice"; // Adjust the path accordingly

// Create the Redux store
const store = configureStore({
  reducer: {
    auth: authReducer, // Add the authReducer here
  },
});

export default store;
