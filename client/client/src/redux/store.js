import { configureStore } from '@reduxjs/toolkit';
import carReducer from './features/carSlice';
import authReducer from './features/authSlice';
import wishlistReducer from './features/wishlistSlice';
import paymentReducer from './features/paymentSlice';

export const store = configureStore({
  reducer: {
    cars: carReducer,
    auth: authReducer,
    wishlist: wishlistReducer,
    payment: paymentReducer,
  },
});