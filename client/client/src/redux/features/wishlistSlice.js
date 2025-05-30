import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Swal from 'sweetalert2';

export const fetchWishlist = createAsyncThunk(
  'wishlist/fetchWishlist',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      if (!auth.token) return [];

      const response = await fetch('https://gc1-phase2.diotaufiq.site/wishlists', {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });

      const data = await response.json();
      console.log('Fetched wishlist data:', data); // Add this line

      if (!response.ok) {
        throw new Error('Failed to fetch wishlist');
      }

      return data;
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message,
      });
      return rejectWithValue(error.message);
    }
  }
);

export const addToWishlist = createAsyncThunk(
  'wishlist/addToWishlist',
  async (carId, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      if (!auth.token) {
        throw new Error('You must be logged in to add to wishlist');
      }

      const response = await fetch(`https://gc1-phase2.diotaufiq.site/wishlists/${carId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to add to wishlist');
      }

      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Added to wishlist! Redirecting to home...',
        timer: 1500,
        showConfirmButton: false
      }).then(() => {
        // Redirect to home page after the alert
        window.location.href = '/';
      });

      return data;
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message,
      });
      return rejectWithValue(error.message);
    }
  }
);

export const removeFromWishlist = createAsyncThunk(
  'wishlist/removeFromWishlist',
  async (wishlistItemId, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      if (!auth.token) {
        throw new Error('You must be logged in to remove from wishlist');
      }

      const response = await fetch(`https://gc1-phase2.diotaufiq.site/wishlists/${wishlistItemId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to remove from wishlist');
      }

      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Removed from wishlist!',
      });

      return wishlistItemId;
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message,
      });
      return rejectWithValue(error.message);
    }
  }
);

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: [],
    isLoading: false,
    isError: false,
    errorMessage: '',
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(removeFromWishlist.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = state.items.filter(item => item.id !== action.payload);
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
      });
  },
});

export default wishlistSlice.reducer;