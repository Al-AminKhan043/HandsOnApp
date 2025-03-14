import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../utils/authSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // For displaying error messages
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/login",
        { email, password },
        { withCredentials: true }
      );

      if (response.status === 200) {
        dispatch(login()); // ✅ Update Redux state
        localStorage.setItem("isLoggedIn", "true"); // ✅ Persist login state
        navigate("/"); // ✅ Redirect to homepage
      }
    } catch (err) {
      setError("Invalid email or password");
      console.error("Login error:", err);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
