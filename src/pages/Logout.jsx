import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Logout(){
    const navigate=useNavigate();
    useEffect(()=>{
        localStorage.removeItem('jwt');
        navigate('/')
    },[navigate])
    return null;
}