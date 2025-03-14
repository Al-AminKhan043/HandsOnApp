import React from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import axios from "axios";

const Navbar = ({ isLoggedIn, setIsLoggedIn }) => {
  const navigate = useNavigate();

  // Handle logout logic
  const handleLogout = async () => {
    try {
      // Make a request to the backend logout endpoint
      await axios.post("http://localhost:5000/api/users/logout", {}, { withCredentials: true });
      
      // Update state to reflect user is logged out
      setIsLoggedIn(false);
      
      // Redirect user to login page after logging out
      navigate("/login");
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

        {/* Show Login/Signup or Logout based on login state */}
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
