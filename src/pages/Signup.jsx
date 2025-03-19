import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../utils/authSlice";
import { Form, Button, Container, Alert, Card } from "react-bootstrap"; 

export default function Signup() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [validated, setValidated] = useState(false); 
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        setValidated(true); 

        if (password !== confirmPassword) {
            setErrorMessage("Passwords don't match!");
            return;
        }

        try {
            const response = await axios.post("http://localhost:5000/api/users/signup", {
                name,
                email,
                password,
                confirmPassword

            });

            if (response.status === 201) {
                const { token, user } = response.data;
                console.log("Received Token:", token);

                localStorage.setItem("token", token);
                localStorage.setItem("user", JSON.stringify(user));

                dispatch(login({ token, user }));
                navigate("/");
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
                    <h2 className="text-center mb-3">Sign Up</h2>
                    {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter your name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                isInvalid={validated && !name} 
                            />
                            <Form.Control.Feedback type="invalid">
                                Name is required.
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                isInvalid={validated && !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)}
                            />
                            <Form.Control.Feedback type="invalid">
                                Please enter a valid email address.
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={8}
                                isInvalid={validated && password.length < 8}
                            />
                            <Form.Control.Feedback type="invalid">
                                Password must be at least 8 characters.
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Confirm password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                isInvalid={validated && confirmPassword !== password}
                            />
                            <Form.Control.Feedback type="invalid">
                                Passwords must match.
                            </Form.Control.Feedback>
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
