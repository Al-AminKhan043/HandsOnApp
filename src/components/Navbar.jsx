import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "../utils/authSlice"; // Import actions
import axios from "axios";

const Navbar = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn) || localStorage.getItem("isLoggedIn") === "true";

  // Sync Redux state with localStorage on mount
  useEffect(() => {
    if (localStorage.getItem("isLoggedIn") === "true") {
      dispatch(login()); // Ensure Redux stays in sync
    }
  }, [dispatch]);

  // Handle logout
  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/api/users/logout", {}, { withCredentials: true });
      dispatch(logout());
      localStorage.removeItem("isLoggedIn"); // Clear localStorage
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <nav>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/account">Account</Link></li>
        <li><Link to="/events">Events</Link></li>
        <li><Link to="/posts">Posts</Link></li>

        {/* Conditionally show Login/Signup or Logout */}
        {!isLoggedIn ? (
          <>
            <li><Link to="/signup">Sign Up</Link></li>
            <li><Link to="/login">Login</Link></li>
          </>
        ) : (
          <li><button onClick={handleLogout}>Logout</button></li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
