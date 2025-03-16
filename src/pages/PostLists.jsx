import React from "react";
import { Link,Route,Routes } from "react-router-dom";
import AllPosts from "./allPosts";
import NewPost from "./NewPost";

const PostLists = () => {
  return(
  <div>
    <nav className="navbar navbar-expand-lg bg-transparent">
      <div className="container d-flex justify-content-center">
        <ul className="navbar-nav gap-4"> {/* Added gap-4 for spacing */}
          <li className="nav-item">
            <Link to='/posts' className="nav-link fw-bold">All Posts</Link>
          </li>
          <li className="nav-item">
            <Link to="newPost" className="nav-link fw-bold">Create Post</Link>
          </li>
        </ul>
      </div>
    </nav>

    <Routes>
      <Route path="/" element={<AllPosts></AllPosts>}></Route>
      <Route path="newPost" element={<NewPost></NewPost>}></Route>
    </Routes>
    </div>
  )
};

export default PostLists;
