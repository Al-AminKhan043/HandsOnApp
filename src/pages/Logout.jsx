import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Logout(){
    const navigate=useNavigate();
    useEffect(()=>{
        const logoutUser = async()=>{
            try{
             await axios.post('http://localhost:5000/api/users/logout',{},{
                headers:{
                    Authorization: `Bearer ${localStorage.getItem("jwt")}`
                }
             })
             localStorage.removeItem('jwt');
             navigate('/')  
            }
            catch(err){
                console.error("Error during logout:", err);
            }
        }
        logoutUser();
    },[navigate])
    return null;
}