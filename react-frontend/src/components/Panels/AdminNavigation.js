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
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import KeyboardOptionKeyIcon from '@mui/icons-material/KeyboardOptionKey';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import MergeTypeOutlinedIcon from '@mui/icons-material/MergeTypeOutlined';
import PostAddOutlinedIcon from '@mui/icons-material/PostAddOutlined';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import PestControlOutlinedIcon from '@mui/icons-material/PestControlOutlined';

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

        <ListItem button onClick={() => setActivePanel('user')}>
          <ListItemIcon>
            <PeopleOutlineIcon />
          </ListItemIcon>
          <ListItemText primary="Users" />
        </ListItem>
        <ListItem button onClick={() => setActivePanel('order-product')}>
          <ListItemIcon>
            <KeyboardOptionKeyIcon />
          </ListItemIcon>
          <ListItemText primary="order-product" />
        </ListItem>
        <ListItem button onClick={() => setActivePanel('product-supplier')}>
          <ListItemIcon>
            <KeyboardOptionKeyIcon />
          </ListItemIcon>
          <ListItemText primary="product-supplier" />
        </ListItem>
        <ListItem button onClick={() => setActivePanel('supplier')}>
          <ListItemIcon>
            <LocalShippingOutlinedIcon />
          </ListItemIcon>
          <ListItemText primary="Suppliers" />
        </ListItem>
        <ListItem button onClick={() => setActivePanel('image')}>
          <ListItemIcon>
            <ImageOutlinedIcon />
          </ListItemIcon>
          <ListItemText primary="Images" />
        </ListItem>
        <ListItem button onClick={() => setActivePanel('format')}>
          <ListItemIcon>
            <MergeTypeOutlinedIcon />
          </ListItemIcon>
          <ListItemText primary="Formats" />
        </ListItem>
        <ListItem button onClick={() => setActivePanel('position')}>
          <ListItemIcon>
            <PostAddOutlinedIcon />
          </ListItemIcon>
          <ListItemText primary="Positions" />
        </ListItem>
        <ListItem button onClick={() => setActivePanel('role')}>
          <ListItemIcon>
            <AdminPanelSettingsOutlinedIcon />
          </ListItemIcon>
          <ListItemText primary="Roles" />
        </ListItem>
        <ListItem button onClick={() => setActivePanel('statuses')}>
          <ListItemIcon>
            <AdminPanelSettingsOutlinedIcon />
          </ListItemIcon>
          <ListItemText primary="Statuses" />
        </ListItem>
        <ListItem button onClick={() => setActivePanel('log')}>
          <ListItemIcon>
            <PestControlOutlinedIcon />
          </ListItemIcon>
          <ListItemText primary="Logs" />
        </ListItem>
        <ListItem button onClick={() => setActivePanel('sys_kat')}>
          <ListItemIcon>
            <PestControlOutlinedIcon />
          </ListItemIcon>
          <ListItemText primary="Sys. Catalog" />
        </ListItem>
      </List>
    </div>
  );
}

export default AdminNavigation;
