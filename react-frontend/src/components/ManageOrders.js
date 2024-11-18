import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Collapse,
  Avatar,
  Paper,
  Button,
  Divider,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from "@mui/material";
import { styled } from "@mui/system";
import { FaAngleDown, FaAngleUp, FaTruck, FaMapMarkerAlt, FaPhone, FaEnvelope, FaUser } from "react-icons/fa";

const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: "1.5rem",
  transition: "all 0.3s ease",
  border: `1px solid ${theme.palette.grey[200]}`,
  "&:hover": {
    transform: "translateY(-3px)",
    boxShadow: "0 12px 20px rgba(0,0,0,0.1)"
  }
}));

const ProductImage = styled(Avatar)(({ theme }) => ({
  width: 120,
  height: 120,
  borderRadius: "12px",
  boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
}));

const InfoText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  marginBottom: 2,
  fontSize: "0.9rem",
  display: "flex",
  alignItems: "center",
  gap: "8px"
}));

const TotalCostBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  padding: "8px 16px",
  borderRadius: "8px",
  display: "inline-flex",
  alignItems: "center",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
}));

const StatusChip = styled(Chip)(({ theme, status }) => ({
  fontSize: "0.9rem",
  padding: "4px 8px",
  backgroundColor:
    status === "Delivered"
      ? theme.palette.success.light
      : status === "Processed"
      ? theme.palette.info.light
      : theme.palette.warning.light,
  color:
    status === "Delivered"
      ? theme.palette.success.dark
      : status === "Processed"
      ? theme.palette.info.dark
      : theme.palette.warning.dark,
  "& .MuiChip-label": {
    fontWeight: 600
  }
}));

const ManageOrders = () => {
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [orders, setOrders] = useState([
    {
      id: 1,
      userEmail: "john.doe@example.com",
      products: [
        {
          name: "Wireless Headphones",
          price: 129.99,
          count: 2,
          image: "images.unsplash.com/photo-1505740420928-5e560c06d30e"
        },
        {
          name: "Smart Watch",
          price: 199.99,
          count: 1,
          image: "images.unsplash.com/photo-1523275335684-37898b6baf30"
        }
      ],
      date: "2024-01-15",
      status: "In Transit",
      deliveryInfo: {
        firstName: "John",
        lastName: "Doe",
        phone: "+1 234 567 8900",
        email: "john.doe@example.com",
        streetAddress: "123 Main Street",
        streetNumber: "45A",
        postalCode: "10001",
        city: "New York"
      }
    },
    {
      id: 2,
      userEmail: "jane.smith@example.com",
      products: [
        {
          name: "Gaming Mouse",
          price: 79.99,
          count: 1,
          image: "images.unsplash.com/photo-1527864550417-7fd91fc51a46"
        }
      ],
      date: "2024-01-10",
      status: "Processed",
      deliveryInfo: {
        firstName: "Jane",
        lastName: "Smith",
        phone: "+1 234 567 8901",
        email: "jane.smith@example.com",
        streetAddress: "456 Oak Avenue",
        streetNumber: "12B",
        postalCode: "90210",
        city: "Los Angeles"
      }
    }
  ]);

  const [selectedStatus, setSelectedStatus] = useState({});

  const handleExpand = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const calculateOrderTotal = (products) => {
    return products.reduce((total, product) => total + product.price * product.count, 0);
  };

  const handleStatusChange = (orderId, newStatus) => {
    setSelectedStatus(prev => ({
      ...prev,
      [orderId]: newStatus
    }));
  };

  const handleSubmitStatus = (orderId) => {
    if (selectedStatus[orderId]) {
      setOrders(orders.map(order =>
        order.id === orderId ? { ...order, status: selectedStatus[orderId] } : order
      ));
      setSelectedStatus(prev => {
        const newState = { ...prev };
        delete newState[orderId];
        return newState;
      });
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 5, px: { xs: 2, md: 3 }, minHeight: "100vh" }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4, fontWeight: 600 }}>
        Manage Orders
      </Typography>

      <Paper elevation={0} sx={{ p: { xs: 2, md: 4 }, bgcolor: "background.paper", borderRadius: "16px" }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 4, fontWeight: 500 }}>
          All Orders
        </Typography>
        {orders.map((order) => (
          <StyledCard key={order.id}>
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={3}>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                      Order #{order.id}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        maxWidth: "200px"
                      }}
                    >
                      {order.userEmail}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={3}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <FormControl size="small" sx={{ minWidth: 150 }}>
                      <InputLabel>Status</InputLabel>
                      <Select
                        value={selectedStatus[order.id] || order.status}
                        label="Status"
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      >
                        <MenuItem value="In Transit">In Transit</MenuItem>
                        <MenuItem value="Processed">Processed</MenuItem>
                        <MenuItem value="Delivered">Delivered</MenuItem>
                      </Select>
                    </FormControl>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => handleSubmitStatus(order.id)}
                      disabled={!selectedStatus[order.id]}
                      sx={{ minWidth: "40px", height: "40px" }}
                    >
                      OK
                    </Button>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={2}>
                  <Typography variant="body2" color="text.secondary">
                    {order.date}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 2 }}>
                    <TotalCostBox>
                      <Typography variant="subtitle2" color="common.white">
                        ${calculateOrderTotal(order.products).toFixed(2)}
                      </Typography>
                    </TotalCostBox>
                    <Button
                      variant="outlined"
                      size="small"
                      endIcon={expandedOrder === order.id ? <FaAngleUp size={16} /> : <FaAngleDown size={16} />}
                      onClick={() => handleExpand(order.id)}
                      sx={{ fontSize: "0.9rem" }}
                    >
                      {expandedOrder === order.id ? "Hide Details" : "Show Details"}
                    </Button>
                  </Box>
                </Grid>
              </Grid>

              <Collapse in={expandedOrder === order.id}>
                <Divider sx={{ my: 3 }} />
                <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 4 }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle1" gutterBottom sx={{ mb: 3 }}>
                      Products
                    </Typography>
                    {order.products.map((product, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: "flex",
                          flexDirection: { xs: "column", sm: "row" },
                          alignItems: { xs: "center", sm: "flex-start" },
                          gap: 3,
                          mb: 2,
                          p: 3,
                          bgcolor: "grey.50",
                          borderRadius: 2
                        }}
                      >
                        <ProductImage
                          src={`https://${product.image}`}
                          alt={product.name}
                          variant="square"
                        />
                        <Box sx={{ flex: 1, textAlign: { xs: "center", sm: "left" } }}>
                          <Typography variant="subtitle1" sx={{ mb: 1 }}>{product.name}</Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            Quantity: {product.count}
                          </Typography>
                          <Typography variant="subtitle2" color="primary.main">
                            ${product.price.toFixed(2)}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                  <Box sx={{ width: { xs: "100%", md: "400px" }, borderLeft: { xs: "none", md: "2px solid" }, borderColor: "divider", pl: { xs: 0, md: 4 } }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                      <FaTruck size={20} style={{ marginRight: "12px", color: "#1976d2" }} />
                      <Typography variant="subtitle1">
                        Shipping Details
                      </Typography>
                    </Box>
                    <Box sx={{ bgcolor: "grey.50", p: 3, borderRadius: 2 }}>
                      <InfoText>
                        <FaUser />
                        {order.deliveryInfo.firstName} {order.deliveryInfo.lastName}
                      </InfoText>
                      <InfoText>
                        <FaMapMarkerAlt />
                        {order.deliveryInfo.streetNumber} {order.deliveryInfo.streetAddress}
                        <br />
                        {order.deliveryInfo.city}, {order.deliveryInfo.postalCode}
                      </InfoText>
                      <InfoText>
                        <FaPhone />
                        {order.deliveryInfo.phone}
                      </InfoText>
                      <InfoText>
                        <FaEnvelope />
                        {order.deliveryInfo.email}
                      </InfoText>
                    </Box>
                  </Box>
                </Box>
              </Collapse>
            </CardContent>
          </StyledCard>
        ))}
      </Paper>
    </Container>
  );
};

export default ManageOrders;