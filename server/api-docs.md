# API Documentation

## Auth
### POST /users/register
- Register user
- Request: `{ username, email, password }`
- Response 201:
```json
{
  "id": 1,
  "username": "string",
  "email": "string",
  "role": "customer"
}
```

### POST /users/login
- Login user
- Request: `{ email, password }`
- Response 200:
```json
{
  "access_token": "jwt-token",
  "username": "string",
  "email": "string",
  "user": {
    "id": 1,
    "username": "string",
    "email": "string",
    "role": "customer"
  }
}
```

### POST /users/google-login
- Login user via Google
- Request: `{ id_token | credential }`
- Response 200:
```json
{
  "access_token": "jwt-token",
  "username": "string",
  "email": "string",
  "user": {
    "id": 1,
    "username": "string",
    "email": "string",
    "role": "customer"
  }
}
```

---

## Cars
### GET /cars
- Get all cars (public)
- Response 200: Array of car objects

### GET /cars/:carId
- Get car by ID (public)
- Response 200: Car object
- Response 404: `{ "message": "Car not found" }`

### POST /cars
- Create car (admin only)
- Request: `{ brand, type, fuel, features, price, imageUrl, CategoryId, released_year, condition }`
- Response 201: Car object

### PUT /cars/:carId
- Update car (admin only)
- Request: `{ brand, type, fuel, features, price, imageUrl, CategoryId, released_year, condition }`
- Response 200: Updated car object
- Response 404: `{ "message": "Car not found" }`

### DELETE /cars/:carId
- Delete car (admin only)
- Response 200: `{ "message": "Car deleted successfully" }`
- Response 404: `{ "message": "Car not found" }`

### PATCH /cars/:carId
- Upload car image (admin only, multipart/form-data, field: image)
- Response 200: `{ "message": "Image has been updated successfully" }`
- Response 404: `{ "message": "Car not found" }`

---

## Categories
### GET /categories
- Get all categories (public)
- Response 200: Array of category objects

### GET /categories/:categoryId
- Get category by ID (public)
- Response 200: Category object
- Response 404: `{ "message": "Category not found" }`

### POST /categories
- Create category (admin only)
- Request: `{ name }`
- Response 201: Category object

### PUT /categories/:categoryId
- Update category (admin only)
- Request: `{ name }`
- Response 200: `{ "message": "Category updated successfully" }`
- Response 404: `{ "message": "Category not found" }`

### DELETE /categories/:categoryId
- Delete category (admin only)
- Response 200: `{ "message": "Category deleted successfully" }`
- Response 404: `{ "message": "Category not found" }`

---

## Wishlist
### GET /wishlists
- Get user's wishlist (auth required)
- Response 200: Array of wishlist items

### POST /wishlists/:carId
- Add car to wishlist (auth required)
- Response 201:
```json
{
  "message": "Car added to wishlist successfully",
  "wishlist": {
    "id": 1,
    "car": {
      "id": 1,
      "brand": "string",
      "type": "string",
      "category": "string",
      "price": 1000000,
      "imageUrl": "string"
    }
  }
}
```
- Response 400/404: `{ "message": "..." }`

### DELETE /wishlists/:wishlistItemId
- Remove from wishlist (auth required)
- Response 200: `{ "message": "Wishlist item deleted successfully" }`
- Response 404: `{ "message": "Wishlist item not found" }`

---

## Payment
### POST /payment/create-checkout-session
- Create Stripe checkout session (auth required)
- Request: `{ carId }`
- Response 200:
```json
{
  "id": "stripe-session-id",
  "url": "stripe-checkout-url"
}
```

### GET /payment/success
- Handle payment success (auth required)
- Response 200:
```json
{
  "success": true,
  "message": "Payment successful",
  "data": {
    "carId": 1,
    "userId": 1,
    "paymentId": "stripe-payment-id"
  }
}
```

### GET /payment/cancel
- Handle payment cancel (auth required)
- Response 200: `{ "message": "Payment canceled" }`

### POST /payment/webhook
- Stripe webhook (public, raw body)
- Response 200: `{ "received": true }`

---

## AI
### POST /ai/recommend
- Get car recommendation (auth required)
- Request: `{ budget, preferences }`
- Response 200:
```json
{
  "message": "Berdasarkan budget Anda sebesar Rp ... dan preferensi yang diberikan, berikut adalah ... rekomendasi kendaraan terbaik untuk Anda:",
  "recommendations": [
    {
      "id": 1,
      "brand": "string",
      "type": "string",
      "reasoning": "string"
    }
  ]
}
```
- Response 400:
```json
{
  "error": "Budget harus berupa angka yang valid dan lebih besar dari 0"
}
```
- Response 200 (no match):
```json
{
  "message": "Maaf, tidak ada kendaraan yang sesuai dengan kriteria Anda.",
  "recommendations": []
}
```