import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Card, Alert, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from '../../../src/redux/features/carSlice';

const CarForm = ({ initialData = null, onSubmit, isLoading = false }) => {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.cars);
  
  const [formData, setFormData] = useState({
    brand: '',
    Type: '',
    fuel: '',
    features: '',
    price: '',
    imageUrl: '',
    CategoryId: '',
    released_year: '',
    condition: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        brand: initialData.brand || '',
        Type: initialData.Type || '',
        fuel: initialData.fuel || '',
        features: Array.isArray(initialData.features) 
          ? initialData.features.join(', ') 
          : initialData.features || '',
        price: initialData.price || '',
        imageUrl: initialData.imageUrl || '',
        CategoryId: initialData.CategoryId || '',
        released_year: initialData.released_year || '',
        condition: initialData.condition || ''
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.brand.trim()) newErrors.brand = 'Brand is required';
    if (!formData.Type.trim()) newErrors.Type = 'Type is required';
    if (!formData.fuel.trim()) newErrors.fuel = 'Fuel type is required';
    if (!formData.features.trim()) newErrors.features = 'Features are required';
    if (!formData.price || formData.price <= 0) newErrors.price = 'Valid price is required';
    if (!formData.CategoryId) newErrors.CategoryId = 'Category is required';
    if (!formData.released_year.trim()) newErrors.released_year = 'Released year is required';
    if (!formData.condition.trim()) newErrors.condition = 'Condition is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const submitData = {
      ...formData,
      features: formData.features.split(',').map(feature => feature.trim()),
      price: parseInt(formData.price),
      CategoryId: parseInt(formData.CategoryId)
    };

    onSubmit(submitData);
  };

  const fuelOptions = ['Gasoline', 'Diesel', 'Electric', 'Hybrid'];
  const conditionOptions = ['New', 'Used', 'Certified Pre-Owned'];

  return (
    <Card className="shadow-sm">
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Brand *</Form.Label>
                <Form.Control
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  placeholder="Enter car brand"
                  isInvalid={!!errors.brand}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.brand}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Type *</Form.Label>
                <Form.Control
                  type="text"
                  name="Type"
                  value={formData.Type}
                  onChange={handleChange}
                  placeholder="Enter car type/model"
                  isInvalid={!!errors.Type}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.Type}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Fuel Type *</Form.Label>
                <Form.Select
                  name="fuel"
                  value={formData.fuel}
                  onChange={handleChange}
                  isInvalid={!!errors.fuel}
                >
                  <option value="">Select fuel type</option>
                  {fuelOptions.map(fuel => (
                    <option key={fuel} value={fuel}>{fuel}</option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.fuel}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Condition *</Form.Label>
                <Form.Select
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  isInvalid={!!errors.condition}
                >
                  <option value="">Select condition</option>
                  {conditionOptions.map(condition => (
                    <option key={condition} value={condition}>{condition}</option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.condition}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Price *</Form.Label>
                <Form.Control
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="Enter price"
                  min="0"
                  isInvalid={!!errors.price}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.price}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Released Year *</Form.Label>
                <Form.Control
                  type="text"
                  name="released_year"
                  value={formData.released_year}
                  onChange={handleChange}
                  placeholder="Enter released year"
                  isInvalid={!!errors.released_year}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.released_year}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Category *</Form.Label>
                <Form.Select
                  name="CategoryId"
                  value={formData.CategoryId}
                  onChange={handleChange}
                  isInvalid={!!errors.CategoryId}
                >
                  <option value="">Select category</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.CategoryId}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Image URL</Form.Label>
                <Form.Control
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  placeholder="Enter image URL (optional)"
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-4">
            <Form.Label>Features *</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="features"
              value={formData.features}
              onChange={handleChange}
              placeholder="Enter features separated by commas (e.g., ABS, Airbags, GPS)"
              isInvalid={!!errors.features}
            />
            <Form.Text className="text-muted">
              Separate multiple features with commas
            </Form.Text>
            <Form.Control.Feedback type="invalid">
              {errors.features}
            </Form.Control.Feedback>
          </Form.Group>

          <div className="d-flex gap-2">
            <Button 
              type="submit" 
              variant="primary" 
              disabled={isLoading}
              className="px-4"
            >
              {isLoading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  {initialData ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                initialData ? 'Update Car' : 'Create Car'
              )}
            </Button>
            
            <Button 
              type="button" 
              variant="outline-secondary"
              onClick={() => window.history.back()}
            >
              Cancel
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default CarForm;