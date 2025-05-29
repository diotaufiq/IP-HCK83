import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Row, Col, Card, Button, Badge, Spinner } from 'react-bootstrap';
import { addToWishlist } from '../redux/features/wishlistSlice';
import { createCheckoutSession } from '../redux/features/paymentSlice';
import Navbar from '../components/Navbar';
import Swal from 'sweetalert2';
import { formatToRupiah } from '../utils/formatter'; // Add this import

const CarDetailPage = () => {
  const { carId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { isLoading: paymentLoading } = useSelector((state) => state.payment);
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCarDetail = async () => {
      try {
        const response = await fetch(`http://localhost:3000/cars/${carId}`);
        if (response.ok) {
          const carData = await response.json();
          setCar(carData);
        } else {
          throw new Error('Car not found');
        }
      } catch (error) {
        console.error('Error fetching car details:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load car details',
        }).then(() => {
          navigate('/');
        });
      } finally {
        setLoading(false);
      }
    };

    if (carId) {
      fetchCarDetail();
    }
  }, [carId, navigate]);

  const handleAddToWishlist = () => {
    if (!token) {
      Swal.fire({
        icon: 'warning',
        title: 'Login Required',
        text: 'Please login to add cars to your wishlist',
      });
      return;
    }
    dispatch(addToWishlist(car.id));
  };

  const handleBuyNow = () => {
    if (!token) {
      Swal.fire({
        icon: 'warning',
        title: 'Login Required',
        text: 'Please login to purchase this car',
      });
      return;
    }
    dispatch(createCheckoutSession(car.id));
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
          <Spinner animation="border" variant="primary" />
        </Container>
      </>
    );
  }

  if (!car) {
    return (
      <>
        <Navbar />
        <Container className="text-center mt-5">
          <h2>Car not found</h2>
          <Button variant="primary" onClick={() => navigate('/')}>Back to Home</Button>
        </Container>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Container className="py-5">
        <Button 
          variant="outline-secondary" 
          className="mb-4"
          onClick={() => navigate('/')}
        >
          <i className="bi bi-arrow-left me-2"></i>Back to Cars
        </Button>
        
        <Row className="g-4">
          {/* Car Image */}
          <Col lg={6}>
            <Card className="border-0 shadow-lg">
              <Card.Img 
                variant="top" 
                src={car.imageUrl || 'https://via.placeholder.com/600x400?text=No+Image'}
                alt={`${car.brand} ${car.Type}`}
                style={{ 
                  height: '400px', 
                  objectFit: 'cover',
                  borderRadius: '15px'
                }}
              />
            </Card>
          </Col>
          
          {/* Car Details */}
          <Col lg={6}>
            <div className="h-100 d-flex flex-column">
              {/* Header */}
              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <h1 className="display-5 fw-bold text-primary mb-2">{car.brand}</h1>
                    <h3 className="text-muted">{car.Type}</h3>
                  </div>
                  <Badge 
                    bg={car.condition === 'New' ? 'success' : 'warning'} 
                    className="fs-6 px-3 py-2"
                  >
                    {car.condition}
                  </Badge>
                </div>
                <div className="display-6 fw-bold text-success mb-4">
                  {formatToRupiah(car.price)} {/* Changed from: Rp {car.price.toLocaleString('id-ID')} */}
                </div>
              </div>

              {/* Specifications */}
              <Card className="mb-4 border-0 bg-light">
                <Card.Body>
                  <h5 className="card-title mb-3">
                    <i className="bi bi-gear-fill me-2 text-primary"></i>
                    Specifications
                  </h5>
                  <Row className="g-3">
                    <Col sm={6}>
                      <div className="d-flex align-items-center">
                        <i className="bi bi-calendar3 me-2 text-muted"></i>
                        <div>
                          <small className="text-muted d-block">Year</small>
                          <strong>{car.released_year}</strong>
                        </div>
                      </div>
                    </Col>
                    <Col sm={6}>
                      <div className="d-flex align-items-center">
                        <i className="bi bi-fuel-pump me-2 text-muted"></i>
                        <div>
                          <small className="text-muted d-block">Fuel Type</small>
                          <strong>{car.fuel}</strong>
                        </div>
                      </div>
                    </Col>
                    <Col sm={6}>
                      <div className="d-flex align-items-center">
                        <i className="bi bi-speedometer2 me-2 text-muted"></i>
                        <div>
                          <small className="text-muted d-block">Mileage</small>
                          <strong>{car.mileage ? `${car.mileage.toLocaleString()} km` : 'N/A'}</strong>
                        </div>
                      </div>
                    </Col>
                    <Col sm={6}>
                      <div className="d-flex align-items-center">
                        <i className="bi bi-palette me-2 text-muted"></i>
                        <div>
                          <small className="text-muted d-block">Color</small>
                          <strong>{car.color || 'N/A'}</strong>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              {/* Description */}
              {car.description && (
                <Card className="mb-4 border-0 bg-light">
                  <Card.Body>
                    <h5 className="card-title mb-3">
                      <i className="bi bi-file-text me-2 text-primary"></i>
                      Description
                    </h5>
                    <p className="mb-0">{car.description}</p>
                  </Card.Body>
                </Card>
              )}

              {/* Action Buttons */}
              <div className="mt-auto">
                <Row className="g-3">
                  <Col sm={6}>
                    <Button 
                      variant="success" 
                      size="lg"
                      className="w-100 fw-bold"
                      onClick={handleBuyNow}
                      disabled={paymentLoading}
                    >
                      {paymentLoading ? (
                        <>
                          <Spinner animation="border" size="sm" className="me-2" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-credit-card me-2"></i>
                          Buy Now
                        </>
                      )}
                    </Button>
                  </Col>
                  <Col sm={6}>
                    <Button 
                      variant="outline-primary" 
                      size="lg"
                      className="w-100 fw-bold"
                      onClick={handleAddToWishlist}
                    >
                      <i className="bi bi-heart me-2"></i>
                      Add to Wishlist
                    </Button>
                  </Col>
                </Row>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default CarDetailPage;