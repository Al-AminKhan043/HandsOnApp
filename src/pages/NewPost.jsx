import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { useSelector } from "react-redux";
import axios from "axios";

export default function NewPost() {
  const [title, setTitle] = useState("");
  const [level, setLevel] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(null);
  const { token } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "title") setTitle(value);
    if (name === "level") setLevel(value);
    if (name === "description") setDescription(value);
    setErrors({ ...errors, [name]: "" });
  };

  const validateForm = () => {
    let tempErrors = {};
    if (!title.trim()) tempErrors.title = "Title is required.";
    if (!level.trim()) tempErrors.level = "Level is required.";
    if (!description.trim()) tempErrors.description = "Description is required.";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await axios.post(
        `https://handson-backend-ix8y.onrender.com/api/posts/new`,
        { title, level, description },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setSuccess("Post created successfully!");
      setTitle("");
      setLevel("");
      setDescription("");
    } catch (err) {
      setErrors({ ...errors, general: err.response?.data?.message || "Error creating post" });
    }
  };
  const handleSuccessClick = () => {
    setSuccess(null);
  };
  return (
    <div className="container mt-4">
      <h2>Create a Post</h2>
      {success && <Alert variant="success" onClick={handleSuccessClick}>{success}</Alert>}
      {errors.general && <Alert variant="danger">{errors.general}</Alert>}

      <Form onSubmit={handleSubmit}>
      {Object.values(errors).map((error, index) => error && <Alert key={index} variant="danger">{error}</Alert>)}

        <Form.Group controlId="title" className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            name="title"
            value={title}
            onChange={handleChange}
            placeholder="Enter title"
            isInvalid={!!errors.title}
          />
          {errors.title && <small className="text-danger">{errors.title}</small>}
        </Form.Group>

        <Form.Group controlId="level" className="mb-3">
          <Form.Label>Level</Form.Label>
          <Form.Control
            type="text"
            name="level"
            value={level}
            onChange={handleChange}
            placeholder="Enter level"
            isInvalid={!!errors.level}
          />
          {errors.level && <small className="text-danger">{errors.level}</small>}
        </Form.Group>

        <Form.Group controlId="description" className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="description"
            value={description}
            onChange={handleChange}
            placeholder="Enter description"
            isInvalid={!!errors.description}
          />
          {errors.description && <small className="text-danger">{errors.description}</small>}
        </Form.Group>

        <Button variant="primary" type="submit">
          Create Post
        </Button>
      </Form>
    </div>
  );
}
