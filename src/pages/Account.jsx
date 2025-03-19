import React, { useState, useEffect } from "react";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Account = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState("");
  const [skills, setSkills] = useState([]);
  const [causes, setCauses] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const navigate = useNavigate();

  // Get user login state from Redux
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  
  useEffect(() => {
    // Only fetch data if user is logged in and user object is available
    if (isLoggedIn && user && user.id) {
      const token = localStorage.getItem("token");
     
      const fetchUserData = async () => {
        try {
          const response = await axios.get(
            `https://handson-backend-ix8y.onrender.com/api/users/${user.id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setUserInfo(response.data);
          setSkills(response.data.skills || []);
          setCauses(response.data.causes || []);
          setName(response.data.name || "");  
          setEmail(response.data.email || ""); 
        } catch (err) {
          setError("Error fetching user profile");
          console.error("Error fetching user profile:", err);
        }
      };

      fetchUserData();
    } else {
      navigate("/login");
    }
  }, [isLoggedIn, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const updatedData = { name, email, skills, causes };

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `https://handson-backend-ix8y.onrender.com/api/users/${userInfo._id}/edit`,
        updatedData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUserInfo(response.data.user);
      setError(""); 
      alert("Profile updated successfully");
    } catch (err) {
      setError("Error updating profile");
      console.error("Error updating profile:", err);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card style={{ width: "500px", padding: "20px", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)" }}>
        <Card.Body>
          <h2 className="text-center">Account Page</h2>
          
         
          {isLoggedIn ? (
            <>
              {error && <Alert variant="danger">{error}</Alert>}

              {userInfo ? (
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}  
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)} 
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Skills</Form.Label>
                    <Form.Control
                      type="text"
                      value={skills.join(", ")}
                      onChange={(e) => setSkills(e.target.value.split(", "))} 
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Causes</Form.Label>
                    <Form.Control
                      type="text"
                      value={causes.join(", ")}
                      onChange={(e) => setCauses(e.target.value.split(", "))} 
                    />
                  </Form.Group>

                  <Button variant="primary" type="submit" className="w-100">
                    Save Changes
                  </Button>
                </Form>
              ) : (
                <p>Loading user data...</p>
              )}
            </>
          ) : (
            <p>Please log in to access your account details.</p>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Account;
