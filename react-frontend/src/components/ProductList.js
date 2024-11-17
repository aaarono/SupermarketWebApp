import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  Container,
  TextField,
  Select,
  MenuItem,
  Pagination,
  Button,
  FormControl,
  InputLabel,
  InputAdornment,
  Zoom,
} from "@mui/material";
import { styled } from "@mui/system";
import { FiSearch, FiShoppingCart } from "react-icons/fi";

const StyledCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  transition: "transform 0.3s ease-in-out",
  "&:hover": {
    transform: "scale(1.03)",
    boxShadow: theme.shadows[6],
  },
}));

const StyledCardMedia = styled(CardMedia)({
  paddingTop: "56.25%",
  transition: "transform 0.3s ease-in-out",
  "&:hover": {
    transform: "scale(1.1)",
  },
});

const ProductList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [page, setPage] = useState(1);
  const productsPerPage = 8;

  const products = [
    {
      id: 1,
      name: "Organic Coffee Beans",
      price: 24.99,
      category: "beverages",
      description: "Premium organic coffee beans from sustainable farms",
      image: "images.unsplash.com/photo-1447933601403-0c6688de566e",
    },
    {
      id: 2,
      name: "Wireless Headphones",
      price: 199.99,
      category: "electronics",
      description: "High-quality wireless headphones with noise cancellation",
      image: "images.unsplash.com/photo-1505740420928-5e560c06d30e",
    },
    {
      id: 3,
      name: "Leather Wallet",
      price: 49.99,
      category: "accessories",
      description: "Genuine leather wallet with multiple card slots",
      image: "images.unsplash.com/photo-1627123424574-724758594e93",
    },
    {
      id: 4,
      name: "Smart Watch",
      price: 299.99,
      category: "electronics",
      description: "Feature-rich smartwatch with health monitoring",
      image: "images.unsplash.com/photo-1523275335684-37898b6baf30",
    },
    {
      id: 5,
      name: "Yoga Mat",
      price: 29.99,
      category: "fitness",
      description: "Non-slip yoga mat for comfortable workouts",
      image: "images.unsplash.com/photo-1593810450967-f9c42742e326",
    },
    {
      id: 6,
      name: "Plant Pot",
      price: 19.99,
      category: "home",
      description: "Ceramic plant pot with drainage holes",
      image: "images.unsplash.com/photo-1485955900006-10f4d324d411",
    },
    {
      id: 7,
      name: "Desk Lamp",
      price: 39.99,
      category: "home",
      description: "LED desk lamp with adjustable brightness",
      image: "images.unsplash.com/photo-1507473885765-e6ed057f782c",
    },
    {
      id: 8,
      name: "Protein Powder",
      price: 54.99,
      category: "fitness",
      description: "Premium whey protein powder for muscle recovery",
      image: "images.unsplash.com/photo-1593095948071-474c5cc2989d",
    },
    {
      id: 9,
      name: "Protein Powder 2.0",
      price: 58.99,
      category: "fitness",
      description: "Premium whey protein powder for muscle recovery",
      image: "images.unsplash.com/photo-1593095948071-474c5cc2989d",
    },
  ];

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "electronics", label: "Electronics" },
    { value: "accessories", label: "Accessories" },
    { value: "fitness", label: "Fitness" },
    { value: "home", label: "Home" },
    { value: "beverages", label: "Beverages" },
  ];

  const filteredProducts = products
    .filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((product) => category === "all" || product.category === category);

  const pageCount = Math.ceil(filteredProducts.length / productsPerPage);
  const displayedProducts = filteredProducts.slice(
    (page - 1) * productsPerPage,
    page * productsPerPage
  );

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(1);
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
    setPage(1);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search products..."
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FiSearch />
                  </InputAdornment>
                ),
              }}
              aria-label="Search products"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel id="category-select-label">Category</InputLabel>
              <Select
                labelId="category-select-label"
                value={category}
                label="Category"
                onChange={handleCategoryChange}
                aria-label="Select category"
              >
                {categories.map((cat) => (
                  <MenuItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      <Grid container spacing={3}>
        {displayedProducts.map((product) => (
          <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
            <Zoom in={true} style={{ transitionDelay: "200ms" }}>
              <StyledCard>
                <StyledCardMedia
                  image={`https://${product.image}`}
                  title={product.name}
                  alt={product.name}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography
                    gutterBottom
                    variant="h6"
                    component="h2"
                    aria-label={`Product: ${product.name}`}
                  >
                    {product.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                    aria-label={`Description: ${product.description}`}
                  >
                    {product.description}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      variant="h6"
                      color="primary"
                      aria-label={`Price: $${product.price}`}
                    >
                      ${product.price}
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<FiShoppingCart />}
                      aria-label={`Add ${product.name} to cart`}
                    >
                      Buy
                    </Button>
                  </Box>
                </CardContent>
              </StyledCard>
            </Zoom>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
        <Pagination
          count={pageCount}
          page={page}
          onChange={handlePageChange}
          color="primary"
          size="large"
          aria-label="Product pagination"
        />
      </Box>
    </Container>
  );
};

export default ProductList;
