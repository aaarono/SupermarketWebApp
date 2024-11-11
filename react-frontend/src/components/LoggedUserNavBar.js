import React, { useState } from "react";
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
import { BiStore } from "react-icons/bi";
import { MdKeyboardArrowDown } from "react-icons/md";
import { useNavigate } from 'react-router-dom';

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

const LoggedUserNavBar = () => {
  const navigate = useNavigate();
  const [supermarketAnchor, setSupermarketAnchor] = useState(null);
  const [cartItems] = useState(3); // Dummy cart items count
  const userName = "John Doe"; // Dummy user name

  const supermarkets = [
    "Walmart Supermarket",
    "Target Superstore",
    "Costco Wholesale",
    "Kroger Marketplace"
  ];

  const handleSupermarketClick = (event) => {
    setSupermarketAnchor(event.currentTarget);
  };

  const handleSupermarketClose = () => {
    setSupermarketAnchor(null);
  };

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
                onClick={() => navigate('/user')}
              >
                Products
              </StyledButton>
            </Tooltip>

            <Tooltip title="Select Supermarket">
              <StyledButton
                startIcon={<BiStore />}
                endIcon={<MdKeyboardArrowDown />}
                onClick={handleSupermarketClick}
                aria-controls="supermarket-menu"
                aria-haspopup="true"
                aria-label="Select Supermarket"
              >
                Supermarkets
              </StyledButton>
            </Tooltip>

            <Menu
              id="supermarket-menu"
              anchorEl={supermarketAnchor}
              open={Boolean(supermarketAnchor)}
              onClose={handleSupermarketClose}
              MenuListProps={{
                "aria-labelledby": "supermarket-button"
              }}
            >
              {supermarkets.map((market) => (
                <MenuItem
                  key={market}
                  onClick={() => navigate('/user/supermarket')}
                  sx={{ minWidth: "200px" }}
                >
                  {market}
                </MenuItem>
              ))}
            </Menu>

            <Tooltip title="Shopping Cart">
              <IconButton
                color="inherit"
                aria-label="Shopping Cart"
                sx={{ ml: 1 }}
                onClick={() => navigate('/user/cart')}
              >
                <Badge badgeContent={cartItems} color="error">
                  <FaShoppingCart />
                </Badge>
              </IconButton>
            </Tooltip>

            <Tooltip title="Log Out">
              <LogoutButton
                startIcon={<FaUserCircle />}
                onClick={() => navigate('/')}
                aria-label="Log Out"
              >
                Log Out
              </LogoutButton>
            </Tooltip>
          </NavLinks>
        </StyledToolbar>
      </Container>
    </StyledAppBar>
  );
};

export default LoggedUserNavBar;