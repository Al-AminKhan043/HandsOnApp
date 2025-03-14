import React from 'react'
import {Link, NavLink} from 'react-router-dom'

export default function Navbar(){
    const isloggedIn= localStorage.getItem('jwt');
    return (
        <>
        <ul>
            <li><NavLink to='/'>Home</NavLink></li>
            <li><NavLink to="/account">Account</NavLink></li>
            <li><NavLink to="/events">Events</NavLink></li>
            <li><NavLink to="/posts">Posts</NavLink></li>
            {isloggedIn? (<>
                <li><NavLink to="/signup">Signup</NavLink></li>
                <li><NavLink to="/login">Login</NavLink></li>
            </>):(
               <li><NavLink to='/logout'> Logout</NavLink> </li>
            )}
            </ul>
        </>
    )
}