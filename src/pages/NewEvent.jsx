import React, { useState } from "react";
import { Form, Button, Container, Alert } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { format } from 'date-fns';

const NewEvent = () => {
  const [success,setSuccess]= useState(null);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const { token } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: new Date(),
    time: "10:00",
    location: "",
    category: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleDateChange = (date) => {
    setFormData({ ...formData, date });
    setErrors({ ...errors, date: "" });
  };

  const handleTimeChange = (e) => {
    setFormData({ ...formData, time: e.target.value });
    setErrors({ ...errors, time: "" });
  };

  const validateForm = () => {
    let tempErrors = {};
    if (!formData.title.trim()) tempErrors.title = "Title is required.";
    if (!formData.description.trim()) tempErrors.description = "Description is required.";
    if (!formData.location.trim()) tempErrors.location = "Location is required.";
    if (!formData.category.trim()) tempErrors.category = "Category is required.";
    if (!formData.date) tempErrors.date = "Date is required.";
    if (!formData.time) tempErrors.time = "Time is required.";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(null);
    if (!validateForm()) return;

    const formattedTime = format(new Date(`1970-01-01T${formData.time}:00`), 'hh:mm a');

    try {
      const response = await fetch(`https://handson-backend-ix8y.onrender.com/api/events/new`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, time: formattedTime }),
      });
      const data = await response.json();

      if (response.ok) {
        setSuccess('Event created successfully!');
        setFormData({ title: "", description: "", date: new Date(), time: "10:00", location: "", category: "" });
      } else {
        toast.error(data.message || "Error creating event.");
      }
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error("Error creating event.");
    }
  };

  if (!isLoggedIn) {
    return (
      <Container className="my-4">
        <Alert variant="warning">You need to log in to create an event.</Alert>
      </Container>
    );
  }

  return (
    <Container className="my-4">
      <h2 className="mb-4">Create New Event</h2>
      <Form onSubmit={handleSubmit}>
        {success && (
                  <Alert
                    variant="success"
                    onClick={() => setSuccess(null)} 
                    style={{ cursor: 'pointer' }}  
                  >
                    {success}
                  </Alert>
                )}
        {Object.values(errors).map((error, index) => error && <Alert key={index} variant="danger">{error}</Alert>)}

        <Form.Group controlId="title" className="mb-3">
          <Form.Label>Event Title</Form.Label>
          <Form.Control type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Enter event title" />
          {errors.title && <small className="text-danger">{errors.title}</small>}
        </Form.Group>

        <Form.Group controlId="description" className="mb-3">
          <Form.Label>Event Description</Form.Label>
          <Form.Control as="textarea" rows={3} name="description" value={formData.description} onChange={handleChange} placeholder="Enter event description" />
          {errors.description && <small className="text-danger">{errors.description}</small>}
        </Form.Group>

        <Form.Group controlId="date" className="mb-3">
          <Form.Label>Event Date</Form.Label>
          <DatePicker selected={formData.date} onChange={handleDateChange} className="form-control" dateFormat="yyyy-MM-dd" />
          {errors.date && <small className="text-danger">{errors.date}</small>}
        </Form.Group>

        <Form.Group controlId="time" className="mb-3">
          <Form.Label>Event Time</Form.Label>
          <Form.Control type="time" value={formData.time} onChange={handleTimeChange} className="form-control" />
          {errors.time && <small className="text-danger">{errors.time}</small>}
        </Form.Group>

        <Form.Group controlId="location" className="mb-3">
          <Form.Label>Event Location</Form.Label>
          <Form.Control type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Enter event location" />
          {errors.location && <small className="text-danger">{errors.location}</small>}
        </Form.Group>

        <Form.Group controlId="category" className="mb-3">
          <Form.Label>Event Category</Form.Label>
          <Form.Control type="text" name="category" value={formData.category} onChange={handleChange} placeholder="Enter event category" />
          {errors.category && <small className="text-danger">{errors.category}</small>}
        </Form.Group>

        <Button variant="primary" type="submit" className="mt-3">Create Event</Button>
      </Form>
      <ToastContainer />
    </Container>
  );
};

export default NewEvent;
