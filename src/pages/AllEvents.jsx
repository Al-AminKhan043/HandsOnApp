import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import { useSelector } from "react-redux";
import { Button, Modal, Form } from "react-bootstrap";
import DatePicker from "react-datepicker"; // Import date picker
import "react-datepicker/dist/react-datepicker.css"; // Import necessary styles
import { toast } from "react-toastify"; // For notifications
import "react-toastify/dist/ReactToastify.css";

const AllEvents = () => {
  const [events, setEvents] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  const { isLoggedIn, user } = useSelector((state) => state.auth);

  const fetchEvents = useCallback(async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/events?page=${page}&limit=5`);
  
      if (res.data.events.length > 0) {
        setEvents((prevEvents) => {
          // Filter out already existing events
          const newEvents = res.data.events.filter(
            (newEvent) => !prevEvents.some((prevEvent) => prevEvent._id === newEvent._id)
          );
          
          // Sort the events so the newest event is first
          const allEvents = [...prevEvents, ...newEvents].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
          return allEvents;
        });
  
        // Increment page number to fetch the next set of events
        setPage((prevPage) => prevPage + 1);
      } else {
        // If no events are returned, set hasMore to false to indicate no more events
        setHasMore(false);
      }
    } catch (err) {
      console.error("Error fetching events:", err);
    }
  }, [page]);
  
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);
  

  const handleDeleteEvent = async (eventId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Unauthorized: No token found!");
      return;
    }

    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await axios.delete(`http://localhost:5000/api/events/${eventId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setEvents(events.filter((event) => event._id !== eventId));
        alert("Event deleted successfully!");
      } catch (error) {
        console.error("Error deleting event:", error.response?.data || error.message);
      }
    }
  };
  


  const handleEditEvent = (event) => {
    setEditingEvent(event); // Set the event data to be edited
    setShowEditModal(true); // Show the modal
  };

  const handleSaveEdit = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Unauthorized: No token found!");
      return;
    }

    try {
      const res = await axios.put(
        `http://localhost:5000/api/events/${editingEvent._id}/edit`,
        {
          title: editingEvent.title,
          description: editingEvent.description,
          date: editingEvent.date,
          time: editingEvent.time,
          location: editingEvent.location,
          category: editingEvent.category,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setEvents((prevEvents) => {
        return prevEvents.map((event) =>
          event._id === editingEvent._id ? res.data : event
        );
      });

      setShowEditModal(false); // Close the modal
      toast.success("Event updated successfully!");
      window.location.reload() // Use toast notification
    } catch (error) {
      console.error("Error editing event:", error.response?.data || error.message);
    }
  };
  
  const handleInterested= async(eventId)=>{
    const token = localStorage.getItem("token");
    if(!isLoggedIn){
      toast.warning('Please log in to show interest in an event.')
      return;
    }
    try{
      await axios.post(`http://localhost:5000/api/events/${eventId}/User`,
        {
          userId: user._id
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event._id === eventId ? { ...event, interestedUsers: [...event.interestedUsers, user._id] } : event
        )
        
      );
      toast.success("Marked as interested!");
    }
    catch (error) {
      console.error("Error marking interest:", error.response?.data || error.message);
      toast.error("Failed to mark interest.");
    }
  }

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">📅 All Events</h2>

      <InfiniteScroll
        dataLength={events.length}
        next={fetchEvents}
        hasMore={hasMore}
        loader={<h4 className="text-center">Loading more events...</h4>}
      >
        {events.map((event) => {
          const isEventOwner = isLoggedIn && (user?._id || user?.id) === event.createdBy?._id;

          return (
            <div key={event._id} className="card mb-4 shadow-sm border-0 rounded-3" style={{ backgroundColor: "#f8f9fa" }}>
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center">
                  <h4 className="card-title text-primary fw-bold">{event.title}</h4>
                  {isEventOwner && (
                    <div className="d-flex">
                      <Button
                        variant="warning"
                        size="sm"
                        className="me-2"
                        onClick={() => handleEditEvent(event)}
                      >
                        ✏️ Edit Event
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => handleDeleteEvent(event._id)}>
                        🗑️ Delete Event
                      </Button>
                      
                    </div>
                    
                  )}
                </div>

                <p className="text-muted mb-2">👤 <strong>Created by:</strong> {event.createdBy?.name}</p>
                <p className="text-secondary">
                  <strong>Location:</strong> {event.location}
                </p>
                <p className="text-secondary">
                  <strong>Time:</strong> {event.time}
                </p>
                <p className="text-secondary">
                  <strong>Date:</strong> {new Date(event.date).toLocaleDateString()}
                </p>
                <p className="text-secondary">
                  <strong>Category:</strong> {event.category}
                </p>
                <p className="card-text text-dark"> <strong>Description:</strong> {event.description}</p>
                <Button
                variant={event.interestedUsers?.includes(user?._id) ? "secondary" : "success"}
                onClick={() => handleInterested(event._id)}
                disabled={event.interestedUsers?.includes(user?._id)}
              >
                {event.interestedUsers?.includes(user?._id) ? "✔ Interested" : "👍 Mark Interested"}
              </Button>
              </div>
            </div>
          );
        })}
      </InfiniteScroll>

      {/* Edit Event Modal */}
      {/* Edit Event Modal */}
{editingEvent && (
  <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
    <Modal.Header closeButton>
      <Modal.Title>Edit Event</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Form>
        <Form.Group controlId="editTitle">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            value={editingEvent.title}
            onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
          />
        </Form.Group>

        <Form.Group controlId="editLocation" className="mt-3">
          <Form.Label>Location</Form.Label>
          <Form.Control
            type="text"
            value={editingEvent.location}
            onChange={(e) => setEditingEvent({ ...editingEvent, location: e.target.value })}
          />
        </Form.Group>

        <Form.Group controlId="editDescription" className="mt-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={editingEvent.description}
            onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
          />
        </Form.Group>

        {/* Date Picker */}
        <Form.Group controlId="editDate" className="mt-3">
          <Form.Label>Date</Form.Label>
          <DatePicker
            selected={new Date(editingEvent.date)}
            onChange={(date) => setEditingEvent({ ...editingEvent, date })}
            className="form-control"
            dateFormat="yyyy-MM-dd"
          />
        </Form.Group>

        {/* Time Picker */}
        <Form.Group controlId="editTime" className="mt-3">
          <Form.Label>Time</Form.Label>
          <Form.Control
            type="time"
            value={editingEvent.time}
            onChange={(e) => setEditingEvent({ ...editingEvent, time: e.target.value })}
          />
        </Form.Group>

        {/* Category Field */}
        <Form.Group controlId="editCategory" className="mt-3">
          <Form.Label>Category</Form.Label>
          <Form.Control
            type="text"
            value={editingEvent.category}
            onChange={(e) => setEditingEvent({ ...editingEvent, category: e.target.value })}
          />
        </Form.Group>
      </Form>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={() => setShowEditModal(false)}>
        Close
      </Button>
      <Button variant="primary" onClick={handleSaveEdit}>
        Save Changes
      </Button>
    </Modal.Footer>
  </Modal>
)}

    </div>
  );
};

export default AllEvents;
