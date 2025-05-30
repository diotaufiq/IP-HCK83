import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import HomePage from './pages/HomePage';
import CarDetailPage from './pages/CarDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CarFormPage from './pages/CarFormPage';
import CarsManagePage from './pages/CarsManagePage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import AboutPage from './pages/AboutPage';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/cars/:carId" element={<CarDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/cars/add" element={<CarFormPage />} />
            <Route path="/cars/edit/:carId" element={<CarFormPage />} />
            <Route path="/cars/manage" element={<CarsManagePage />} />
            <Route path="/payment/success" element={<PaymentSuccessPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}
export default App