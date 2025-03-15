import { createSlice } from "@reduxjs/toolkit";

// Load user and token from localStorage
const storedUser = JSON.parse(localStorage.getItem("user"));
const storedToken = localStorage.getItem("token");

// Initial state
const initialState = {
  isLoggedIn: !!storedToken, // True if a token exists
  user: storedUser || null, // Load user from localStorage if available
  token: storedToken || null,
};

// Create a slice for authentication
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      const { user, token } = action.payload;
      state.isLoggedIn = true;
      state.user = user;
      state.token = token;

      // Save to localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.user = null;
      state.token = null;

      // Remove from localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
});

// Export the actions from the slice
export const { login, logout } = authSlice.actions;

// Export the reducer to be included in the store
export default authSlice.reducer;
