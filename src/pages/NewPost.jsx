import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { useSelector } from "react-redux";
import axios from "axios";

export default function NewPost(){
    const [title,setTitle]=useState('');
    const [level,setLevel]=useState('');
    const [description,setDescription]=useState('');
    const [error,setError]=useState(null);
    const [success,setSuccess]= useState(null);
    const {token}=useSelector((state)=> state.auth);

    const handleSubmit= async(e)=>{
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if(! title || !level || !description){
        setError('All fields are required.')
        return;
    }
    try{
         await axios.post(`http://localhost:5000/api/posts/new`,
            {title,level,description },
            {
                headers:{
                    Authorization:  `Bearer ${token}`,
                    "Content-Type": "application/json",
                }
            }
        )
        setSuccess('Post created successfully!');
        setTitle('');
        setLevel('');
        setDescription('');
    } catch(err){
        setError(err.respose?.data?.message || "Error creating post")
    }
    }

    return (
        <>
        <div className="container mt-4">
      <h2>Create a Post</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && (
          <Alert
            variant="success"
            onClick={() => setSuccess(null)} // Clear success message on click
            style={{ cursor: 'pointer' }}  // Optional: Add a cursor pointer style to indicate it's clickable
          >
            {success}
          </Alert>
        )}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Level</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter level"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Enter description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Create Post
        </Button>
      </Form>
    </div>
  
        </>
    )
}