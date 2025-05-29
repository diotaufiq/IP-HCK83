import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Row, Col, Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../../../src/redux/features/authSlice';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Swal from 'sweetalert2';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, isError, errorMessage } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Only check confirm password on frontend, let backend handle other validations
    if (formData.password !== formData.confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Password Mismatch',
        text: 'Passwords do not match!',
      });
      return;
    }
    
    const { confirmPassword, ...registerData } = formData;
    const result = await dispatch(register(registerData));
    if (result.type === 'auth/register/fulfilled') {
      Swal.fire({
        icon: 'success',
        title: 'Registration Successful',
        text: 'Account created successfully! Please login.',
        timer: 2000,
        showConfirmButton: false
      }).then(() => {
        navigate('/login');
      });
    }
  };

  return (
    <div className="min-vh-100">
      <Container fluid className="p-0">
        <Row className="min-vh-100 g-0">
          {/* Left Side - Advertisement/Image with Gemini Background */}
          <Col lg={6} className="d-none d-lg-flex position-relative">
            <div 
              className="w-100 d-flex align-items-center justify-content-center"
              style={{
                backgroundImage: 'url(/Gemini_Generated_Image_l5djkal5djkal5dj.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                position: 'relative'
              }}
            >
              {/* Overlay for better text readability */}
              <div 
                className="position-absolute w-100 h-100"
                style={{
                  background: 'rgba(0,0,0,0.4)',
                  zIndex: 1
                }}
              ></div>
              
              {/* Content */}
              <div className="text-center text-white position-relative" style={{ zIndex: 2 }}>
                <h1 className="display-4 fw-bold mb-4">Join CarHub</h1>
                <p className="lead mb-4">
                  Start your journey to find the perfect car today
                </p>
                <div className="d-flex justify-content-center">
                  <div className="bg-white bg-opacity-10 p-4 rounded-3">
                    <i className="bi bi-person-plus-fill" style={{ fontSize: '4rem' }}></i>
                  </div>
                </div>
              </div>
            </div>
          </Col>

          {/* Right Side - Register Form */}
          <Col lg={6} className="d-flex align-items-center justify-content-center p-4">
            <div className="w-100" style={{ maxWidth: '400px' }}>
              <Card className="shadow-lg border-0">
                <Card.Body className="p-5">
                  <div className="text-center mb-4">
                    <h2 className="fw-bold text-primary">Create Account</h2>
                    <p className="text-muted">Join us and start exploring amazing cars</p>
                  </div>

                  {isError && (
                    <Alert variant="danger" className="mb-3">
                      {errorMessage}
                    </Alert>
                  )}

                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Label>Username</Form.Label>
                      <Form.Control
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="Enter your username"
                        className="py-2"
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Email Address</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        className="py-2"
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                        className="py-2"
                      />
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label>Confirm Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm your password"
                        className="py-2"
                      />
                    </Form.Group>

                    <Button 
                      type="submit" 
                      variant="primary" 
                      size="lg" 
                      className="w-100 py-2 mb-3"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Spinner animation="border" size="sm" className="me-2" />
                          Creating Account...
                        </>
                      ) : (
                        'Create Account'
                      )}
                    </Button>

                    <div className="text-center">
                      <span className="text-muted">Already have an account? </span>
                      <Link to="/login" className="text-decoration-none fw-semibold">
                        Sign In
                      </Link>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default RegisterPage;