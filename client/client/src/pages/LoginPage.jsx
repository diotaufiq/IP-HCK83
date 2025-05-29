import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Row, Col, Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { login,googleLogin } from '../../../src/redux/features/authSlice';
import 'bootstrap-icons/font/bootstrap-icons.css';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, isError, errorMessage } = useSelector((state) => state.auth);

  // Initialize Google Sign-In
  useEffect(() => {
    const initializeGoogleSignIn = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_REACT_APP_GOOGLE_CLIENT_ID, 
          callback: handleGoogleResponse
          
        });
        
        window.google.accounts.id.renderButton(
          document.getElementById('google-signin-button'),
          {
            theme: 'outline',
            size: 'large',
            width: '100%',
            text: 'signin_with'
          }
        );
      }
    };

    // Load Google Sign-In script
    if (!window.google) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogleSignIn;
      document.head.appendChild(script);
    } else {
      initializeGoogleSignIn();
    }
  }, []);

  const handleGoogleResponse = async (response) => {
    try {
      const result = await dispatch(googleLogin(response.credential));
      if (result.type === 'auth/googleLogin/fulfilled') {
        navigate('/');
      }
    } catch (error) {
      console.error('Google login error:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(login(formData));
    if (result.type === 'auth/login/fulfilled') {
      navigate('/');
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
                <h1 className="display-4 fw-bold mb-4">Welcome to CarHub</h1>
                <p className="lead mb-4">
                  Discover your perfect car from our extensive collection
                </p>
                <div className="d-flex justify-content-center">
                  <div className="bg-white bg-opacity-10 p-4 rounded-3">
                    <i className="bi bi-car-front-fill" style={{ fontSize: '4rem' }}></i>
                  </div>
                </div>
              </div>
            </div>
          </Col>

          {/* Right Side - Login Form */}
          <Col lg={6} className="d-flex align-items-center justify-content-center p-4">
            <div className="w-100" style={{ maxWidth: '400px' }}>
              <Card className="shadow-lg border-0">
                <Card.Body className="p-5">
                  <div className="text-center mb-4">
                    <h2 className="fw-bold text-primary">Sign In</h2>
                    <p className="text-muted">Welcome back! Please sign in to your account</p>
                  </div>

                  {isError && (
                    <Alert variant="danger" className="mb-3">
                      {errorMessage}
                    </Alert>
                  )}

                  {/* Google Sign-In Button */}
                  <div className="mb-4">
                    <div id="google-signin-button" className="d-flex justify-content-center"></div>
                  </div>

                  {/* Divider */}
                  <div className="text-center mb-4">
                    <div className="d-flex align-items-center">
                      <hr className="flex-grow-1" />
                      <span className="px-3 text-muted">or</span>
                      <hr className="flex-grow-1" />
                    </div>
                  </div>

                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Label>Email Address</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        required
                        className="py-2"
                      />
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                        required
                        className="py-2"
                      />
                    </Form.Group>

                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <Form.Check 
                        type="checkbox" 
                        label="Remember me" 
                        className="text-muted"
                      />
                      <Link to="/forgot-password" className="text-decoration-none">
                        Forgot Password?
                      </Link>
                    </div>

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
                          Signing In...
                        </>
                      ) : (
                        'Sign In'
                      )}
                    </Button>

                    <div className="text-center">
                      <span className="text-muted">Don't have an account? </span>
                      <Link to="/register" className="text-decoration-none fw-semibold">
                        Sign Up
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

export default LoginPage;