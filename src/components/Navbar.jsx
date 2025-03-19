import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "../utils/authSlice";
import axios from "axios";
import { Navbar, Nav, Button, Container } from "react-bootstrap";

const Navigation = () => {
  const dispatch = useDispatch();
  // Extract user and login state
  const { isLoggedIn, user } = useSelector((state) => state.auth); 

  // Check for token and user data in localStorage on initial load
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    
    if (token && storedUser) {
      dispatch(login({ token, user: JSON.parse(storedUser) }));
    }
  }, [dispatch]);

  const handleLogout = async () => {
    try {
      await axios.post("https://handson-backend-ix8y.onrender.com/api/users/logout", {}, { withCredentials: true });
      dispatch(logout()); 
      localStorage.removeItem("token"); 
      localStorage.removeItem("user");  
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand href="/">HandsOn</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <NavLink to="/" className="nav-link">Home</NavLink>
            <NavLink to="/account" className="nav-link">Account</NavLink>
            <NavLink to="/events" className="nav-link">Events</NavLink>
            <NavLink to="/posts" className="nav-link">Posts</NavLink>
          </Nav>
          <Nav>
            {!isLoggedIn ? (
              <>
                <NavLink to="/signup" className="nav-link">Sign Up</NavLink>
                <NavLink to="/login" className="nav-link">Login</NavLink>
              </>
            ) : (
              <>
                <span className="nav-link text-light">{user?.name}</span>
                <Button variant="outline-light" onClick={handleLogout}>Logout</Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
