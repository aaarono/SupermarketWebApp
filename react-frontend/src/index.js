// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider, createTheme } from "@mui/material/styles";
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { EmulationProvider } from './contexts/EmulationContext';

const theme = createTheme();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <React.StrictMode>
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <EmulationProvider>
            <App />
          </EmulationProvider>
        </AuthProvider>
      </ThemeProvider>
    </React.StrictMode>
  </BrowserRouter>
);
