import Home from './pages/Home'
import Navbar from "./components/Navbar";
import Logout from './pages/Logout';
import './App.css'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
function App() {
 

  return (
    <>
      <Router>
        <Navbar></Navbar>
        <Routes>
          <Route path='/' element={<Home></Home>} ></Route>
          <Route path="/logout" element={<Logout />} />
          </Routes> 
      </Router>
    </>
  )
}

export default App
