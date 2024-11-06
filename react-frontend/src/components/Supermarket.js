import React from "react";
import { Box, Container, Typography, Paper, styled, Grid } from "@mui/material";
import { FaStore, FaMapMarkerAlt, FaPhone, FaEnvelope, FaShoppingCart } from "react-icons/fa";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: "2rem",
  borderRadius: "15px",
  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
  background: "#ffffff",
  transition: "transform 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-5px)"
  }
}));

const InfoBox = styled(Box)(({ theme }) => ({
  padding: "1.5rem",
  borderRadius: "10px",
  backgroundColor: "#f5f5f5",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "1rem",
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: "#e3f2fd",
    transform: "scale(1.02)"
  }
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  color: "#2196f3",
  fontSize: "2rem",
  display: "flex",
  alignItems: "center",
  marginBottom: "0.5rem"
}));

const StyledText = styled(Typography)(({ theme }) => ({
  color: "#555",
  fontSize: "1rem",
  textAlign: "center",
  fontWeight: "500"
}));

const LargeIconWrapper = styled(Box)(({ theme }) => ({
  color: "#2196f3",
  fontSize: "4rem",
  display: "flex",
  justifyContent: "center",
  marginBottom: "2rem"
}));

const SupermarketDescription = () => {
  const supermarketInfo = {
    name: "Fresh Mart Supermarket",
    address: "123 Shopping Street, Market District",
    city: "Metro City, ST 12345",
    phone: "+1 (555) 123-4567",
    email: "info@freshmart.com"
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography
        variant="h3"
        gutterBottom
        sx={{
          textAlign: "center",
          color: "#1976d2",
          fontWeight: "bold",
          mb: 4
        }}
        role="heading"
        aria-level="1"
      >
        {supermarketInfo.name}
      </Typography>

      <StyledPaper elevation={3}>
        <LargeIconWrapper>
          <FaShoppingCart aria-hidden="true" />
        </LargeIconWrapper>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <InfoBox>
              <IconWrapper>
                <FaStore aria-hidden="true" />
              </IconWrapper>
              <StyledText>
                Welcome to {supermarketInfo.name}, your one-stop shop for fresh groceries and daily essentials.
              </StyledText>
            </InfoBox>
          </Grid>

          <Grid item xs={12} md={6}>
            <InfoBox>
              <IconWrapper>
                <FaMapMarkerAlt aria-hidden="true" />
              </IconWrapper>
              <StyledText>
                {supermarketInfo.address}
                <br />
                {supermarketInfo.city}
              </StyledText>
            </InfoBox>
          </Grid>

          <Grid item xs={12} md={6}>
            <InfoBox>
              <IconWrapper>
                <FaPhone aria-hidden="true" />
              </IconWrapper>
              <StyledText>{supermarketInfo.phone}</StyledText>
            </InfoBox>
          </Grid>

          <Grid item xs={12} md={6}>
            <InfoBox>
              <IconWrapper>
                <FaEnvelope aria-hidden="true" />
              </IconWrapper>
              <StyledText>{supermarketInfo.email}</StyledText>
            </InfoBox>
          </Grid>
        </Grid>
      </StyledPaper>
    </Container>
  );
};

export default SupermarketDescription;