import React, { useState } from "react";
import { Form, Button, Container, Alert } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useSelector } from "react-redux"; // For checking login status
import { toast, ToastContainer } from "react-toastify"; // For toast notifications
import "react-toastify/dist/ReactToastify.css"; // Toast styles
import { format } from 'date-fns'; // Add this line at the top of your file

const NewEvent = () => {
  // Get the logged-in status from Redux
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const {token}=useSelector((state)=> state.auth);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: new Date(),
    time: "10:00", // Use 24-hour format (HH:mm)
    location: "",
    category: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      date: date,
    });
  };

  const handleTimeChange = (e) => {
    setFormData({
      ...formData,
      time: e.target.value, // The native time picker will give you the time in HH:mm format
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Convert the time to 12-hour AM/PM format
    const formattedTime = format(new Date(`1970-01-01T${formData.time}:00`), 'hh:mm a');
  
    try {
      const response = await fetch(`http://localhost:5000/api/events/new`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          time: formattedTime,  // Send the formatted time
        }),
      });
      const data = await response.json();
  
      if (response.ok) {
        toast.success("Event created successfully!");
        // Clear the form fields after success
        setFormData({
          title: "",
          description: "",
          date: new Date(),
          time: "10:00", // Reset to default time
          location: "",
          category: "",
        });
      } else {
        toast.error(data.message || "Error creating event.");
      }
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error("Error creating event.");
    }
  };
  

  if (!isLoggedIn) {
    // If user is not logged in, show a login prompt
    return (
      <Container className="my-4">
        <Alert variant="warning">
          You need to log in to create an event. Please log in first.
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="my-4">
      <h2 className="mb-4">Create New Event</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="title" className="mb-3">
          <Form.Label>Event Title</Form.Label>
          <Form.Control
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter event title"
            required
          />
        </Form.Group>

        <Form.Group controlId="description" className="mb-3">
          <Form.Label>Event Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter event description"
            required
          />
        </Form.Group>

        <Form.Group controlId="date" className="mb-3">
          <Form.Label>Event Date</Form.Label>
          <DatePicker
            selected={formData.date}
            onChange={handleDateChange}
            className="form-control"
            dateFormat="yyyy-MM-dd"
            required
          />
        </Form.Group>

        <Form.Group controlId="time" className="mb-3">
          <Form.Label>Event Time</Form.Label>
          <Form.Control
            type="time"
            value={formData.time} // Use the time state in HH:mm format
            onChange={handleTimeChange} // Update the time when selected
            required
            className="form-control"
          />
        </Form.Group>

        <Form.Group controlId="location" className="mb-3">
          <Form.Label>Event Location</Form.Label>
          <Form.Control
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Enter event location"
            required
          />
        </Form.Group>

        <Form.Group controlId="category" className="mb-3">
          <Form.Label>Event Category</Form.Label>
          <Form.Control
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="Enter event category"
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="mt-3">
          Create Event
        </Button>
      </Form>

      {/* Toast container for notifications */}
      <ToastContainer />
    </Container>
  );
};

export default NewEvent;
