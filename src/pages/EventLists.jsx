import React from "react";
import {Link, Route, Routes} from 'react-router-dom'
import AllEvents from './AllEvents'
import NewEvent from './NewEvent'
import {useSelector} from 'react-redux'
import NotFound from "./NotFound";



const EventLists = () => {

  const {isLoggedIn} =useSelector((state)=> state.auth);
  return (
    <>
     <div>
      <nav className="navbar navbar-expand-lg bg-transparent">
        <div className="container d-flex justify-content-center">
          <ul className="navbar-nav gap-4">
            <li className="nav-item">
              <Link to="/events" className="nav-link fw-bold">All Events</Link>
            </li>
            <li className="nav-item">
              {isLoggedIn && (
                <Link to="/events/newEvent" className="nav-link fw-bold">Create Event</Link>
              )}
            </li>
          </ul>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<AllEvents />} />
        {isLoggedIn && <Route path="newEvent" element={<NewEvent />} />}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
    </>
  )
};

export default EventLists;
