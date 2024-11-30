import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Badge,
  Box,
  Avatar,
  Tooltip,
  Container
} from "@mui/material";
import { styled } from "@mui/system";
import { FaShoppingCart, FaStore, FaUserCircle } from "react-icons/fa";
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import InventoryIcon from '@mui/icons-material/Inventory';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import { Link, useNavigate } from 'react-router-dom';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
  boxShadow: "0 3px 5px 2px rgba(33, 203, 243, .3)"
}));

const StyledToolbar = styled(Toolbar)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "0 24px"
});

const NavLinks = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: "20px"
});

const StyledButton = styled(Button)({
  color: "#fff",
  textTransform: "none",
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    transition: "background-color 0.3s ease"
  }
});

const LogoutButton = styled(Button)({
  backgroundColor: "rgba(255, 255, 255, 0.1)",
  color: "#fff",
  textTransform: "none",
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.2)"
  }
});

const EmployeeNavBar = ({ NavBarTypeRole }) => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState(0);
  const userName = "John Employee";

  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
      setCartItems(itemCount);
    };

    updateCartCount();

    window.addEventListener('storage', updateCartCount);
    window.addEventListener('cartUpdated', updateCartCount);

    return () => {
      window.removeEventListener('storage', updateCartCount);
      window.removeEventListener('cartUpdated', updateCartCount);
    };
  }, []);

  const handleLogout = () => {
    console.log("Logging out...");
  };

  return (
    <StyledAppBar position="sticky">
      <Container maxWidth="xl">
        <StyledToolbar>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography
              variant="h6"
              component="div"
              sx={{ display: { xs: "none", sm: "block" } }}
            >
              Hello, {userName}
            </Typography>
          </Box>

          <NavLinks>
            <Tooltip title="Browse Products">
              <StyledButton
                startIcon={<FaStore />}
                aria-label="View Products"
                onClick={() => navigate('/' + NavBarTypeRole)}
              >
                Products
              </StyledButton>
            </Tooltip>

            <Tooltip title="Browse Orders">
              <StyledButton
                startIcon={<LocalOfferIcon />}
                aria-label="View Orders"
                onClick={() => navigate('/' + NavBarTypeRole + '/orders')}
              >
                My Orders
              </StyledButton>
            </Tooltip>

            <Tooltip title="Browse Orders">
              <StyledButton
                startIcon={<InventoryIcon />}
                aria-label="View Orders"
                onClick={() => navigate('/' + NavBarTypeRole + '/manage-orders')}
              >
                User`s Orders
              </StyledButton>
            </Tooltip>

            <Tooltip title="Order Products">
              <StyledButton
                startIcon={<LocalMallIcon />}
                aria-label="Order Products"
                onClick={() => navigate('/' + NavBarTypeRole + '/order-supplier')}
              >
                Order Supplier
              </StyledButton>
            </Tooltip>

            <Tooltip title="Shopping Cart">
              <IconButton
                color="inherit"
                aria-label="Shopping Cart"
                sx={{ ml: 1 }}
                onClick={() => navigate('/' + NavBarTypeRole + '/cart')}
              >
                <Badge badgeContent={cartItems} color="error">
                  <FaShoppingCart />
                </Badge>
              </IconButton>
            </Tooltip>

            <Tooltip title="Log Out">
              <Link to='/'>
                <LogoutButton
                  startIcon={<FaUserCircle />}
                  onClick={() => handleLogout()}
                  aria-label="Log Out"
                >
                  Log Out
                </LogoutButton>
              </Link>
            </Tooltip>
          </NavLinks>
        </StyledToolbar>
      </Container>
    </StyledAppBar>
  );
};

export default EmployeeNavBar;