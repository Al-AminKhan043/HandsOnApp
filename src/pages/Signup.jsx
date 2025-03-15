import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../utils/authSlice";
import { Form, Button, Container, Alert, Card } from "react-bootstrap"; // Bootstrap Components

export default function Signup() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage(""); // Clear previous errors

        if (password !== confirmPassword) {
            setErrorMessage("Passwords don't match!");
            return;
        }

        try {
            const response = await axios.post("http://localhost:5000/api/users/signup", {
                name,
                email,
                password, // Remove confirmPassword from request
            });

            if (response.status === 201) { // Ensure successful registration
                const { token, user } = response.data;

                // Store token and user in localStorage
                localStorage.setItem("token", token);
                localStorage.setItem("user", JSON.stringify(user));

                // Dispatch login to update Redux state
                dispatch(login({ token, user }));

                navigate("/"); // Redirect to homepage or dashboard
            }
        } catch (err) {
            setErrorMessage(err.response?.data?.message || "Error signing up. Please try again.");
            console.error("Signup error:", err);
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center vh-100">
            <Card style={{ width: "400px", padding: "20px", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)" }}>
                <Card.Body>
                    <h2 className="text-center">Sign Up</h2>
                    {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter your name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Confirm password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit" className="w-100">
                            Sign Up
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
}
