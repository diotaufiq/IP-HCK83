import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Badge } from 'react-bootstrap';
import { formatToRupiah } from '../utils/formatter';

const CarCard = ({ car }) => {
  const navigate = useNavigate();

  const handleImageClick = () => {
    navigate(`/cars/${car.id}`);
  };

  // Check if condition is 'gift' for yellow text styling
  const isGift = car.condition?.toLowerCase() === 'gift';
  const textColorClass = isGift ? 'text-warning' : '';

  return (
    <Card className="h-100 shadow-sm hover-card">
      <div 
        onClick={handleImageClick}
        style={{ cursor: 'pointer' }}
        className="position-relative overflow-hidden"
      >
        <Card.Img 
          variant="top" 
          src={car.imageUrl || 'https://placehold.co/300x200/cccccc/666666?text=No+Image'} 
          alt={car.brand}
          style={{ 
            height: '200px', 
            objectFit: 'cover',
            transition: 'transform 0.3s ease'
          }}
          className="hover-zoom"
          onError={(e) => {
            e.target.src = 'https://placehold.co/300x200/cccccc/666666?text=No+Image';
          }}
        />
        <div className="position-absolute top-0 end-0 m-2">
          <Badge bg={isGift ? 'warning' : 'primary'} pill>{car.condition}</Badge>
        </div>
      </div>
      <Card.Body className="d-flex flex-column">
        <div className="mb-2">
          <Card.Title className={`mb-1 fs-5 ${textColorClass}`}>{car.brand}</Card.Title>
          <Card.Subtitle className={`mb-2 ${isGift ? 'text-warning' : 'text-muted'}`}>{car.Type}</Card.Subtitle>
        </div>
        <Card.Text className={`small text-truncate mb-2 ${textColorClass}`}>
          {car.fuel} • {car.released_year}
        </Card.Text>
        <div className="mt-auto">
          <div className="d-flex justify-content-center align-items-center">
            <span className={`fw-bold fs-5 ${isGift ? 'text-warning' : 'text-primary'}`}>{formatToRupiah(car.price)}</span>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default CarCard;