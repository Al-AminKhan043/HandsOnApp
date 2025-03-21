import React, { useState } from "react";
import { Button, Modal, Form, Alert } from "react-bootstrap";
import axios from "axios";
import { useSelector } from "react-redux";
import NewComment from "./NewComment";

const Comments = ({ post }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentComment, setCurrentComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [error, setError] = useState(null);
  const { token, user } = useSelector((state) => state.auth);

  const handleDeleteComment = async (commentId) => {
    if (!token) {
      alert("Unauthorized: No token found!");
      return;
    }

    if (window.confirm("Are you sure you want to delete this comment?")) {
      try {
        await axios.delete(`https://handson-backend-ix8y.onrender.com/api/comments/${commentId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        alert("Comment deleted successfully!");
        window.location.reload();
      } catch (error) {
        setError(error.response?.data?.message || "Error deleting comment.");
      }
    }
  };

  const handleEditComment = async () => {
    if (!token) {
      alert("Unauthorized: No token found!");
      return;
    }

    try {
      await axios.put(
        `https://handson-backend-ix8y.onrender.com/api/comments/${editingCommentId}`,
        { text: currentComment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Comment updated successfully!");
      setShowEditModal(false);
      window.location.reload();
    } catch (error) {
      setError(error.response?.data?.message || "Error editing comment.");
    }
  };

  const handleCommentAdded = (newComment) => {
    post.comments.push(newComment);
  };

  return (
    <div className="mt-3">
      {error && <Alert variant="danger">{error}</Alert>}

      {post.comments.length > 0 && (
        <div>
          <h6 className="text-secondary">💬 Comments:</h6>
          <ul className="list-group">
            {post.comments.map((comment) => {
              const isCommentOwner =
                user && (user._id || user.id) === comment.postedBy?._id;

              return (
                <li
                  key={comment._id}
                  className="list-group-item bg-light border-0 rounded"
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex flex-column">
                      <strong className="text-primary">
                        {comment.postedBy.name}:
                      </strong>
                      <span>{comment.text}</span>
                    </div>
                    {isCommentOwner && (
                      <div className="d-flex">
                        <Button
                          variant="warning"
                          size="sm"
                          className="me-2"
                          onClick={() => {
                            setEditingCommentId(comment._id);
                            setCurrentComment(comment.text);
                            setShowEditModal(true);
                          }}
                        >
                          ✏️ Edit 
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDeleteComment(comment._id)}
                        >
                          🗑️ Delete 
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

      {/* Add new comment */}
      <NewComment postId={post._id} onCommentAdded={handleCommentAdded} />

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
