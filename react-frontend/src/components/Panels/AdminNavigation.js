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
          <ListItemText primary="Eployee" />
        </ListItem>

        <ListItem button onClick={() => setActivePanel('user')}>
          <ListItemIcon>
            <FiUserCheck />
          </ListItemIcon>
          <ListItemText primary="User" />
        </ListItem>
        <ListItem button onClick={() => setActivePanel('order-product')}>
          <ListItemIcon>
            <FiUserCheck />
          </ListItemIcon>
          <ListItemText primary="order-product" />
        </ListItem>
        <ListItem button onClick={() => setActivePanel('product-supplier')}>
          <ListItemIcon>
            <FiUserCheck />
          </ListItemIcon>
          <ListItemText primary="product-supplier" />
        </ListItem>
        <ListItem button onClick={() => setActivePanel('supplier')}>
          <ListItemIcon>
            <FiUserCheck />
          </ListItemIcon>
          <ListItemText primary="Supplier" />
        </ListItem>
        <ListItem button onClick={() => setActivePanel('image')}>
          <ListItemIcon>
            <FiUserCheck />
          </ListItemIcon>
          <ListItemText primary="Image" />
        </ListItem>
        <ListItem button onClick={() => setActivePanel('format')}>
          <ListItemIcon>
            <FiUserCheck />
          </ListItemIcon>
          <ListItemText primary="Format" />
        </ListItem>
        <ListItem button onClick={() => setActivePanel('position')}>
          <ListItemIcon>
            <FiUserCheck />
          </ListItemIcon>
          <ListItemText primary="Position" />
        </ListItem>
        <ListItem button onClick={() => setActivePanel('role')}>
          <ListItemIcon>
            <FiUserCheck />
          </ListItemIcon>
          <ListItemText primary="Role" />
        </ListItem>
        <ListItem button onClick={() => setActivePanel('log')}>
          <ListItemIcon>
            <FiUserCheck />
          </ListItemIcon>
          <ListItemText primary="Logs" />
        </ListItem>
      </List>
    </div>
  );
}

export default AdminNavigation;
