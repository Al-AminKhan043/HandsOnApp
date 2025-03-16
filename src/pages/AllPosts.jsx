import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import { useSelector } from "react-redux";
import { Card, Button, Modal, Form } from "react-bootstrap";


const AllPosts = () => {
  
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentComment, setCurrentComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);

  const { isLoggedIn, user } = useSelector((state) => state.auth); // Get user data from Redux

  // Wrap the fetchPosts function in useCallback to memoize it
  const fetchPosts = useCallback(async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/posts?page=${page}&limit=5`);

      if (res.data.posts.length > 0) {
        setPosts((prevPosts) => {
          // 🔥 Prevent duplicate posts from being added
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
  }, [page]); // Memoizing the function to avoid re-renders on every change

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]); // ✅ Runs only once when the component mounts

  const handleEdit = (post) => {
    console.log("Editing post:", post);
  };

  const handleDeletePost = async (postId) => {
    const token = localStorage.getItem("token"); // Ensure token exists

    if (!token) {
      alert("Unauthorized: No token found!");
      return;
    }

    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await axios.delete(`http://localhost:5000/api/posts/${postId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setPosts(posts.filter((post) => post._id !== postId));
        alert("Post deleted successfully!");
      } catch (error) {
        console.error("Error deleting post:", error.response?.data || error.message);
      }
    }
  };

  const handleDeleteComment = async (commentId) => {
    const token = localStorage.getItem("token"); // Ensure token exists

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

        setPosts((prevPosts) => {
          return prevPosts.map((post) => {
            return {
              ...post,
              comments: post.comments.filter((comment) => comment._id !== commentId),
            };
          });
        });
        alert("Comment deleted successfully!");
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
      const res = await axios.put(
        `http://localhost:5000/api/comments/${editingCommentId}`,
        { text: currentComment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPosts((prevPosts) => {
        return prevPosts.map((post) => {
          return {
            ...post,
            comments: post.comments.map((comment) =>
              comment._id === editingCommentId ? res.data : comment
            ),
          };
        });
      });

      setShowEditModal(false);
      alert("Comment updated successfully!");
      window.location.reload(); 
    } catch (error) {
      console.error("Error editing comment:", error.response?.data || error.message);
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
                      <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleEdit(post)}>
                        Edit
                      </Button>
                      <Button variant="outline-danger" size="sm" onClick={() => handleDeletePost(post._id)}>
                        Delete Post
                      </Button>
                    </div>
                  )}
                </div>

                <p className="text-muted mb-2">👤 <strong>Posted by:</strong> {post.postedBy?.name}</p>
                <p className="text-secondary"><strong>Level:</strong> {post.level}</p>
                <p className="card-text text-dark">{post.description}</p>

                {post.comments.length > 0 && (
                  <div className="mt-3">
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
              </div>
            </div>
          );
        })}
      </InfiniteScroll>

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

export default AllPosts;
