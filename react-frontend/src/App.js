import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import RegistrationForm from './components/RegistrationForm';
import MainPage from './pages/MainPage';
import SupermarketPage from './pages/SupermarketPage';
import SupermarketUserPage from './pages/SupermarketUserPage';
import SupermarketAdminPage from './pages/SupermarketAdminPage';
import UserPage from './pages/UserPage';
import CartPage from './pages/CartPage';
import AdminPage from './pages/AdminPage';
import TestOutput from './pages/TestOutput';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/user" element={<UserPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/registration" element={<RegistrationForm />} />
      <Route path="/supermarket" element={<SupermarketPage />} />
      <Route path="/user/supermarket" element={<SupermarketUserPage />} />
      <Route path="/admin/supermarket" element={<SupermarketAdminPage />} />
      <Route path="/user/cart" element={<CartPage />} />
      <Route path="/test" element={<TestOutput />}/>
    </Routes>
  );
}

export default App;