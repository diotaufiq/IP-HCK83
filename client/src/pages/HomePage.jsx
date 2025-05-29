import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { Container, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { fetchCars } from '../redux/features/carSlice';
import Sidebar from '../components/Sidebar';
import CarCard from '../components/CarCard';
import Pagination from '../components/Pagination';
import WishlistModal from '../components/WishlistModal';
import NavbarComponent from '../components/Navbar';
import Swal from 'sweetalert2';

const HomePage = () => {
  const [showWishlist, setShowWishlist] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { 
    filteredCars, 
    currentPage, 
    carsPerPage, 
    isLoading, 
    isError 
  } = useSelector((state) => state.cars);

  useEffect(() => {
    dispatch(fetchCars());
  }, [dispatch]);

  // Handle payment success
  useEffect(() => {
    const paymentStatus = searchParams.get('payment');
    const sessionId = searchParams.get('session_id');
    
    if (paymentStatus === 'success' && sessionId) {
      // Show success SweetAlert
      Swal.fire({
        icon: 'success',
        title: 'Pembayaran Berhasil!',
        html: `
          <div style="text-align: center;">
            <i class="bi bi-check-circle-fill text-success" style="font-size: 3rem;"></i>
            <p class="mt-3">Terima kasih atas pembelian Anda!</p>
            <p class="text-muted">Kami akan segera memproses pesanan Anda.</p>
            
          </div>
        `,
        confirmButtonText: 'Lanjutkan Belanja',
        confirmButtonColor: '#28a745',
        allowOutsideClick: false,
        allowEscapeKey: false
      }).then(() => {
        // Clear URL parameters after showing alert
        setSearchParams({});
      });
    } else if (paymentStatus === 'cancelled') {
      // Handle payment cancellation
      Swal.fire({
        icon: 'warning',
        title: 'Pembayaran Dibatalkan',
        text: 'Pembayaran Anda telah dibatalkan. Anda dapat mencoba lagi kapan saja.',
        confirmButtonText: 'OK',
        confirmButtonColor: '#ffc107'
      }).then(() => {
        // Clear URL parameters after showing alert
        setSearchParams({});
      });
    }
  }, [searchParams, setSearchParams]);

  // Get current cars for pagination
  const indexOfLastCar = currentPage * carsPerPage;
  const indexOfFirstCar = indexOfLastCar - carsPerPage;
  const currentCars = filteredCars.slice(indexOfFirstCar, indexOfLastCar);

  return (
    <div className="min-vh-100 d-flex flex-column">
      <NavbarComponent /> {/* Changed from <Navbar /> to <NavbarComponent /> */}
      <Container fluid className="flex-grow-1 py-4">
        <Row>
          {/* Sidebar */}
          <Col lg={3} md={4} className="mb-4 mb-md-0">
            <Sidebar />
          </Col>
          
          {/* Main Content */}
          <Col lg={9} md={8}>
            {isLoading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2">Loading cars...</p>
              </div>
            ) : isError ? (
              <Alert variant="danger">
                Error loading cars. Please try again later.
              </Alert>
            ) : filteredCars.length === 0 ? (
              <Alert variant="info">
                No cars found matching your criteria.
              </Alert>
            ) : (
              <>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h4 className="mb-0">Available Cars</h4>
                  <span className="text-muted">
                    Showing {currentCars.length} of {filteredCars.length} cars
                  </span>
                </div>
                
                <Row xs={1} sm={2} lg={3} className="g-4">
                  {currentCars.map((car) => (
                    <Col key={car.id}>
                      <CarCard car={car} />
                    </Col>
                  ))}
                </Row>
                
                <Pagination />
              </>
            )}
          </Col>
        </Row>
      </Container>
      
      {/* Footer */}
      <footer className="bg-dark text-white py-4 mt-auto">
        <Container>
          <Row>
            <Col className="text-center">
              <p className="mb-0">© 2025 CarHub. All rights reserved.</p>
            </Col>
          </Row>
        </Container>
      </footer>
      
      {/* Wishlist Modal */}
      <WishlistModal 
        show={showWishlist} 
        handleClose={() => setShowWishlist(false)} 
      />
    </div>
  );
};

export default HomePage;