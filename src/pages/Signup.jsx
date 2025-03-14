import { useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";  // Import the dispatch function
import { login } from "../utils/authSlice";  // Import the login action

export default function Signup() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState(""); // For displaying error
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setErrorMessage("Passwords don't match!");
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/api/users/signup', {
                name,
                email,
                password,
                confirmPassword,
            });

            // Assuming the response returns a token and user data after signup
            const { token, user } = response.data;

            // Save token and user data in Redux
            dispatch(login({
                token,
                user
            }));

            // Optionally save token to localStorage or cookies
            localStorage.setItem('token', token); 

            // Redirect after successful signup
            navigate('/');  // Redirect to home or another route after successful signup
        } catch (err) {
            console.error("Error during signup:", err);
            setErrorMessage(err.response?.data?.message || "Error signing up. Please try again.");
        }
    };

    return (
        <div>
            <h2>Signup</h2>
            {errorMessage && <div className="error">{errorMessage}</div>} {/* Display error messages */}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
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
                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
                <button type="submit">Signup</button>
            </form>
        </div>
    );
}
