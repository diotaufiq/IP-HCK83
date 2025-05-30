import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/features/authSlice';
import { Navbar, Container, Nav, Button, NavDropdown } from 'react-bootstrap';
import WishlistModal from './WishlistModal';

const NavbarComponent = () => {
  const [showWishlist, setShowWishlist] = useState(false);
  const { user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  // Check if user is admin or superadmin (fixed case sensitivity)
  const isAdmin = user && (user.role === 'superadmin' || user.role === 'admin' || user.role === 'Admin' || user.role === 'SuperAdmin');
  console.log(user, "ini user");
  console.log(token, "ini token");
  console.log(isAdmin, "ini isAdmin");

  return (
    <Navbar expand="lg" className="navbar-dark" style={{ background: 'linear-gradient(to right, #001f3f, #0074D9)' }}>
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold fs-4">CarHub</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" className="text-white">Home</Nav.Link>
            <Nav.Link as={Link} to="/about" className="text-white">About Us</Nav.Link>
            {/* Manage dropdown for admin/superadmin */}
            {isAdmin && (
              <NavDropdown title="Manage" id="manage-dropdown" className="text-white">
                <NavDropdown.Item as={Link} to="/cars/add">
                  <i className="bi bi-plus-circle me-2"></i>
                  Add Cars
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/cars/manage">
                  <i className="bi bi-pencil-square me-2"></i>
                  Manage Cars
                </NavDropdown.Item>

              </NavDropdown>
            )}
          </Nav>
          <Nav>
            {token ? (
              <>
                <Button 
                  variant="outline-light" 
                  className="me-2" 
                  onClick={() => setShowWishlist(true)}
                >
                  <i className="bi bi-heart-fill me-1"></i> Wishlist
                </Button>
                <Button 
                  variant="outline-light" 
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button 
                  as={Link} 
                  to="/login" 
                  variant="outline-light" 
                  className="me-2"
                >
                  Login
                </Button>
                <Button 
                  as={Link} 
                  to="/register" 
                  variant="light"
                >
                  Register
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
      <WishlistModal show={showWishlist} handleClose={() => setShowWishlist(false)} />
    </Navbar>
  );
};

export default NavbarComponent;
