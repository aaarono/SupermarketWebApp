import React, { useState, useEffect } from "react";
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
  Select,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  Collapse,
  TextField,
} from "@mui/material";
import { styled } from "@mui/system";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import api from "../services/api";

// Styled Card with hover effects
const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: "1.5rem",
  transition: "all 0.3s ease",
  border: `1px solid ${theme.palette.grey[200]}`,
  "&:hover": {
    transform: "translateY(-3px)",
    boxShadow: "0 12px 20px rgba(0,0,0,0.1)",
  },
}));

const ManageOrders = () => {
  // State Variables
  const [orders, setOrders] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState({});
  const [filters, setFilters] = useState({ name: "", phone: "", email: "", status: "" });
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState({});
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [sortOrder, setSortOrder] = useState("asc"); // Sorting state

  // Fetch Order Statuses
  const fetchStatuses = async () => {
    try {
      const response = await api.get("/api/order-statuses");
      setStatuses(response);
    } catch (error) {
      console.error("Ошибка при загрузке статусов заказов:", error);
    }
  };

  // Fetch Orders with Filters and Sorting
  const fetchFilteredOrders = async () => {
    try {
      setLoading(true);
      const response = await api.post("/api/orders/filter", {
        name: filters.name || null,
        phone: filters.phone || null,
        email: filters.email || null,
        statusId: filters.status || null,
      });
      setOrders(response);
    } catch (error) {
      console.error("Ошибка при фильтрации заказов:", error);
      alert("Произошла ошибка при загрузке заказов. Попробуйте позже.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch Products for a Specific Order
  const fetchOrderProducts = async (orderId) => {
    try {
      const response = await api.get(`/api/orders/${orderId}/products`);
      return response;
    } catch (error) {
      console.error("Ошибка при загрузке продуктов:", error);
      throw error;
    }
  };

  // Initial Data Fetch
  useEffect(() => {
    fetchStatuses();
    fetchFilteredOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle Filter Input Changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  // Handle Sorting Order Change
  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  // Handle Expanding/Collapsing Order Details
  const handleExpand = async (orderId) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
    } else {
      if (!products[orderId]) {
        await fetchProducts(orderId);
      }
      setExpandedOrder(orderId);
    }
  };

  // Fetch Products and Update State
  const fetchProducts = async (orderId) => {
    try {
      setLoadingProducts(true);
      const response = await fetchOrderProducts(orderId);
      setProducts((prev) => ({ ...prev, [orderId]: response }));
    } catch (error) {
      alert("Ошибка при загрузке продуктов для заказа.");
    } finally {
      setLoadingProducts(false);
    }
  };

  // Handle Status Dropdown Change
  const handleStatusChange = (orderId, newStatus) => {
    setSelectedStatus((prev) => ({ ...prev, [orderId]: newStatus }));
  };

  // Open Confirmation Dialog
  const handleDialogOpen = (order) => {
    setCurrentOrder(order);
    setDialogOpen(true);
  };

  // Close Confirmation Dialog
  const handleDialogClose = () => {
    setDialogOpen(false);
    setCurrentOrder(null);
  };

  // Update Order Status
  const handleUpdateStatus = async () => {
    try {
      if (currentOrder) {
        const currentStatusId = currentOrder.ORDER_STATUS;
        const newStatusName = selectedStatus[currentOrder.ORDER_ID] || currentOrder.ORDER_STATUS;
        const newStatus = statuses.find((status) => status.NAZEV === newStatusName);

        if (!newStatus) {
          alert("Ошибка: выбранный статус не найден.");
          return;
        }

        // Validation based on status transition rules
        const validTransitions = {
          "1": ["2", "3"],
          "2": ["3", "4"],
          "3": [],
          "4": [],
        };

        if (!validTransitions[currentStatusId]?.includes(newStatus.ID_STATUS)) {
          alert("Изменение на выбранный статус невозможно в соответствии с правилами.");
          return;
        }

        // Send Status Update Request
        await api.put(`/api/order-statuses/${currentOrder.ORDER_ID}/status`, {
          status: newStatus.ID_STATUS,
        });

        // Update Orders State
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.ORDER_ID === currentOrder.ORDER_ID
              ? { ...order, ORDER_STATUS: newStatus.ID_STATUS, NAZEV: newStatus.NAZEV }
              : order
          )
        );

        alert("Статус успешно обновлен!");
      }
    } catch (error) {
      console.error("Ошибка при обновлении статуса заказа:", error);
      alert("Произошла ошибка при обновлении статуса заказа.");
    } finally {
      handleDialogClose();
    }
  };

  // Sorting Function
  const sortOrders = (orders) => {
    return [...orders].sort((a, b) =>
      sortOrder === "asc" ? a.ORDER_ID - b.ORDER_ID : b.ORDER_ID - a.ORDER_ID
    );
  };

  const sortedOrders = sortOrders(orders);

  // Loading State
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

      {/* Filter and Sort Section */}
      <Paper
        elevation={0}
        sx={{ p: { xs: 2, md: 4 }, bgcolor: "background.paper", borderRadius: "16px", mb: 4 }}
      >
        <Typography variant="h6" gutterBottom>
          Filter and Sort Orders
        </Typography>
        <Grid container spacing={2}>
          {/* Customer Name Filter */}
          <Grid item xs={12} sm={3}>
            <TextField
              label="Customer Name"
              variant="outlined"
              fullWidth
              name="name"
              value={filters.name}
              onChange={handleFilterChange}
            />
          </Grid>

          {/* Phone Filter */}
          <Grid item xs={12} sm={3}>
            <TextField
              label="Phone"
              variant="outlined"
              fullWidth
              name="phone"
              value={filters.phone}
              onChange={handleFilterChange}
            />
          </Grid>

          {/* Email Filter */}
          <Grid item xs={12} sm={3}>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              name="email"
              value={filters.email}
              onChange={handleFilterChange}
            />
          </Grid>

          {/* Status Filter */}
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                label="Status"
              >
                <MenuItem value="">All</MenuItem>
                {statuses.map((status) => (
                  <MenuItem key={status.ID_STATUS} value={status.ID_STATUS}>
                    {status.NAZEV}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Sort Order */}
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth>
              <InputLabel>Sort by ID</InputLabel>
              <Select value={sortOrder} onChange={handleSortChange} label="Sort by ID">
                <MenuItem value="asc">Ascending</MenuItem>
                <MenuItem value="desc">Descending</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Apply Filters Button */}
          <Grid item xs={12} sm={3}>
            <Button variant="contained" color="primary" onClick={fetchFilteredOrders} fullWidth>
              Apply Filters
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Orders List */}
      {sortedOrders.length === 0 ? (
        <Typography variant="h6" color="text.secondary">
          No orders found.
        </Typography>
      ) : (
        sortedOrders.map((order) => (
          <StyledCard key={order.ORDER_ID}>
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
              <Grid container spacing={2} alignItems="center">
                {/* Order Information */}
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

                {/* Status Dropdown */}
                <Grid item xs={12} sm={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={selectedStatus[order.ORDER_ID] || order.ORDER_STATUS}
                      onChange={(e) => handleStatusChange(order.ORDER_ID, e.target.value)}
                      label="Status"
                    >
                      {statuses.map((status) => (
                        <MenuItem key={status.ID_STATUS} value={status.NAZEV}>
                          {status.NAZEV}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Order Date */}
                <Grid item xs={12} sm={2}>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(order.ORDER_DATE).toLocaleDateString()}
                  </Typography>
                </Grid>

                {/* Action Buttons */}
                <Grid item xs={12} sm={4}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => handleDialogOpen(order)}
                      disabled={
                        selectedStatus[order.ORDER_ID] === undefined ||
                        selectedStatus[order.ORDER_ID] === order.ORDER_STATUS
                      }
                    >
                      Update Status
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      endIcon={
                        expandedOrder === order.ORDER_ID ? (
                          <FaAngleUp size={16} />
                        ) : (
                          <FaAngleDown size={16} />
                        )
                      }
                      onClick={() => handleExpand(order.ORDER_ID)}
                    >
                      {expandedOrder === order.ORDER_ID ? "Hide Details" : "Show Details"}
                    </Button>
                  </Box>
                </Grid>
              </Grid>

              {/* Expanded Order Details */}
              <Collapse in={expandedOrder === order.ORDER_ID} sx={{ mt: 3 }}>
                {/* Customer Details */}
                <Typography variant="subtitle1" gutterBottom>
                  Customer Details
                </Typography>
                <Typography variant="body2">
                  <strong>Name:</strong> {order.CUSTOMER_NAME}
                </Typography>
                <Typography variant="body2">
                  <strong>Address:</strong> {order.CUSTOMER_ADDRESS}, {order.CUSTOMER_CITY},{" "}
                  {order.CUSTOMER_POSTAL_CODE}
                </Typography>
                <Typography variant="body2">
                  <strong>Phone:</strong> {order.CUSTOMER_PHONE}
                </Typography>
                <Typography variant="body2">
                  <strong>Email:</strong> {order.CUSTOMER_EMAIL}
                </Typography>

                {/* Products List */}
                <Typography variant="subtitle1" sx={{ mt: 3 }}>
                  Products
                </Typography>
                {loadingProducts ? (
                  <Typography>Loading products...</Typography>
                ) : (
                  <>
                    {products[order.ORDER_ID]?.map((product) => (
                      <Box
                        key={product.id}
                        sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
                      >
                        <Typography>{product.name}</Typography>
                        <Typography>
                          {product.quantity} x ${product.price.toFixed(2)}
                        </Typography>
                      </Box>
                    ))}
                  </>
                )}
              </Collapse>
            </CardContent>
          </StyledCard>
        ))
      )}

      {/* Confirmation Dialog for Status Update */}
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Confirm Status Update</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to change the status of Order #{currentOrder?.ORDER_ID} from{" "}
            <strong>
              {statuses.find((s) => s.ID_STATUS === currentOrder?.ORDER_STATUS)?.NAZEV || "Unknown"}
            </strong>{" "}
            to <strong>{selectedStatus[currentOrder?.ORDER_ID]}</strong>?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleUpdateStatus} color="primary" variant="contained">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ManageOrders;
