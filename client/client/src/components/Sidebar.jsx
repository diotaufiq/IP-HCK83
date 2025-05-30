import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { filterCarsByBudget, resetFilters } from '../redux/features/carSlice';
import { Form, Button, Card, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';
import Swal from 'sweetalert2';

const Sidebar = () => {
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [preferences, setPreferences] = useState('');
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleFilter = (e) => {
    e.preventDefault();
    const min = minPrice === '' ? 0 : Number(minPrice);
    const max = maxPrice === '' ? Infinity : Number(maxPrice);
    dispatch(filterCarsByBudget({ minPrice: min, maxPrice: max }));
  };

  const handleReset = () => {
    setMinPrice('');
    setMaxPrice('');
    setPreferences('');
    dispatch(resetFilters());
  };

  const handleAIRecommendation = async () => {
    if (!token) {
      Swal.fire({
        icon: 'warning',
        title: 'Login Required',
        text: 'Please login to get AI recommendations'
      });
      return;
    }

    if (!preferences.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Preferences Required',
        text: 'Please enter your car preferences to get AI recommendations'
      });
      return;
    }

    // Validate budget values
    const min = minPrice === '' ? 0 : Number(minPrice);
    const max = maxPrice === '' ? Infinity : Number(maxPrice);
    
    if (max <= 0 || min < 0 || (max !== Infinity && max <= min)) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Budget',
        text: 'Please set a valid budget range where maximum price is greater than minimum price'
      });
      return;
    }

    setIsLoadingAI(true);
    try {
      const response = await axios.post(
        'https://gc1-phase2.diotaufiq.site/ai/recommend',
        {
          preferences: preferences,
          budget: max === Infinity ? 1000000000 : max // Use a very high number if no max is set
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
console.log(response.data); 

      if (response.data.recommendations) {
        // Create clickable car recommendations
        const recommendationsHTML = response.data.recommendations.map(car => {
          return `
            <div style="margin-bottom: 15px; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
              <strong style="color: #007bff; cursor: pointer; text-decoration: underline;" 
                      onclick="window.navigateToCarDetail(${car.id})">
                ${car.brand} ${car.type}
              </strong>
              <br>
              <span style="color: #666; font-size: 14px;">${car.reasoning}</span>
            </div>
          `;
        }).join('');

        // Add navigation function to window object
        window.navigateToCarDetail = (carId) => {
          navigate(`/cars/${carId}`);
          // Close the SweetAlert modal
          Swal.close();
        };

        Swal.fire({
          icon: 'success',
          title: 'AI Recommendations',
          html: `
            <div style="text-align: left;">
              ${response.data.message}
              <br><br>
              ${recommendationsHTML}
            </div>
          `,
          width: '600px',
          showCloseButton: true,
          showConfirmButton: false,
          allowOutsideClick: true
        });
      }
    } catch (error) {
      console.error('AI recommendation error:', error);
      
      // Handle specific error messages from backend
      const errorMessage = error.response?.data?.error || 'Failed to get AI recommendations. Please try again.';
      
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage
      });
    } finally {
      setIsLoadingAI(false);
    }
  };

  return (
    <div className="position-relative">
      {/* Decorative Background */}
      <div 
        className="position-absolute w-100 h-100" 
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          opacity: 0.1,
          borderRadius: '0.375rem',
          zIndex: 0
        }}
      ></div>
      
      <Card className="h-100 border-0 shadow-lg position-relative" style={{ zIndex: 1 }}>
        <Card.Header 
          className="text-white border-0" 
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          }}
        >
          <h5 className="mb-0 d-flex align-items-center">
            <i className="bi bi-funnel-fill me-2"></i>
            Filter Cars
          </h5>
        </Card.Header>
        
        <Card.Body className="bg-light">
          <Form onSubmit={handleFilter}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold text-primary d-flex align-items-center">
                <i className="bi bi-currency-dollar me-2"></i>
                Budget Range (Rp)
              </Form.Label>
              <div className="d-flex gap-2">
                <Form.Control
                  type="number"
                  placeholder="Min Price"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  min="0"
                  className="border-primary"
                />
                <Form.Control
                  type="number"
                  placeholder="Max Price"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  min="0"
                  className="border-primary"
                />
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold text-primary d-flex align-items-center">
                <i className="bi bi-heart-fill me-2"></i>
                Car Preferences
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Describe your ideal car (e.g., fuel efficient, family car, sports car, etc.)"
                value={preferences}
                onChange={(e) => setPreferences(e.target.value)}
                className="border-primary"
              />
            </Form.Group>

            <div className="d-grid gap-2">
              <Button 
                type="submit" 
                variant="primary"
                className="fw-bold"
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none'
                }}
              >
                <i className="bi bi-search me-2"></i>
                Apply Filter
              </Button>
              
              <Button 
                type="button" 
                variant="success" 
                onClick={handleAIRecommendation}
                disabled={isLoadingAI}
                className="fw-bold"
                style={{
                  background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                  border: 'none'
                }}
              >
                {isLoadingAI ? (
                  <>
                    <Spinner size="sm" className="me-2" />
                    Getting AI Recommendations...
                  </>
                ) : (
                  <>
                    <i className="bi bi-robot me-2"></i>
                    Get AI Recommendations
                  </>
                )}
              </Button>
              
              <Button 
                type="button" 
                variant="outline-secondary" 
                onClick={handleReset}
                className="fw-bold"
              >
                <i className="bi bi-arrow-clockwise me-2"></i>
                Reset Filters
              </Button>
            </div>
          </Form>
          
          {/* Decorative Elements */}
          <div className="mt-4 text-center">
            <div className="d-flex justify-content-center gap-3 mb-3">
              <div className="text-primary" style={{ fontSize: '1.5rem' }}>
                <i className="bi bi-car-front-fill"></i>
              </div>
              <div className="text-success" style={{ fontSize: '1.5rem' }}>
                <i className="bi bi-speedometer2"></i>
              </div>
              <div className="text-warning" style={{ fontSize: '1.5rem' }}>
                <i className="bi bi-fuel-pump-fill"></i>
              </div>
            </div>
            <small className="text-muted fst-italic">
              Find your perfect car with smart filters
            </small>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Sidebar;