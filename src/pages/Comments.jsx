import React, { useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import axios from "axios";

const Comments = ({ post, isLoggedIn, user }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentComment, setCurrentComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);

  const handleDeleteComment = async (commentId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Unauthorized: No token found!");
      return;
    }

    if (window.confirm("Are you sure you want to delete this comment?")) {
      try {
        await axios.delete(`http://localhost:5000/api/comments/${commentId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Update the posts state to remove the deleted comment
        // Use a callback function from parent to update posts or do it directly.
        alert("Comment deleted successfully!");
        window.location.reload();
      } catch (error) {
        console.error("Error deleting comment:", error.response?.data || error.message);
      }
    }
  };

  const handleEditComment = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Unauthorized: No token found!");
      return;
    }

    try {
       await axios.put(
        `http://localhost:5000/api/comments/${editingCommentId}`,
        { text: currentComment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update the posts state to reflect the updated comment
      alert("Comment updated successfully!");
      setShowEditModal(false);
      window.location.reload()
    } catch (error) {
      console.error("Error editing comment:", error.response?.data || error.message);
    }
  };

  return (
    <div className="mt-3">
      {post.comments.length > 0 && (
        <div>
          <h6 className="text-secondary">💬 Comments:</h6>
          <ul className="list-group">
            {post.comments.map((comment) => {
              const isCommentOwner = isLoggedIn && (user?._id || user?.id) === comment.postedBy?._id;

              return (
                <li key={comment._id} className="list-group-item bg-light border-0 rounded">
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex flex-column">
                      <strong className="text-primary">{comment.postedBy.name}:</strong>
                      <span>{comment.text}</span>
                    </div>
                    {isCommentOwner && (
                      <div className="d-flex">
                        <Button
                          variant="outline-warning"
                          size="sm"
                          className="me-2"
                          onClick={() => {
                            setEditingCommentId(comment._id);
                            setCurrentComment(comment.text);
                            setShowEditModal(true);
                          }}
                        >
                          Edit Comment
                        </Button>
                        <Button variant="outline-danger" size="sm" onClick={() => handleDeleteComment(comment._id)}>
                          Delete Comment
                        </Button>
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Modal for editing comment */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Comment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            as="textarea"
            value={currentComment}
            onChange={(e) => setCurrentComment(e.target.value)}
            rows={3}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleEditComment}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Comments;
