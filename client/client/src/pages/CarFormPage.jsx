import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Alert } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { createCar, updateCar, fetchCars } from '../../../src/redux/features/carSlice';
import CarForm from '../components/CarForm';
import NavbarComponent from '../../../src/components/Navbar';

const CarFormPage = () => {
  const { carId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cars, isSubmitting, isError, errorMessage } = useSelector((state) => state.cars);
  const { user } = useSelector((state) => state.auth);
  
  const [currentCar, setCurrentCar] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const isEditMode = Boolean(carId);
  const pageTitle = isEditMode ? 'Edit Car' : 'Add New Car';

  useEffect(() => {
    // Check if user is admin or superadmin (fixed case sensitivity)
    const isAuthorized = user && (
      user.role === 'superadmin' || 
      user.role === 'admin' || 
      user.role === 'Admin' || 
      user.role === 'SuperAdmin'
    );
    
    if (!isAuthorized) {
      navigate('/');
      return;
    }

    if (isEditMode) {
      setLoading(true);
      // Find car in existing cars or fetch if not available
      const existingCar = cars.find(car => car.id === parseInt(carId));
      
      if (existingCar) {
        setCurrentCar(existingCar);
        setLoading(false);
      } else {
        // Fetch cars if not available
        dispatch(fetchCars()).then(() => {
          const car = cars.find(car => car.id === parseInt(carId));
          setCurrentCar(car);
          setLoading(false);
        });
      }
    }
  }, [carId, isEditMode, user, navigate, dispatch, cars]);

  const handleSubmit = async (formData) => {
    try {
      if (isEditMode) {
        const result = await dispatch(updateCar({ carId: parseInt(carId), carData: formData }));
        if (result.type === 'cars/updateCar/fulfilled') {
          navigate('/');
        }
      } else {
        const result = await dispatch(createCar(formData));
        if (result.type === 'cars/createCar/fulfilled') {
          navigate('/');
        }
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  // Also update the second role check
  const isAuthorized = user && (
    user.role === 'superadmin' || 
    user.role === 'admin' || 
    user.role === 'Admin' || 
    user.role === 'SuperAdmin'
  );
  
  if (!isAuthorized) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">
          <h4>Access Denied</h4>
          <p>You don't have permission to access this page. Only administrators can add or edit cars.</p>
        </Alert>
      </Container>
    );
  }

  if (isEditMode && loading) {
    return (
      <>
        <NavbarComponent />
        <Container className="mt-5">
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading car data...</p>
          </div>
        </Container>
      </>
    );
  }

  if (isEditMode && !currentCar) {
    return (
      <>
        <NavbarComponent />
        <Container className="mt-5">
          <Alert variant="danger">
            Car not found.
          </Alert>
        </Container>
      </>
    );
  }

  return (
    <>
      <NavbarComponent />
      <Container className="mt-4">
        <Row className="justify-content-center">
          <Col lg={10}>
            <div className="mb-4">
              <h2 className="text-primary fw-bold">{pageTitle}</h2>
              <p className="text-muted">
                {isEditMode 
                  ? 'Update the car information below' 
                  : 'Fill in the details to add a new car to the inventory'
                }
              </p>
            </div>
            
            {isError && (
              <Alert variant="danger" className="mb-4">
                {errorMessage}
              </Alert>
            )}
            
            <CarForm 
              initialData={currentCar}
              onSubmit={handleSubmit}
              isLoading={isSubmitting}
            />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default CarFormPage;