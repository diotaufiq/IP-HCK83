import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Modal, Button, ListGroup, Image } from 'react-bootstrap';
import { fetchWishlist, removeFromWishlist } from '../redux/features/wishlistSlice';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const WishlistModal = ({ show, handleClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, isLoading } = useSelector((state) => state.wishlist);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (show && token) {
      dispatch(fetchWishlist());
    }
  }, [show, dispatch, token]);

  const handleRemoveItem = async (itemId) => {
    // Enhanced debugging
    console.log('Full items array:', items);
    console.log('Attempting to remove item with ID:', itemId);
    console.log('Type of itemId:', typeof itemId);
    
    if (!itemId || itemId === undefined || itemId === null) {
      console.error('Item ID is invalid:', itemId);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Cannot remove item: Invalid item ID',
      });
      return;
    }

    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to remove this item from your wishlist?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, remove it!'
      });

      if (result.isConfirmed) {
        await dispatch(removeFromWishlist(itemId));
        // Refresh the wishlist after successful removal
        dispatch(fetchWishlist());
      }
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const handleImageClick = (carId) => {
    navigate(`/cars/${carId}`);
    handleClose();
  };

  return (
    <Modal 
      show={show} 
      onHide={handleClose} 
      centered
      aria-labelledby="wishlist-modal-title"
      aria-describedby="wishlist-modal-body"
    >
      <Modal.Header closeButton style={{ background: 'linear-gradient(to right, #001f3f, #0074D9)', color: 'white' }}>
        <Modal.Title id="wishlist-modal-title">Your Wishlist</Modal.Title>
      </Modal.Header>
      <Modal.Body id="wishlist-modal-body">
        {isLoading ? (
          <div className="text-center py-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-4">
            <p className="mb-0">Your wishlist is empty</p>
          </div>
        ) : (
          <ListGroup variant="flush">
            {items.map((item) => (
              <ListGroup.Item key={item.id} className="py-3">
                <div className="d-flex align-items-center">
                  <Image 
                    src={item.Car?.imageUrl || 'https://placehold.co/50x50/cccccc/666666?text=No+Image'} 
                    width={50} 
                    height={50} 
                    className="me-3 object-fit-cover"
                    alt={`${item.Car?.brand || 'Car'} ${item.Car?.Type || ''}`}
                    style={{ cursor: 'pointer' }}
                    onClick={() => item.Car?.id && handleImageClick(item.Car.id)}
                    onError={(e) => {
                      e.target.src = 'https://placehold.co/50x50/cccccc/666666?text=No+Image';
                    }}
                  />
                  <div 
                    className="flex-grow-1" 
                    style={{ cursor: 'pointer' }} 
                    onClick={() => item.Car?.id && handleImageClick(item.Car.id)}
                  >
                    <h6 className="mb-0">{item.Car?.brand || 'Unknown Brand'}</h6>
                    <small className="text-muted">
                      {item.Car?.Type || 'Unknown Type'} • {item.Car?.released_year || 'N/A'}
                    </small>
                    <div className="text-primary fw-bold">
                      Rp {item.Car?.price ? item.Car.price.toLocaleString('id-ID') : '0'}
                    </div>
                  </div>
                  <div className="d-flex align-items-center">
                    <Button 
                      variant="outline-danger" 
                      size="sm"
                      onClick={() => {
                        console.log('Full item object:', item);
                        // Use CarId as fallback since we know UserId from auth
                        const itemIdentifier = item.id || item.CarId;
                        console.log('Using identifier:', itemIdentifier);
                        if (itemIdentifier) {
                          handleRemoveItem(itemIdentifier);
                        } else {
                          console.error('No valid identifier found:', item);
                          Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'Cannot remove item: No valid identifier found',
                          });
                        }
                      }}
                      aria-label={`Remove ${item.Car?.brand || 'item'} ${item.Car?.Type || ''} from wishlist`}
                      disabled={isLoading}
                    >
                      <i className="bi bi-trash"></i>
                    </Button>
                  </div>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default WishlistModal;