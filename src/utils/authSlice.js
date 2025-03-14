import { createSlice } from "@reduxjs/toolkit";

// Initial state
const initialState = {
  isLoggedIn: false,
  user: null,
};

// Create a slice for authentication
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state) => {
      state.isLoggedIn = true;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.user = null;
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isLoggedIn = true;
    },
  },
});

// Export the actions from the slice
export const { login, logout, setUser } = authSlice.actions;

// Export the reducer to be included in the store
export default authSlice.reducer;
