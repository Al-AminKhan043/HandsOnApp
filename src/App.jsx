import { HashRouter  as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login"; 
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Account from "./pages/Account";
import EventLists from "./pages/EventLists";
import PostLists from "./pages/PostLists";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Router>
      <Navbar />
  
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} /> 
        <Route path="/signup" element={<Signup />} />
        <Route path="/account" element={<Account />} />
        <Route path="/events/*" element={<EventLists />} />
        <Route path="/posts/*" element={<PostLists />} />
        <Route path="*" element={<NotFound />} /> 
      </Routes>
      
    </Router>
  );
}

export default App;
