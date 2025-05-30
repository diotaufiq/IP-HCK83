import React from 'react';
import { Container, Row, Col, Card, Image } from 'react-bootstrap';
import NavbarComponent from '../components/Navbar';

const AboutPage = () => {
  return (
    <>
      <NavbarComponent />
      <Container className="py-5">
        {/* Hero Section */}
        <Row className="mb-5">
          <Col>
            <div className="text-center">
              <h1 className="display-4 fw-bold text-primary mb-3">About Us</h1>
              <p className="lead text-muted">
                Welcome to our premium car marketplace - where quality meets excellence
              </p>
            </div>
          </Col>
        </Row>

        {/* Personal Profile Section */}
        <Row className="justify-content-center mb-5">
          <Col lg={8}>
            <Card className="shadow-lg border-0">
              <Card.Body className="p-5">
                <Row className="align-items-center">
                  <Col md={4} className="text-center mb-4 mb-md-0">
                    <Image 
                      src="/path/to/your/profile-image.jpg" // Replace with your actual image path
                      alt="Your Name"
                      roundedCircle
                      className="shadow"
                      style={{ width: '200px', height: '200px', objectFit: 'cover' }}
                    />
                  </Col>
                  <Col md={8}>
                    <h2 className="fw-bold text-primary mb-3">Your Name</h2>
                    <h5 className="text-muted mb-3">Founder & CEO</h5>
                    <p className="text-muted mb-4">
                      {/* Replace this with your personal story */}
                      With over [X] years of experience in the automotive industry, I founded this platform 
                      with a vision to revolutionize how people buy and sell premium vehicles. My passion 
                      for cars and commitment to excellence drives everything we do.
                    </p>
                    <p className="text-muted mb-4">
                      Our mission is to provide a trusted, transparent, and seamless experience for car 
                      enthusiasts and buyers alike. We believe that finding your dream car should be 
                      an exciting journey, not a stressful process.
                    </p>
                    <div className="d-flex gap-3">
                      <div>
                        <h6 className="fw-bold text-primary mb-1">Education</h6>
                        <p className="small text-muted mb-0">Your Educational Background</p>
                      </div>
                      <div>
                        <h6 className="fw-bold text-primary mb-1">Experience</h6>
                        <p className="small text-muted mb-0">[X]+ Years in Automotive</p>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Company Values Section */}
        <Row className="mb-5">
          <Col>
            <h2 className="text-center fw-bold text-primary mb-5">Our Values</h2>
          </Col>
        </Row>
        <Row>
          <Col md={4} className="mb-4">
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body className="text-center p-4">
                <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '60px', height: '60px'}}>
                  <i className="bi bi-shield-check fs-4"></i>
                </div>
                <h5 className="fw-bold mb-3">Trust & Transparency</h5>
                <p className="text-muted">
                  Every vehicle is thoroughly inspected and comes with complete documentation and history.
                </p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-4">
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body className="text-center p-4">
                <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '60px', height: '60px'}}>
                  <i className="bi bi-star-fill fs-4"></i>
                </div>
                <h5 className="fw-bold mb-3">Quality Excellence</h5>
                <p className="text-muted">
                  We curate only the finest vehicles that meet our strict quality standards.
                </p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-4">
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body className="text-center p-4">
                <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '60px', height: '60px'}}>
                  <i className="bi bi-people-fill fs-4"></i>
                </div>
                <h5 className="fw-bold mb-3">Customer First</h5>
                <p className="text-muted">
                  Your satisfaction is our priority. We're here to support you every step of the way.
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Contact Section */}
        <Row className="mt-5">
          <Col>
            <Card className="bg-primary text-white">
              <Card.Body className="text-center p-5">
                <h3 className="fw-bold mb-3">Get In Touch</h3>
                <p className="mb-4">
                  Have questions or want to learn more about our services? We'd love to hear from you.
                </p>
                <div className="d-flex justify-content-center gap-4">
                  <div>
                    <i className="bi bi-envelope-fill fs-5 mb-2 d-block"></i>
                    <small>your.email@example.com</small>
                  </div>
                  <div>
                    <i className="bi bi-telephone-fill fs-5 mb-2 d-block"></i>
                    <small>+62 XXX-XXXX-XXXX</small>
                  </div>
                  <div>
                    <i className="bi bi-geo-alt-fill fs-5 mb-2 d-block"></i>
                    <small>Your Location</small>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default AboutPage;