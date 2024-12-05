// src/components/Panels/AdminNavigation.js

import React from 'react';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material';
import {
  FiUsers,
  FiPackage,
  FiShoppingCart,
  FiMapPin,
  FiGrid,
  FiHome,
  FiCreditCard,
  FiUserCheck,
} from 'react-icons/fi';

function AdminNavigation({ setActivePanel }) {
  return (
    <div style={{ width: '200px' }}>
      <Toolbar>
        <Typography variant="h6" noWrap>
          Admin Panel
        </Typography>
      </Toolbar>
      <List>
        <ListItem button onClick={() => setActivePanel('product')}>
          <ListItemIcon>
            <FiPackage />
          </ListItemIcon>
          <ListItemText primary="Products" />
        </ListItem>
        <ListItem button onClick={() => setActivePanel('order')}>
          <ListItemIcon>
            <FiShoppingCart />
          </ListItemIcon>
          <ListItemText primary="Orders" />
        </ListItem>
        <ListItem button onClick={() => setActivePanel('address')}>
          <ListItemIcon>
            <FiMapPin />
          </ListItemIcon>
          <ListItemText primary="Addresses" />
        </ListItem>
        <ListItem button onClick={() => setActivePanel('category')}>
          <ListItemIcon>
            <FiGrid />
          </ListItemIcon>
          <ListItemText primary="Categories" />
        </ListItem>
        <ListItem button onClick={() => setActivePanel('warehouse')}>
          <ListItemIcon>
            <FiHome />
          </ListItemIcon>
          <ListItemText primary="Warehouses" />
        </ListItem>
        <ListItem button onClick={() => setActivePanel('supermarket')}>
          <ListItemIcon>
            <FiShoppingCart />
          </ListItemIcon>
          <ListItemText primary="Supermarkets" />
        </ListItem>
        <ListItem button onClick={() => setActivePanel('payment')}>
          <ListItemIcon>
            <FiCreditCard />
          </ListItemIcon>
          <ListItemText primary="Payments" />
        </ListItem>
        <ListItem button onClick={() => setActivePanel('card')}>
          <ListItemIcon>
            <FiCreditCard />
          </ListItemIcon>
          <ListItemText primary="Card" />
        </ListItem>
        <ListItem button onClick={() => setActivePanel('cash')}>
          <ListItemIcon>
            <FiCreditCard />
          </ListItemIcon>
          <ListItemText primary="Cash" />
        </ListItem>
        <ListItem button onClick={() => setActivePanel('employee')}>
          <ListItemIcon>
            <FiUserCheck />
          </ListItemIcon>
          <ListItemText primary="Employees" />
        </ListItem>
      </List>
    </div>
  );
}

export default AdminNavigation;
