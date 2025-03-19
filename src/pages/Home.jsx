import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "./Home.css"; 

export default function Home() {
  return (
    <Container fluid className="d-flex justify-content-center align-items-center vh-100 home-bg">
      <Row className="text-center">
        <Col>
          <h1 className="home-title">Welcome to HandsOn</h1>
          <h2 className="home-subtitle">Join and explore our community</h2>
        </Col>
      </Row>
    </Container>
  );
}
