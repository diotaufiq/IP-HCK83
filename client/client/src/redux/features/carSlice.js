import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Swal from 'sweetalert2';

export const fetchCars = createAsyncThunk(
  'cars/fetchCars',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('https://gc1-phase2.diotaufiq.site/cars');
      const data = await response.json();

      if (!response.ok) {
        throw new Error('Failed to fetch cars');
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

// New action for creating car
export const createCar = createAsyncThunk(
  'cars/createCar',
  async (carData, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await fetch('https://gc1-phase2.diotaufiq.site/cars', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}`
        },
        body: JSON.stringify(carData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create car');
      }

      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Car created successfully!',
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

// New action for updating car
export const updateCar = createAsyncThunk(
  'cars/updateCar',
  async ({ carId, carData }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await fetch(`https://gc1-phase2.diotaufiq.site/cars/${carId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}`
        },
        body: JSON.stringify(carData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update car');
      }

      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Car updated successfully!',
      });

      return { carId, carData };
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

// New action for fetching categories
export const fetchCategories = createAsyncThunk(
  'cars/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('https://gc1-phase2.diotaufiq.site/categories');
      const data = await response.json();

      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const carSlice = createSlice({
  name: 'cars',
  initialState: {
    cars: [],
    filteredCars: [],
    categories: [],
    currentPage: 1,
    carsPerPage: 12,
    isLoading: false,
    isError: false,
    errorMessage: '',
    isSubmitting: false,
  },
  reducers: {
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    filterCarsByBudget: (state, action) => {
      const { minPrice, maxPrice } = action.payload;
      state.filteredCars = state.cars.filter(car => {
        return car.price >= minPrice && car.price <= maxPrice;
      });
      state.currentPage = 1;
    },
    resetFilters: (state) => {
      state.filteredCars = state.cars;
      state.currentPage = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch cars
      .addCase(fetchCars.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(fetchCars.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cars = action.payload;
        state.filteredCars = action.payload;
      })
      .addCase(fetchCars.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
      })
      // Create car
      .addCase(createCar.pending, (state) => {
        state.isSubmitting = true;
        state.isError = false;
      })
      .addCase(createCar.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.cars.push(action.payload);
        state.filteredCars.push(action.payload);
      })
      .addCase(createCar.rejected, (state, action) => {
        state.isSubmitting = false;
        state.isError = true;
        state.errorMessage = action.payload;
      })
      // Update car
      .addCase(updateCar.pending, (state) => {
        state.isSubmitting = true;
        state.isError = false;
      })
      .addCase(updateCar.fulfilled, (state, action) => {
        state.isSubmitting = false;
        const { carId, carData } = action.payload;
        const index = state.cars.findIndex(car => car.id === carId);
        if (index !== -1) {
          state.cars[index] = { ...state.cars[index], ...carData };
          state.filteredCars[index] = { ...state.filteredCars[index], ...carData };
        }
      })
      .addCase(updateCar.rejected, (state, action) => {
        state.isSubmitting = false;
        state.isError = true;
        state.errorMessage = action.payload;
      })
      // Fetch categories
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      });
  },
});

export const { setCurrentPage, filterCarsByBudget, resetFilters } = carSlice.actions;
export default carSlice.reducer;