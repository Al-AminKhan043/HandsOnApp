import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import { useSelector } from "react-redux";
import { Button, Modal, Form } from "react-bootstrap"; // Import Modal and Form components


const AllEvents = () => {
  const [events, setEvents] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false); // State to control modal visibility
  const [editingEvent, setEditingEvent] = useState(null); // State to store the event being edited

  const { isLoggedIn, user } = useSelector((state) => state.auth);

  const fetchEvents = useCallback(async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/events?page=${page}&limit=5`);

      if (res.data.events.length > 0) {
        setEvents((prevEvents) => {
          const newEvents = res.data.events.filter(
            (newEvent) => !prevEvents.some((prevEvent) => prevEvent._id === newEvent._id)
          );
          return [...prevEvents, ...newEvents];
        });

        setPage((prevPage) => prevPage + 1);
      } else {
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
          level: editingEvent.level,
          description: editingEvent.description,
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
      alert("Event updated successfully!");
      window.location.reload();
    } catch (error) {
      console.error("Error editing event:", error.response?.data || error.message);
    }
  };

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

                <p className="text-muted mb-2">👤 <strong>Posted by:</strong> {event.postedBy?.name}</p>
                <p className="text-secondary">
                  <strong>Level:</strong> {event.level}
                </p>
                <p className="card-text text-dark">{event.description}</p>

               
              </div>
            </div>
          );
        })}
      </InfiniteScroll>

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

              <Form.Group controlId="editLevel" className="mt-3">
                <Form.Label>Level</Form.Label>
                <Form.Control
                  type="text"
                  value={editingEvent.level}
                  onChange={(e) => setEditingEvent({ ...editingEvent, level: e.target.value })}
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
