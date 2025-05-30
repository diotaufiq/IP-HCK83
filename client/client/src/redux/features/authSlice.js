import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Swal from 'sweetalert2';

// Safe localStorage getter
const getUserFromStorage = () => {
  try {
    const userItem = localStorage.getItem('user');
    if (userItem && userItem !== 'undefined' && userItem !== 'null') {
      const parsedUser = JSON.parse(userItem);
      console.log('User from localStorage:', parsedUser);
      return parsedUser;
    }
    return null;
  } catch (error) {
    console.error('Error parsing user from localStorage:', error);
    localStorage.removeItem('user');
    return null;
  }
};

const user = getUserFromStorage();
const token = localStorage.getItem('access_token');

console.log('Initial user state:', user);
console.log('Initial token state:', token);

// Regular login
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await fetch('https://gc1-phase2.diotaufiq.site/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      
      console.log('Login response:', data);
      console.log('User data:', data.user);

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Save to localStorage
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));

      return data;
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: error.message,
      });
      return rejectWithValue(error.message);
    }
  }
);

// Google login - MOVED BEFORE extraReducers
export const googleLogin = createAsyncThunk(
  'auth/googleLogin',
  async (credential, { rejectWithValue }) => {
    try {
      const response = await fetch('https://gc1-phase2.diotaufiq.site/users/google-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ credential }),
      });

      const data = await response.json();
      
      console.log('Google login response:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Google login failed');
      }

      // Save to localStorage
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));

      Swal.fire({
        icon: 'success',
        title: 'Login Successful',
        text: 'Welcome back!',
        timer: 1500,
        showConfirmButton: false
      });

      return data;
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Google Login Failed',
        text: error.message,
      });
      return rejectWithValue(error.message);
    }
  }
);

// Register
export const register = createAsyncThunk(
  'auth/register',
  async ({ username, email, password }, { rejectWithValue }) => {
    try {
      const response = await fetch('https://gc1-phase2.diotaufiq.site/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      return data;
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: error.message,
      });
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: user,
    token: token,
    isLoading: false,
    isSuccess: false,
    isError: false,
    errorMessage: '',
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      state.user = null;
      state.token = null;
      state.isSuccess = false;
      state.isError = false;
      state.errorMessage = '';
    },
    resetAuthState: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.errorMessage = '';
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = '';
      })
      .addCase(login.fulfilled, (state, action) => {
        console.log('Login fulfilled payload:', action.payload);
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload.user;
        state.token = action.payload.access_token;
        console.log('Updated user state:', state.user);
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
        state.user = null;
        state.token = null;
      })
      // Google Login cases
      .addCase(googleLogin.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = '';
      })
      .addCase(googleLogin.fulfilled, (state, action) => {
        console.log('Google login fulfilled payload:', action.payload);
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload.user;
        state.token = action.payload.access_token;
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
        state.user = null;
        state.token = null;
      })
      // Register cases
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = '';
      })
      .addCase(register.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
      });
  },
});

export const { logout, resetAuthState } = authSlice.actions;
export default authSlice.reducer;