import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100 text-center">
      <div className="row">
        <div className="col">
          <h1 className="display-1 text-danger">404</h1>
          <p className="lead">Oops! The page you're looking for doesn't exist.</p>
          <Link to="/" className="btn btn-primary btn-lg">
            Go Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
