import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Tooltip,
  Autocomplete
} from "@mui/material";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { styled } from "@mui/system";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import dayjs from "dayjs";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: "bold",
  backgroundColor: "#f5f5f5",
  cursor: "pointer",
  "&:hover": {
    backgroundColor: "#e0e0e0",
  },
}));

const suppliers = [
  {
    id: 1,
    name: "Fresh Foods Inc",
    products: ["Burger Buns", "Ground Beef", "Cheese Slices", "Lettuce"]
  },
  {
    id: 2,
    name: "Quality Meats",
    products: ["Premium Beef", "Chicken Patties", "Turkey Burgers"]
  },
  {
    id: 3,
    name: "Veggie World",
    products: ["Vegan Patties", "Plant-based Cheese", "Fresh Tomatoes"]
  }
];

const warehouses = ["Central", "North", "South", "East", "West"];
const categories = ["Bread", "Meat", "Dairy", "Vegetables", "Vegan"];

const initialProducts = [
  {
    id: 1,
    name: "Burger Buns",
    category: "Bread",
    warehouse: "Central",
    supplier: "Fresh Foods Inc",
    price: 3.99,
    quantity: 500,
    image: "images.unsplash.com/photo-1550950158-d0d960dff51b"
  },
  {
    id: 2,
    name: "Premium Beef",
    category: "Meat",
    warehouse: "North",
    supplier: "Quality Meats",
    price: 8.99,
    quantity: 200,
    image: "images.unsplash.com/photo-1603048297172-c85edf2c5f1c"
  },
  {
    id: 3,
    name: "Vegan Patties",
    category: "Vegan",
    warehouse: "South",
    supplier: "Veggie World",
    price: 6.99,
    quantity: 300,
    image: "images.unsplash.com/photo-1585991519035-72443f3920ee"
  }
];

const OrderSupplier = () => {
  const [products, setProducts] = useState(initialProducts);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedWarehouse, setSelectedWarehouse] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    const sortedProducts = [...products].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });
    setProducts(sortedProducts);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedSupplier && selectedProduct && selectedWarehouse && selectedCategory && quantity && price) {
      const newProduct = {
        id: products.length + 1,
        name: selectedProduct,
        category: selectedCategory,
        warehouse: selectedWarehouse,
        supplier: selectedSupplier.name,
        price: parseFloat(price),
        quantity: parseInt(quantity),
        image: "images.unsplash.com/photo-1550950158-d0d960dff51b"
      };

      setProducts([...products, newProduct]);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);

      // Reset form
      setSelectedSupplier(null);
      setSelectedProduct("");
      setSelectedWarehouse("");
      setSelectedCategory("");
      setQuantity("");
      setPrice("");
    }
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <FaSort />;
    return sortConfig.direction === "asc" ? <FaSortUp /> : <FaSortDown />;
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Supplier Order Management
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Create New Order
        </Typography>
        <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
          <Autocomplete
            options={suppliers}
            getOptionLabel={(option) => option.name}
            value={selectedSupplier}
            onChange={(event, newValue) => {
              setSelectedSupplier(newValue);
              setSelectedProduct("");
            }}
            renderInput={(params) => <TextField {...params} label="Select Supplier" />}
          />

          <FormControl fullWidth>
            <InputLabel>Product</InputLabel>
            <Select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              label="Product"
              disabled={!selectedSupplier}
            >
              {selectedSupplier?.products.map((product) => (
                <MenuItem key={product} value={product}>
                  {product}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Warehouse</InputLabel>
            <Select
              value={selectedWarehouse}
              onChange={(e) => setSelectedWarehouse(e.target.value)}
              label="Warehouse"
            >
              {warehouses.map((warehouse) => (
                <MenuItem key={warehouse} value={warehouse}>
                  {warehouse}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              label="Category"
            >
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Quantity"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            fullWidth
          />

          <TextField
            label="Price"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            fullWidth
            InputProps={{
              startAdornment: "$",
            }}
          />
        </Box>
        <Button variant="contained" type="submit" sx={{ mt: 2 }}>
          Create Order
        </Button>
      </Box>

      {showSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Order created successfully!
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell onClick={() => handleSort("name")}>
                Product Name {getSortIcon("name")}
              </StyledTableCell>
              <StyledTableCell onClick={() => handleSort("category")}>
                Category {getSortIcon("category")}
              </StyledTableCell>
              <StyledTableCell onClick={() => handleSort("warehouse")}>
                Warehouse {getSortIcon("warehouse")}
              </StyledTableCell>
              <StyledTableCell onClick={() => handleSort("supplier")}>
                Supplier {getSortIcon("supplier")}
              </StyledTableCell>
              <StyledTableCell onClick={() => handleSort("price")}>
                Price {getSortIcon("price")}
              </StyledTableCell>
              <StyledTableCell onClick={() => handleSort("quantity")}>
                Quantity {getSortIcon("quantity")}
              </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id} hover>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <img
                      src={`https://${product.image}`}
                      alt={product.name}
                      style={{ width: 50, height: 50, objectFit: "cover", borderRadius: 4 }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1576502200916-3808e07386a5";
                      }}
                    />
                    <Tooltip title={`View details for ${product.name}`}>
                      <Typography>{product.name}</Typography>
                    </Tooltip>
                  </Box>
                </TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>{product.warehouse}</TableCell>
                <TableCell>{product.supplier}</TableCell>
                <TableCell>${product.price.toFixed(2)}</TableCell>
                <TableCell>{product.quantity}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default OrderSupplier;