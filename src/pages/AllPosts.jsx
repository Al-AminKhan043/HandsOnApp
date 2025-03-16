import React, { useEffect, useState } from "react";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import "bootstrap/dist/css/bootstrap.min.css";

const AllPosts = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchPosts = async () => {
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
  };

  useEffect(() => {
    fetchPosts();
  }, []); // ✅ Runs only once when the component mounts

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">📢 All Posts</h2>

      <InfiniteScroll
        dataLength={posts.length}
        next={fetchPosts}
        hasMore={hasMore}
        loader={<h4 className="text-center">Loading more posts...</h4>}
      >
        {posts.map((post) => (
          <div key={post._id} className="card mb-4 shadow-sm border-0 rounded-3" style={{ backgroundColor: "#f8f9fa" }}>
            <div className="card-body p-4">
              <h4 className="card-title text-primary fw-bold">{post.title}</h4>
              <p className="text-muted mb-2">👤 <strong>Posted by:</strong> {post.postedBy.name}</p>
              <p className="text-secondary"><strong>Level:</strong> {post.level}</p>
              <p className="card-text text-dark">{post.description}</p>

              {post.comments.length > 0 && (
                <div className="mt-3">
                  <h6 className="text-secondary">💬 Comments:</h6>
                  <ul className="list-group">
                    {post.comments.map((comment) => (
                      <li key={comment._id} className="list-group-item bg-light border-0 rounded">
                        <strong className="text-primary">{comment.postedBy.name}:</strong> {comment.text}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default AllPosts;
