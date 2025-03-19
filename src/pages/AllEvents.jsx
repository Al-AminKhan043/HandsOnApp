import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import { useSelector } from "react-redux";
import { Button, Modal, Form } from "react-bootstrap";
import DatePicker from "react-datepicker"; 
import "react-datepicker/dist/react-datepicker.css"; 
import { toast } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css";

const AllEvents = () => {
  const [events, setEvents] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [showInterestedModal, setShowInterestedModal] = useState(false);
  const [interestedUsers, setInterestedUsers] = useState([]);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  

  const fetchEvents = useCallback(async () => {
    try {
      const res = await axios.get(`https://handson-backend-ix8y.onrender.com/api/events?page=${page}&limit=5`);
  
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
        setMessageType('danger');
        setMessage("Unauthorized: No token found!");
        return;
    }

    if (window.confirm("Are you sure you want to delete this event?")) {
        try {
            await axios.delete(`https://handson-backend-ix8y.onrender.com/api/events/${eventId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setEvents(events.filter((event) => event._id !== eventId));
            setMessageType('success');
            setMessage("Event deleted successfully!");
        } catch (error) {
            console.error("Error deleting event:", error.response?.data || error.message);
            setMessageType('danger');
            setMessage("Failed to delete event. Please try again.");
        }
    }
};

  


  const handleEditEvent = (event) => {
    setEditingEvent(event); 
    setShowEditModal(true); 
  };

  const handleSaveEdit = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Unauthorized: No token found!");
      return;
    }

    try {
      const res = await axios.put(
        `https://handson-backend-ix8y.onrender.com/api/events/${editingEvent._id}/edit`,
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

      setShowEditModal(false); 
      alert("Event updated successfully!");
      window.location.reload() 
    } catch (error) {
      console.error("Error editing event:", error.response?.data || error.message);
    }
  };
  
  const handleInterested = async (eventId) => {
    const token = localStorage.getItem("token");
    console.log("add interest clicked for event:", eventId);
    console.log("Currently logged-in user ID:", user?.id); 
    if (!isLoggedIn) {
      toast.warning("Please log in to show interest in an event.");
      return;
    }
  
    try {
      // Proceed to mark the user as interested
      const response = await axios.post(
        `https://handson-backend-ix8y.onrender.com/api/events/${eventId}/user`,
        {
          userId: user._id,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      // If the backend responds that the user is already in the list, show a popup
      if (response.data.message === "User is already interested in this event") {
        alert("You are already in the interested list.");
        return;
      }
  
      // Update the state to reflect the change
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event._id === eventId
            ? {
                ...event,
                interestedUsers: [...event.interestedUsers, user._id],
              }
            : event
        )
      );
  
      alert("Marked as interested!");
    } catch (error) {
      // Log detailed error message
      console.error("Error marking interest:", error.response?.data || error.message);
  
      // Check for specific error message from backend and show appropriate message
      if (error.response?.data?.message === "User is already interested in this event") {
        console.log("User is already interested in this event."); // Log info
        alert("You are already in the interested list.");
      } else {
        console.error("Error marking interest:", error.response?.data || error.message);
        toast.error("Failed to mark interest.");
      }
    }
  };
  

const handleRemoveInterest = async (eventId) => {
    console.log("Remove interest clicked for event:", eventId);
    console.log("Currently logged-in user ID:", user?.id); 

    if (!isLoggedIn) {
        toast.warning("Please log in to remove interest.");
        return;
    }

    try {
        const token = localStorage.getItem("token");

        await axios.delete(`https://handson-backend-ix8y.onrender.com/api/events/${eventId}/user`, {
            headers: { Authorization: `Bearer ${token}` },
            data: { userId: user.id }, 
        });

        // ✅ Update state properly
        setEvents((prevEvents) =>
            prevEvents.map((event) =>
                event._id === eventId
                    ? { 
                        ...event, 
                        interestedUsers: event.interestedUsers.filter((id) => id !== user.id) 
                      }
                    : event
            )
        );

        alert("Interest removed.");
    } catch (error) {
      if (error.response?.data?.message === "User is not in the interested users list") {
        console.log("User is not in the interested list.");
        alert("You are not in the interested list.");
      } else {
        console.error("Error removing interest:", error.response?.data || error.message);
        toast.error("Failed to remove interest.");
      }
    }
};



const handleShowInterested = async (eventId) => {
  try {
    // Get the token from localStorage (or wherever you store the token)
    const token = localStorage.getItem('token'); 

    if (!token) {
      console.error("No token found");
      return;
    }

    // Set the Bearer token in the request headers
    
    // Make a GET request to fetch event by ID using axios and include the Bearer token in headers
    const response = await axios.get(`https://handson-backend-ix8y.onrender.com/api/events/${eventId}`, 
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    if (response.status === 200) {
      const event = response.data;
      setInterestedUsers(event.interestedUsers); 
      setShowInterestedModal(true); 
    } else {
      console.error("Error fetching event:", response.data.message);
    }
  } catch (error) {
    console.error("Error:", error);
  }
};


const getCurrentDateMinusOneDayInBST = () => {
  const currentDate = new Date();
  
  // Subtract one day
  currentDate.setDate(currentDate.getDate() );
  
  // Adjust to Bangladesh Standard Time (UTC+6)
  currentDate.setHours(currentDate.getHours() + 6);

  // Format to ISO 8601 (including the date part, but keep the same format)
  return currentDate.toISOString();
};

return (
  <div className="container mt-4">
    <h2 className="text-center mb-4">📅 All Events</h2>
    {
    message && (
        <div
            className={`alert alert-${messageType}`}
            role="alert"
            onClick={() => setMessage('')} 
        >
            {message}
        </div>
    )
}
    <InfiniteScroll
      dataLength={events.length}
      next={fetchEvents}
      hasMore={hasMore}
      loader={<h4 className="text-center">Loading more events...</h4>}
    >
      {events.map((event) => {
        const isEventOwner = isLoggedIn && (user?._id || user?.id) === event.createdBy?._id;
         
        const eventDateTime= (event.date);
         const currentDateTime = getCurrentDateMinusOneDayInBST();
         

        // Compare current date minus one day with the event date (without time)
        const isPastEvent = currentDateTime.split('T')[0] >= eventDateTime.split('T')[0];

        

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
              <p className="card-text text-dark"><strong>Description:</strong> {event.description}</p>
              {isLoggedIn && <div style={{ display: "flex", gap: "10px" }}>
                <Button variant="success" onClick={() => handleInterested(event._id)} disabled={isPastEvent}>
                  👍 Mark Interested
                </Button>
                <Button variant="danger" onClick={() => handleRemoveInterest(event._id)}>
                  ❌ Remove Interest
                </Button>
                <Button
                  variant="info"
                  onClick={() => handleShowInterested(event._id)}
                >
                  🧐 View Interested Users
                </Button>
              </div>}
              
            </div>
          </div>
        );
      })}
    </InfiniteScroll>
    <Modal show={showInterestedModal} onHide={() => setShowInterestedModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Users Interested in This Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ul>
            {interestedUsers.length > 0 ? (
              interestedUsers.map((user, index) => (
                <li key={index}>{user.name}</li>
              ))
            ) : (
              <li>No users have shown interest yet.</li>
            )}
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowInterestedModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
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
