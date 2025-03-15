// LogoutButton.jsx
import React from 'react';
import { useDispatch } from 'react-redux'; // Import the necessary hooks
import { logout } from '../utils/authSlice'; // Import the logout action
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Logout=() => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Make a request to the backend logout endpoint
      await axios.post("http://localhost:5000/api/users/logout", {}, { withCredentials: true });

      // Dispatch the logout action to update Redux state
      dispatch(logout());

      // Redirect user to login page after logging out
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default Logout;
