import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginForm from './components/Authorization/LoginForm';
import RegistrationForm from './components/Authorization/RegistrationForm';
import MainPage from './pages/MainPage';
import CartPage from './pages/CartPage';
import TestOutput from './pages/TestOutput';
import { textAlign } from '@mui/system';
import './App.css';
import OrdersPage from './pages/OrdersPage';

function App() {

  const USER_ROLE = {
    PUBLIC: 'public',
    USER: 'user',
    EMPLOYEE: 'employee',
    ADMIN: 'admin',
  }
  const CURRENT_USER_ROLE = USER_ROLE.USER;

  return (
    <Routes>
      <Route path="/" element={<PublicElement> <MainPage MainPageUserRole = { USER_ROLE.PUBLIC } /> </PublicElement>} />
      <Route path="/user" element={<UserElement> <MainPage MainPageUserRole = { USER_ROLE.USER } /> </UserElement>} />
      <Route path="/employee" element={<EmployeeElement> <MainPage MainPageUserRole = { USER_ROLE.EMPLOYEE } /> </EmployeeElement>} />
      <Route path="/admin" element={<AdminElement> <MainPage MainPageUserRole = { USER_ROLE.ADMIN } /> </AdminElement>} />

      <Route path="/user/cart" element={<UserElement> <CartPage CartUserRole = { CURRENT_USER_ROLE } /> </UserElement>} />
      <Route path="/employee/cart" element={<EmployeeElement> <CartPage CartUserRole = { CURRENT_USER_ROLE } /> </EmployeeElement>} />
      <Route path="/admin/cart" element={<AdminElement> <CartPage CartUserRole = { CURRENT_USER_ROLE } /> </AdminElement>} />

      <Route path="/user/orders" element={<UserElement> <OrdersPage OrdersUserRole = { CURRENT_USER_ROLE } /> </UserElement>} />
      <Route path="/employee/orders" element={<EmployeeElement> <OrdersPage OrdersUserRole = { CURRENT_USER_ROLE } /> </EmployeeElement>} />
      <Route path="/admin/orders" element={<AdminElement> <OrdersPage OrdersUserRole = { CURRENT_USER_ROLE } /> </AdminElement>} />

      <Route path="/login" element={<PublicElement> <LoginForm LoginUserRole = { CURRENT_USER_ROLE } /> </PublicElement>} />
      <Route path="/registration" element={<PublicElement> <RegistrationForm /> </PublicElement>} />

      <Route path="/test" element={<TestOutput />}/>
      <Route path="/*" element={<h1 className='pages-error'>Page Not Found</h1>}/>
    </Routes>
  );

  function PublicElement({ children }) {
    return <>{ children }</>;
  }
  function UserElement({ children }) {
    if (CURRENT_USER_ROLE === USER_ROLE.USER || CURRENT_USER_ROLE === USER_ROLE.EMPLOYEE || CURRENT_USER_ROLE === USER_ROLE.ADMIN) {
      return <>{ children }</>;
    } else {
      return <h1 className='pages-error'>Permissions Denied</h1>;
    }
  }
  function EmployeeElement({ children }) {
    if (CURRENT_USER_ROLE === USER_ROLE.EMPLOYEE || CURRENT_USER_ROLE === USER_ROLE.ADMIN) {
      return <>{ children }</>;
    } else {
      return <h1 className='pages-error'>Permissions Denied</h1>;
    }
  }
  function AdminElement({ children }) {
    if (CURRENT_USER_ROLE === USER_ROLE.ADMIN) {
      return <>{ children }</>;
    } else {
      return <h1 className='pages-error'>Permissions Denied</h1>;
    }
  }
}

export default App;