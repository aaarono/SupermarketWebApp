import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Tooltip,
  Container
} from "@mui/material";
import { styled } from "@mui/system";
import { FaShoppingCart, FaStore, FaUserCircle } from "react-icons/fa";
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

const UserNavBar = () => {
  const navigate = useNavigate();

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
              Welcome to YourMarket
            </Typography>
          </Box>

          <NavLinks>
            <Tooltip title="Browse Products">
              <StyledButton
                startIcon={<FaStore />}
                aria-label="View Products"
                onClick={() => navigate('/')}
              >
                Products
              </StyledButton>
            </Tooltip>

            <Tooltip title="LogIn">
              <LogoutButton
                onClick={() => navigate('/login')}
                aria-label="LogIn"
              >
                Log In
              </LogoutButton>
            </Tooltip>

            <Tooltip title="Register">
              <LogoutButton
                onClick={() => navigate('/registration')}
                aria-label="Register"
              >
                Register
              </LogoutButton>
            </Tooltip>
          </NavLinks>
        </StyledToolbar>
      </Container>
    </StyledAppBar>
  );
};

export default UserNavBar;