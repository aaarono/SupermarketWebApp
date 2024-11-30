import React, { useState, useEffect } from "react";
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
  Chip
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
  backgroundColor: status === "Delivered" ? theme.palette.success.light : theme.palette.warning.light,
  color: status === "Delivered" ? theme.palette.success.dark : theme.palette.warning.dark,
  "& .MuiChip-label": {
    fontWeight: 600
  }
}));

const OrdersList = () => {
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token'); // Предполагается, что JWT хранится в localStorage
        const response = await fetch('/api/orders', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Ошибка при получении заказов');
        }

        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error("Ошибка при загрузке заказов:", error);
        alert("Произошла ошибка при загрузке заказов. Попробуйте позже.");
      }
    };

    fetchOrders();
  }, []);

  const handleExpand = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 5, px: { xs: 2, md: 3 }, minHeight: "100vh" }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4, fontWeight: 600 }}>
        Your Orders
      </Typography>

      <Paper elevation={0} sx={{ p: { xs: 2, md: 4 }, bgcolor: "background.paper", borderRadius: "16px" }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 4, fontWeight: 500 }}>
          Order History
        </Typography>
        {orders.map((order) => (
          <StyledCard key={order.idObjednavky}>
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: { xs: "wrap", sm: "nowrap" } }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 500, minWidth: "100px" }}>
                  Order #{order.idObjednavky}
                </Typography>
                <StatusChip label={order.stav} status={order.stav} />
                <Typography variant="body2" color="text.secondary" sx={{ minWidth: "120px" }}>
                  {new Date(order.datum).toLocaleDateString()}
                </Typography>
                <Box sx={{ ml: { sm: "auto" }, display: "flex", alignItems: "center", gap: 2 }}>
                  <TotalCostBox>
                    <Typography variant="subtitle2" color="common.white">
                      ${order.suma.toFixed(2)}
                    </Typography>
                  </TotalCostBox>
                  <Button
                    variant="outlined"
                    size="small"
                    endIcon={expandedOrder === order.idObjednavky ? <FaAngleUp size={16} /> : <FaAngleDown size={16} />}
                    onClick={() => handleExpand(order.idObjednavky)}
                    sx={{ fontSize: "0.9rem" }}
                  >
                    {expandedOrder === order.idObjednavky ? "Hide Details" : "Show Details"}
                  </Button>
                </Box>
              </Box>

              <Collapse in={expandedOrder === order.idObjednavky}>
                <Divider sx={{ my: 3 }} />
                <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 4 }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle1" gutterBottom sx={{ mb: 3 }}>
                      Products
                    </Typography>
                    {order.products && order.products.map((product, index) => (
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
                            Quantity: {product.quantity}
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
                        {order.jmeno} {order.prijmeni}
                      </InfoText>
                      <InfoText>
                        <FaMapMarkerAlt />
                        {order.cisloPopisne} {order.ulice}
                        <br />
                        {order.mesto}, {order.psc}
                      </InfoText>
                      <InfoText>
                        <FaPhone />
                        {order.telefon}
                      </InfoText>
                      <InfoText>
                        <FaEnvelope />
                        {order.email}
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

export default OrdersList;
