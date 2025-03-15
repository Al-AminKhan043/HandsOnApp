import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login"; // ✅ Import Login component
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Account from "./pages/Account";
import Events from "./pages/Events";
import Posts from "./pages/Posts";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} /> {/* ✅ Add Login Route */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/account" element={<Account />} />
        <Route path="/events" element={<Events />} />
        <Route path="/posts" element={<Posts />} />
      </Routes>
    </Router>
  );
}

export default App;
