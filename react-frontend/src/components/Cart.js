import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  IconButton,
  TextField,
  Typography,
  CircularProgress,
  FormControl,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";
import { styled } from "@mui/system";
import { FaTrash, FaEdit } from "react-icons/fa";
import { BsCreditCard2Front, BsCash, BsBank } from "react-icons/bs";
import api from '../services/api';

const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: "1rem",
  transition: "transform 0.2s",
  "&:hover": {
    transform: "translateY(-2px)",
  },
}));

// const ProductImage = styled("img")({
//   width: "100%",
//   height: "120px",
//   objectFit: "cover",
//   borderRadius: "4px",
// });

const StyledSelect = styled(Select)({
  width: "100%",
  "& .MuiSelect-select": {
    display: "flex",
    alignItems: "center",
    gap: "12px"
  }
});

const InfoItem = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '8px'
});

const fetchImage = async (productId) => {
  try {
    const response = await api.get(`/api/products/image/${productId}`);
    return response; // Возвращаем Base64 строку
  } catch (error) {
    console.error(`Error fetching image for product ${productId}:`, error);
    return null; // Возвращаем null в случае ошибки
  }
};

const ProductImage = ({ productId, altText }) => {
  const [imageSrc, setImageSrc] = useState(""); // Base64 строка
  const [error, setError] = useState(false); // Состояние для ошибок

  useEffect(() => {
    let isMounted = true; // Для предотвращения обновления состояния после размонтирования

    const loadImage = async () => {
      const base64Image = await fetchImage(productId);
      if (isMounted) {
        if (base64Image) {
          setImageSrc(`data:image/jpeg;base64,${base64Image}`); // Устанавливаем Base64 изображение
          setError(false); // Сбрасываем ошибки
        } else {
          setImageSrc("");
          setError(true); // Устанавливаем ошибку
        }
      }
    };

    loadImage();

    return () => {
      isMounted = false; // Флаг для предотвращения утечек
    };
  }, [productId]);

  return (
    <img
      src={imageSrc}
      alt={altText || "Product Image"}
      onError={(e) => {
        e.target.src =
          "https://images.unsplash.com/photo-1560393464-5c69a73c5770"; // Изображение по умолчанию
      }}
      loading="lazy"
      style={{ width: "100%", height: "auto" }}
    />
  );
};

const Cart = () => {
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openAddressDialog, setOpenAddressDialog] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    street: '',
    postCode: '',
    city: '',
    streetNumber: '',
    deliveryOption: 'standard',
    paymentType: 'card',
    cardNumber: '',
    cashCount: '',
    bankAccountNumber: ''
  });
  
  const [isFormValid, setIsFormValid] = useState(false);
  
  const [customerId, setCustomerId] = useState(null); // ID заказчика
  const [address, setAddress] = useState(null); // Адрес заказчика

  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get('/api/user/customer');
        const userData = response.user;
        const customerData = response.customer;

        // Устанавливаем ID заказчика
        if (customerData && customerData.idZakazniku) {
          setCustomerId(customerData.idZakazniku);
        }

        // Обновляем formData с полученными данными
        setFormData(prevData => ({
          ...prevData,
          firstName: userData.jmeno || '',
          lastName: userData.prijmeni || '',
          email: userData.email || '',
          phone: customerData?.telefon || '',
          street: '', // Будет заполнено после получения адреса
          streetNumber: '',
          postCode: '',
          city: '',
        }));

        // Если есть адрес ID, получаем адрес
        if (customerData && customerData.adresaIdAdresy) {
          const addressResponse = await api.get(`/api/user/customer/${customerData.idZakazniku}/address`);
          setAddress(addressResponse.data);

          // Обновляем formData с адресными данными
          setFormData(prevData => ({
            ...prevData,
            street: addressResponse.ulice || '',
            streetNumber: addressResponse.cisloPopisne || '',
            postCode: addressResponse.psc || '',
            city: addressResponse.mesto || '',
          }));
        }
      } catch (error) {
        console.error('Ошибка при получении данных пользователя и заказчика:', error);
      }
    };

    fetchUserData();

    // Загрузка продуктов из localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    setProducts(cart);
  }, []);

  useEffect(() => {
    const handleCartUpdate = () => {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      setProducts(cart);
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  useEffect(() => {
    const checkFormValidity = () => {
      setIsFormValid(validatePersonalInfo() && validateAddress());
    };
    checkFormValidity();
  }, [formData]);

  // Обработка изменений количества и удаления товаров
  const handleQuantityChange = (id, value) => {
    const newQuantity = Math.max(1, parseInt(value) || 1);
    const updatedProducts = products.map(product =>
      product.id === id ? { ...product, quantity: newQuantity } : product
    );
    setProducts(updatedProducts);
    localStorage.setItem('cart', JSON.stringify(updatedProducts));

    // Отправляем событие после обновления корзины
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const validatePersonalInfo = () => {
    const newErrors = {};
    if (!/^[A-Za-z]{2,}$/.test(formData.firstName)) {
      newErrors.firstName = 'Введите корректное имя';
    }
    if (!/^[A-Za-z]{2,}$/.test(formData.lastName)) {
      newErrors.lastName = 'Введите корректную фамилию';
    }
    if (!/^\+?[1-9]\d{1,14}$/.test(formData.phone)) {
      newErrors.phone = 'Введите корректный номер телефона';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Введите корректный email';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateAddress = () => {
    const newErrors = {};
    if (!/^[A-Za-z\s]{2,}$/.test(formData.city)) {
      newErrors.city = 'Введите корректное название города';
    }
    if (!/^[A-Za-z\s]{2,}$/.test(formData.street)) {
      newErrors.street = 'Введите корректное название улицы';
    }
    if (!/^[A-Za-z0-9\s]{1,}$/.test(formData.streetNumber)) {
      newErrors.streetNumber = 'Введите корректный номер дома';
    }
    if (!/^[A-Za-z0-9\s]{4,}$/.test(formData.postCode)) {
      newErrors.postCode = 'Введите корректный почтовый индекс';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSavePersonalInfo = () => {
    const isPersonalInfoValid = validatePersonalInfo();
    if (isPersonalInfoValid) {
      setOpenDialog(false);
    }
  };

  const handleSaveAddress = () => {
    const isAddressValid = validateAddress();
    if (isAddressValid) {
      setOpenAddressDialog(false);
    }
  };

  const handleRemoveProduct = (id) => {
    const updatedProducts = products.filter(product => product.id !== id);
    setProducts(updatedProducts);
    localStorage.setItem('cart', JSON.stringify(updatedProducts));

    // Отправляем событие после обновления корзины
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const calculateTotal = () => {
    return products.reduce((total, product) => total + (product.price * product.quantity), 0);
  };

  const calculateChange = () => {
    const cashCount = parseFloat(formData.cashCount) || 0;
    const total = calculateTotal();
    return (cashCount - total).toFixed(2);
  };

  const handleSubmit = async () => {
    const isPersonalInfoValid = validatePersonalInfo();
    const isAddressValid = validateAddress();

    if (!isPersonalInfoValid || !isAddressValid) {
      alert('Пожалуйста, исправьте ошибки в форме перед отправкой.');
      return;
    }

    setLoading(true);
    try {
      // Формируем тело запроса
      const requestBody = {
        customerId: customerId,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        street: formData.street,
        streetNumber: formData.streetNumber,
        postCode: formData.postCode.replace(/\s+/g, ''),
        city: formData.city,
        paymentType: formData.paymentType,
        cardNumber: formData.paymentType === 'card' ? formData.cardNumber : null,
        cashAmount: formData.paymentType === 'cash' ? parseFloat(formData.cashCount) : null,
        bankAccountNumber: formData.paymentType === 'invoice' ? formData.bankAccountNumber : null,
        products: products.map(p => ({
          id: p.id,
          price: p.price,
          quantity: p.quantity,
        })),
      };

      // Отправляем POST-запрос на бэкенд
      await api.post('/api/orders', requestBody); // Убедитесь, что эндпоинт /api/orders существует

      alert('Заказ успешно создан!');

      // Очищаем корзину после успешного заказа
      localStorage.removeItem('cart');
      setProducts([]);
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (error) {
      console.error('Ошибка при создании заказа:', error);
      alert('Произошла ошибка при создании заказа. Попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleOpenAddressDialog = () => {
    setOpenAddressDialog(true);
  };

  const handleCloseAddressDialog = () => {
    setOpenAddressDialog(false);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>Shopping Cart</Typography>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          {products.map((product) => (
            <StyledCard key={product.id}>
              <CardContent>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={3}>
                    <ProductImage productId={product.id} altText={product.name} />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="h6">{product.name}</Typography>
                    <Typography variant="body1" color="text.secondary">
                      ${product.price.toFixed(2)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      type="number"
                      value={product.quantity}
                      onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                      inputProps={{ min: 1 }}
                      label="Quantity"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <IconButton
                      onClick={() => handleRemoveProduct(product.id)}
                      aria-label="Remove item"
                      color="error"
                    >
                      <FaTrash />
                    </IconButton>
                  </Grid>
                </Grid>
              </CardContent>
            </StyledCard>
          ))}
        </Grid>

        <Grid item xs={12} md={4}>
          <StyledCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>Order Information</Typography>
              <Box sx={{ mb: 3 }}>
                <InfoItem>
                  <Typography variant="subtitle1">Personal Information</Typography>
                  <IconButton 
                    color="primary" 
                    onClick={handleOpenDialog}
                    sx={{
                      '&:hover': {
                        backgroundColor: 'rgba(25, 118, 210, 0.04)',
                        transform: 'scale(1.1)',
                        transition: 'all 0.2s'
                      }
                    }}
                    aria-label="Edit personal information"
                  >
                    <FaEdit />
                  </IconButton>
                </InfoItem>
                <Typography><strong>First Name:</strong> {formData.firstName}</Typography>
                <Typography><strong>Last Name:</strong> {formData.lastName}</Typography>
                <Typography><strong>Phone:</strong> {formData.phone}</Typography>
                <Typography><strong>Email:</strong> {formData.email}</Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <InfoItem>
                  <Typography variant="subtitle1">Address Information</Typography>
                  <IconButton 
                    color="primary" 
                    onClick={handleOpenAddressDialog}
                    sx={{
                      '&:hover': {
                        backgroundColor: 'rgba(25, 118, 210, 0.04)',
                        transform: 'scale(1.1)',
                        transition: 'all 0.2s'
                      }
                    }}
                    aria-label="Edit address information"
                  >
                    <FaEdit />
                  </IconButton>
                </InfoItem>
                <Typography><strong>City:</strong> {formData.city}</Typography>
                <Typography><strong>Street:</strong> {formData.street}</Typography>
                <Typography><strong>Street Number:</strong> {formData.streetNumber}</Typography>
                <Typography><strong>Post Code:</strong> {formData.postCode}</Typography>
              </Box>
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl component="fieldset" fullWidth>
                    <Typography variant="subtitle1" gutterBottom>Payment Method</Typography>
                    <StyledSelect
                      value={formData.paymentType}
                      onChange={handleInputChange}
                      name="paymentType"
                    >
                      <MenuItem value="card">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <BsCreditCard2Front size={24} />
                          <Typography>Card</Typography>
                        </Box>
                      </MenuItem>
                      <MenuItem value="cash">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <BsCash size={24} />
                          <Typography>Cash</Typography>
                        </Box>
                      </MenuItem>
                      <MenuItem value="invoice">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <BsBank size={24} />
                          <Typography>Invoice</Typography>
                        </Box>
                      </MenuItem>
                    </StyledSelect>
                  </FormControl>
                </Grid>
                {formData.paymentType === 'card' && (
                  <Grid item xs={12}>
                    <TextField
                      label="Card Number"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      fullWidth
                      required
                      error={!!errors.cardNumber}
                      helperText={errors.cardNumber}
                    />
                  </Grid>
                )}
                {formData.paymentType === 'cash' && (
                  <Grid item xs={12}>
                    <TextField
                      label="Cash Amount"
                      name="cashCount"
                      type="number"
                      value={formData.cashCount}
                      onChange={handleInputChange}
                      fullWidth
                      required
                      error={!!errors.cashCount}
                      helperText={errors.cashCount}
                    />
                    {formData.cashCount && (
                      <Typography variant="body1" sx={{ mt: 1 }}>
                        Change: ${calculateChange()}
                      </Typography>
                    )}
                  </Grid>
                )}
                {formData.paymentType === 'invoice' && (
                  <Grid item xs={12}>
                    <TextField
                      label="Bank Account Number"
                      name="bankAccountNumber"
                      value={formData.bankAccountNumber}
                      onChange={handleInputChange}
                      fullWidth
                      required
                      error={!!errors.bankAccountNumber}
                      helperText={errors.bankAccountNumber}
                    />
                  </Grid>
                )}
              </Grid>
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Total: ${calculateTotal().toFixed(2)}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  onClick={handleSubmit}
                  disabled={loading || !isFormValid}
                  sx={{ mt: 2 }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    'Оформить заказ'
                  )}
                </Button>
              </Box>
            </CardContent>
          </StyledCard>

          {/* Диалог для редактирования персональной информации */}
          <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
            <DialogTitle>Edit Personal Information</DialogTitle>
            <DialogContent>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12}>
                  <TextField
                    label="First Name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    fullWidth
                    error={!!errors.firstName}
                    helperText={errors.firstName}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Last Name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    fullWidth
                    error={!!errors.lastName}
                    helperText={errors.lastName}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    fullWidth
                    error={!!errors.phone}
                    helperText={errors.phone}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    fullWidth
                    error={!!errors.email}
                    helperText={errors.email}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cancel</Button>
              <Button onClick={handleSavePersonalInfo} variant="contained" color="primary">
                Save Changes
              </Button>
            </DialogActions>
          </Dialog>

          {/* Диалог для редактирования адресной информации */}
          <Dialog open={openAddressDialog} onClose={() => setOpenAddressDialog(false)}>
            <DialogTitle>Edit Address Information</DialogTitle>
            <DialogContent>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12}>
                  <TextField
                    label="City"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    fullWidth
                    error={!!errors.city}
                    helperText={errors.city}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Street"
                    name="street"
                    value={formData.street}
                    onChange={handleInputChange}
                    fullWidth
                    error={!!errors.street}
                    helperText={errors.street}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Street Number"
                    name="streetNumber"
                    value={formData.streetNumber}
                    onChange={handleInputChange}
                    fullWidth
                    error={!!errors.streetNumber}
                    helperText={errors.streetNumber}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Post Code"
                    name="postCode"
                    value={formData.postCode}
                    onChange={handleInputChange}
                    fullWidth
                    error={!!errors.postCode}
                    helperText={errors.postCode}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseAddressDialog}>Cancel</Button>
              <Button onClick={handleSaveAddress} variant="contained" color="primary">
                Save Changes
              </Button>
            </DialogActions>
          </Dialog>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Cart;
