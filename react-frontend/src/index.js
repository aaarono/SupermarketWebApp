import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider, createTheme } from "@mui/material/styles";
import './index.css';
import App from './App';
// all imports just for testing components
// need to be deleted after
import ProductList from './components/ProductList';
import RegistrationForm from './components/RegistrationForm';
import LoginForm from './components/LoginForm';
import LoggedUserNavBar from './components/LoggedUserNavBar';
import UserNavBar from './components/UserNavBar';
import { BrowserRouter } from 'react-router-dom';

const theme = createTheme();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <React.StrictMode>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </React.StrictMode>
  </BrowserRouter>
);