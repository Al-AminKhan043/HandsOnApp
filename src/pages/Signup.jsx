import { useState } from "react";
import axios from 'axios'
import { useNavigate } from "react-router-dom";

export default function Signup(){
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigate=useNavigate();
    

    const handleSubmit= async(e)=>{
    e.preventDefault();
    if(password!== confirmPassword){
        alert('Password dont match!')
        return;
    }
    try{
     await axios.post('http://localhost:5000/api/users/signup',{name,email,password})
     navigate('/')
    }
    catch(err){
        alert("Error: " + err.response.data.message);
    }
    }
    return(
        <>
        <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Name" value={name} onChange={(e)=> setName(e.target.value)} required />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
        <button type="submit">Signup</button>
        </form>
        </>
    )
}