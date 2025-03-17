import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import { useSelector } from "react-redux";
import { Button, Modal, Form } from "react-bootstrap"; // Import Modal and Form components
import Comments from "./Comments";

const AllPosts = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false); // State to control modal visibility
  const [editingPost, setEditingPost] = useState(null); // State to store the post being edited

  const { isLoggedIn, user } = useSelector((state) => state.auth);

  const fetchPosts = useCallback(async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/posts?page=${page}&limit=5`);

      if (res.data.posts.length > 0) {
        setPosts((prevPosts) => {
          const newPosts = res.data.posts.filter(
            (newPost) => !prevPosts.some((prevPost) => prevPost._id === newPost._id)
          );
          return [...prevPosts, ...newPosts];
        });

        setPage((prevPage) => prevPage + 1);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Error fetching posts:", err);
    }
  }, [page]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleDeletePost = async (postId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Unauthorized: No token found!");
      return;
    }

    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await axios.delete(`http://localhost:5000/api/posts/${postId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setPosts(posts.filter((post) => post._id !== postId));
        alert("Post deleted successfully!");
      } catch (error) {
        console.error("Error deleting post:", error.response?.data || error.message);
      }
    }
  };

  const handleEditPost = (post) => {
    setEditingPost(post); // Set the post data to be edited
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
        `http://localhost:5000/api/posts/${editingPost._id}/edit`,
        {
          title: editingPost.title,
          level: editingPost.level,
          description: editingPost.description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPosts((prevPosts) => {
        return prevPosts.map((post) =>
          post._id === editingPost._id ? res.data : post
        );
      });

      setShowEditModal(false); // Close the modal
      alert("Post updated successfully!");
      window.location.reload()
    } catch (error) {
      console.error("Error editing post:", error.response?.data || error.message);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">📢 All Posts</h2>

      <InfiniteScroll
        dataLength={posts.length}
        next={fetchPosts}
        hasMore={hasMore}
        loader={<h4 className="text-center">Loading more posts...</h4>}
      >
        {posts.map((post) => {
          const isPostOwner = isLoggedIn && (user?._id || user?.id) === post.postedBy?._id;

          return (
            <div key={post._id} className="card mb-4 shadow-sm border-0 rounded-3" style={{ backgroundColor: "#f8f9fa" }}>
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center">
                  <h4 className="card-title text-primary fw-bold">{post.title}</h4>
                  {isPostOwner && (
                    <div className="d-flex">
                      <Button
                        variant="warning"
                        size="sm"
                        className="me-2"
                        onClick={() => handleEditPost(post)}
                      >
                        ✏️ Edit Post
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => handleDeletePost(post._id)}>
                      🗑️ Delete Post
                      </Button>
                    </div>
                  )}
                </div>

                <p className="text-muted mb-2">👤 <strong>Posted by:</strong> {post.postedBy?.name}</p>
                <p className="text-secondary">
                  <strong>Level:</strong> {post.level}
                </p>
                <p className="card-text text-dark">{post.description}</p>

                <Comments post={post} isLoggedIn={isLoggedIn} user={user} />
              </div>
            </div>
          );
        })}
      </InfiniteScroll>

      {/* Edit Post Modal */}
      {editingPost && (
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Post</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="editTitle">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  value={editingPost.title}
                  onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                />
              </Form.Group>

              <Form.Group controlId="editLevel" className="mt-3">
                <Form.Label>Level</Form.Label>
                <Form.Control
                  type="text"
                  value={editingPost.level}
                  onChange={(e) => setEditingPost({ ...editingPost, level: e.target.value })}
                />
              </Form.Group>

              <Form.Group controlId="editDescription" className="mt-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={editingPost.description}
                  onChange={(e) => setEditingPost({ ...editingPost, description: e.target.value })}
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

export default AllPosts;
