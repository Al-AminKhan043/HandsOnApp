import React, {useState} from 'react'
import {Button,Modal,Form,Alert} from 'react-bootstrap'
import { useSelector } from 'react-redux'
import axios from 'axios'


export default function NewComment({postId,onCommentAdded}){
 
    const [show,setShow]=useState(false);
    const [text,setText]=useState('')
    const [error,setError]=useState(null);
    const [loading,setLoading]= useState(false);
    const {token, user} =useSelector((state)=> state.auth);
    const handleSubmit= async(e)=>{
        e.preventDefault();
        setLoading(true);
        setError(null);
       if(!text.trim()){
        setError('Comment cannot be empty.');
        setLoading(false);
        return;
       }
       try{
        const response =await axios.post(`http://localhost:5000/api/comments/${postId}`,
            {text},
            {headers:{
                Authorization: `Bearer ${token}`
            }}
        )
        setText('');
        setShow(false);
        onCommentAdded(response.data);
        window.location.reload()
       }
       catch (err) {
        setError(err.response?.data?.message || "Failed to add comment.");
      } finally {
        setLoading(false);
      }
    }
    return (
        <>
        {user && token? (
            <> 
            <Button variant="primary" className="mt-3" onClick={() => setShow(true)}>
            Add Comment
            </Button>
            <Modal show={show} onHide={()=> setShow(false)}>
            <Modal.Header closeButton>
            <Modal.Title>New Comment</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
                <Form.Group>
                    <Form.Control
                    as='textarea'
                    rows={3}
                    placeholder='Write your comment...'
                    value={text}
                    onChange={(e)=> setText(e.target.value)}
                    />
                                 
                </Form.Group>
                <Button type="submit" variant="success" className="mt-3" disabled={loading}>
                  {loading ? "Submitting..." : "Submit"}
                </Button>
                </Form>  
            </Modal.Body>
            </Modal>
            </>
        ): (
            <Alert variant="warning" className="mt-3">
          You must be logged in to comment.
        </Alert> 
        )}
        </>
    )
}