import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Swal from 'sweetalert2';

export const createCheckoutSession = createAsyncThunk(
  'payment/createCheckoutSession',
  async (carId, { rejectWithValue, getState, dispatch }) => {
    try {
      console.log('createCheckoutSession called with carId:', carId, 'Type:', typeof carId);
      const { auth, wishlist } = getState();
      if (!auth.token) {
        throw new Error('You must be logged in to make a purchase');
      }

      console.log('Sending request with body:', { carId });
      const response = await fetch('https://gc1-phase2.diotaufiq.site/payment/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify({ carId }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle specific error cases
        if (response.status === 400 && data.message.includes('exceeds Stripe\'s maximum limit')) {
          Swal.fire({
            icon: 'warning',
            title: 'Payment Limit Exceeded',
            text: data.message,
            footer: 'Please contact our sales team for alternative payment options.'
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Payment Error',
            text: data.message || 'Failed to create checkout session',
          });
        }
        throw new Error(data.message || 'Failed to create checkout session');
      }

      // Find and remove the item from wishlist before redirecting
      const wishlistItem = wishlist.items.find(item => item.Car.id === carId);
      if (wishlistItem) {
        // Import removeFromWishlist action
        const { removeFromWishlist } = await import('./wishlistSlice');
        dispatch(removeFromWishlist(wishlistItem.id));
      }

      // Redirect to Stripe checkout
      window.location.href = data.url;
      
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const paymentSlice = createSlice({
  name: 'payment',
  initialState: {
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createCheckoutSession.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createCheckoutSession.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(createCheckoutSession.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default paymentSlice.reducer;