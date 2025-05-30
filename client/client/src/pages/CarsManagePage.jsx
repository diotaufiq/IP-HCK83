import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Table, Button, Alert, Modal, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { fetchCars } from '../redux/features/carSlice';
import NavbarComponent from '../components/Navbar';
import Swal from 'sweetalert2';

const CarsManagePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cars, isLoading, isError } = useSelector((state) => state.cars);
  const { user, token } = useSelector((state) => state.auth);
  
  // State for image update modal
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedCarId, setSelectedCarId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isUpdatingImage, setIsUpdatingImage] = useState(false);
  const [isDeletingCar, setIsDeletingCar] = useState(null);

  useEffect(() => {
    // Check if user is admin or superadmin
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

    dispatch(fetchCars());
  }, [dispatch, user, navigate]);

  const handleImageUpdate = async () => {
    if (!imageFile) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please select an image file'
      });
      return;
    }

    setIsUpdatingImage(true);
    
    try {
      const formData = new FormData();
      formData.append('image', imageFile); // UBAH dari 'imageUrl' ke 'image'

      console.log('Sending request with:', {
        carId: selectedCarId,
        hasFile: !!imageFile,
        fileName: imageFile.name
      });

      const response = await fetch(`https://gc1-phase2.diotaufiq.site/cars/${selectedCarId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
          // JANGAN set Content-Type untuk FormData
        },
        body: formData
      });

      const data = await response.json();
      console.log('Response:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update image');
      }

      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Car image updated successfully!'
      });

      // Reset modal state
      setShowImageModal(false);
      setSelectedCarId(null);
      setImageFile(null);
      
      // Refresh cars list
      dispatch(fetchCars());
    } catch (error) {
      console.error('Upload error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message
      });
    } finally {
      setIsUpdatingImage(false);
    }
  };

  const handleDeleteCar = async (carId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this car? This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      setIsDeletingCar(carId);
      
      try {
        const response = await fetch(`https://gc1-phase2.diotaufiq.site/cars/${carId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to delete car');
        }

        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Car has been deleted successfully.'
        });

        // Refresh cars list to stay on the same page
        dispatch(fetchCars());
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message
        });
      } finally {
        setIsDeletingCar(null);
      }
    }
  };

  const openImageModal = (carId) => {
    setSelectedCarId(carId);
    setShowImageModal(true);
  };

  const closeImageModal = () => {
    setShowImageModal(false);
    setSelectedCarId(null);
    setImageFile(null);
  };

  if (isLoading) {
    return (
      <>
        <NavbarComponent />
        <Container className="mt-5">
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </Container>
      </>
    );
  }

  if (isError) {
    return (
      <>
        <NavbarComponent />
        <Container className="mt-5">
          <Alert variant="danger">
            Error loading cars. Please try again.
          </Alert>
        </Container>
      </>
    );
  }

  return (
    <>
      <NavbarComponent />
      <Container className="mt-5">
        <Row>
          <Col>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2>Manage Cars</h2>
              <Button as={Link} to="/cars/add" variant="primary">
                <i className="bi bi-plus-circle me-2"></i>
                Add New Car
              </Button>
            </div>
            
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Brand</th>
                  <th>Type</th>
                  <th>Price</th>
                  <th>Condition</th>
                  <th>Year</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {cars.map((car) => (
                  <tr key={car.id}>
                    <td>{car.id}</td>
                    <td>{car.brand}</td>
                    <td>{car.Type}</td>
                    <td>Rp {car.price?.toLocaleString('id-ID')}</td>
                    <td>{car.condition}</td>
                    <td>{car.released_year}</td>
                    <td>
                      <Button 
                        as={Link} 
                        to={`/cars/edit/${car.id}`} 
                        variant="warning" 
                        size="sm" 
                        className="me-2"
                        state={{ returnTo: '/cars/manage' }}
                      >
                        <i className="bi bi-pencil"></i> Edit
                      </Button>
                      <Button 
                        variant="info" 
                        size="sm"
                        className="me-2"
                        onClick={() => openImageModal(car.id)}
                        disabled={isUpdatingImage}
                      >
                        <i className="bi bi-image"></i> Update Image
                      </Button>
                      <Button 
                        variant="danger" 
                        size="sm"
                        onClick={() => handleDeleteCar(car.id)}
                        disabled={isDeletingCar === car.id}
                      >
                        {isDeletingCar === car.id ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                            Deleting...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-trash"></i> Delete
                          </>
                        )}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            
            {cars.length === 0 && (
              <Alert variant="info" className="text-center">
                No cars found. <Link to="/cars/add">Add your first car</Link>
              </Alert>
            )}
          </Col>
        </Row>
      </Container>

      {/* Image Update Modal */}
      <Modal show={showImageModal} onHide={closeImageModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Update Car Image</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Select New Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
              />
              <Form.Text className="text-muted">
                Please select an image file (JPG, PNG, etc.)
              </Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeImageModal}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleImageUpdate}
            disabled={isUpdatingImage || !imageFile}
          >
            {isUpdatingImage ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Updating...
              </>
            ) : (
              'Update Image'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CarsManagePage;