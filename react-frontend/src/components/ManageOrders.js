import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Paper,
  Button,
  Chip,
  TextField
} from "@mui/material";
import { styled } from "@mui/system";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import api from "../services/api";

const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: "1.5rem",
  transition: "all 0.3s ease",
  border: `1px solid ${theme.palette.grey[200]}`,
  "&:hover": {
    transform: "translateY(-3px)",
    boxShadow: "0 12px 20px rgba(0,0,0,0.1)"
  }
}));

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filters, setFilters] = useState({ name: "", phone: "", email: "" });
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchFilteredOrders = async () => {
    try {
      setLoading(true);
      const response = await api.post("/api/orders/filter", {
        name: filters.name || null,
        phone: filters.phone || null,
        email: filters.email || null
      });
      setOrders(response);
    } catch (error) {
      console.error("Ошибка при фильтрации заказов:", error);
      alert("Произошла ошибка при загрузке заказов. Попробуйте позже.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value
    }));
  };

  const handleExpand = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Typography variant="h5">Loading orders...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 5, minHeight: "100vh" }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4, fontWeight: 600 }}>
        Manage Orders
      </Typography>

      <Paper elevation={0} sx={{ p: { xs: 2, md: 4 }, bgcolor: "background.paper", borderRadius: "16px", mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Filter Orders
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Customer Name"
              variant="outlined"
              fullWidth
              name="name"
              value={filters.name}
              onChange={handleFilterChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Phone"
              variant="outlined"
              fullWidth
              name="phone"
              value={filters.phone}
              onChange={handleFilterChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              name="email"
              value={filters.email}
              onChange={handleFilterChange}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={fetchFilteredOrders}
              fullWidth
            >
              Apply Filters
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {orders.length === 0 ? (
        <Typography variant="h6" color="text.secondary">
          No orders found.
        </Typography>
      ) : (
        orders.map((order) => (
          <StyledCard key={order.ORDER_ID}>
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={3}>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                      Order #{order.ORDER_ID}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {order.CUSTOMER_EMAIL}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={3}>
                  <Chip label={order.ORDER_STATUS} color="primary" />
                </Grid>

                <Grid item xs={12} sm={2}>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(order.ORDER_DATE).toLocaleDateString()}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 2 }}>
                    <Typography variant="h6">
                      ${order.TOTAL_PRICE.toFixed(2)}
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      endIcon={expandedOrder === order.ORDER_ID ? <FaAngleUp size={16} /> : <FaAngleDown size={16} />}
                      onClick={() => handleExpand(order.ORDER_ID)}
                    >
                      {expandedOrder === order.ORDER_ID ? "Hide Details" : "Show Details"}
                    </Button>
                  </Box>
                </Grid>
              </Grid>

              {expandedOrder === order.ORDER_ID && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Customer Details
                  </Typography>
                  <Typography variant="body2">
                    <strong>Name:</strong> {order.CUSTOMER_NAME}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Address:</strong> {order.CUSTOMER_ADDRESS}, {order.CUSTOMER_CITY}, {order.CUSTOMER_POSTAL_CODE}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Phone:</strong> {order.CUSTOMER_PHONE}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Email:</strong> {order.CUSTOMER_EMAIL}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </StyledCard>
        ))
      )}
    </Container>
  );
};

export default ManageOrders;
