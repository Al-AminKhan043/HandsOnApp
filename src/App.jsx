import Home from './pages/Home'
import Navbar from "./components/Navbar";
import Logout from './pages/Logout';
import { useState } from 'react';
import Signup from './pages/Signup';
import './App.css'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
function App() {
 
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <>
      <Router>
        <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}></Navbar>
        <Routes>
          <Route path='/' element={<Home></Home>} ></Route>
          <Route path="/signup" element={<Signup />} />
          <Route path="/logout" element={<Logout />} />
          </Routes> 
      </Router>
    </>
  )
}

export default App
