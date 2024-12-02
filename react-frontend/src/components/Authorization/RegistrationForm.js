import React, { useState } from "react";
import { register } from '../../services/authService';
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Grid,
  Paper,
  InputAdornment,
  IconButton,
  Alert,
} from "@mui/material";
import { styled } from "@mui/system";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Link, useNavigate } from 'react-router-dom';

const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    background: "rgba(255, 255, 255, 0.9)",
    backdropFilter: "blur(10px)",
    borderRadius: theme.spacing(2),
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.2s ease-in-out",
    "&:hover": {
      transform: "translateY(-5px)"
    }
}));

const StyledButton = styled(Button)(({ theme }) => ({
    margin: theme.spacing(3, 0, 2),
    padding: theme.spacing(1.5),
    background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`,
    transition: "all 0.3s ease-in-out",
    "&:hover": {
      transform: "scale(1.02)",
      boxShadow: "0 6px 20px rgba(0, 0, 0, 0.2)"
    }
  }));

const FormBackground = styled(Box)(({ theme }) => ({
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: `linear-gradient(135deg, #6B73FF 0%, #000DFF 100%)`,
    padding: theme.spacing(2)
  }));

const RegistrationForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateField = (name, value) => {
    switch (name) {
      case "firstName":
      case "lastName":
        return value.trim() === "" ? "This field is required" : "";
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return !emailRegex.test(value) ? "Invalid email address" : "";
      case "phone":
        const phoneRegex = /^\+?[1-9]\d{9,11}$/;
        return !phoneRegex.test(value) ? "Invalid phone number" : "";
      case "password":
        return value.length < 8
          ? "Password must be at least 8 characters long"
          : "";
      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e) => {
    // e.preventDefault();
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      // Вызов функции register
      const response = await register(formData);
      console.log('Registration successful:', response);

      // Переход на страницу входа после успешной регистрации
      navigate('/login');
    } catch (error) {
      console.error('Registration failed: ', error);
      alert("This email is already registered.");
      setErrors((prev) => ({ ...prev, form: 'Registration failed. Please try again.' }));
    } finally {
      setLoading(false);
    }
  };


  return (
    <FormBackground>
      <Container maxWidth="md">
        <StyledPaper elevation={3}>
        <Typography
            component="h1"
            variant="h4"
            sx={{
              mb: 4,
              fontWeight: "bold",
              background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
              backgroundClip: "text",
              textFillColor: "transparent",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}
          >
            Create Account
          </Typography>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  error={!!errors.firstName}
                  helperText={errors.firstName}
                  required
                  aria-label="First Name"
                  InputProps={{
                    sx: { borderRadius: "8px" },
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  error={!!errors.lastName}
                  helperText={errors.lastName}
                  required
                  aria-label="Last Name"
                  InputProps={{
                    sx: { borderRadius: "8px" },
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={!!errors.email}
                  helperText={errors.email}
                  required
                  aria-label="Email Address"
                  InputProps={{
                    sx: { borderRadius: "8px" },
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  error={!!errors.phone}
                  helperText={errors.phone}
                  required
                  aria-label="Phone Number"
                  InputProps={{
                    sx: { borderRadius: "8px" },
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  error={!!errors.password}
                  helperText={errors.password}
                  required
                  aria-label="Password"
                  InputProps={{
                    sx: { borderRadius: "8px" },
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? (
                            <AiOutlineEyeInvisible />
                          ) : (
                            <AiOutlineEye />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                  <StyledButton
                    onClick={() => handleSubmit()}
                    fullWidth
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={loading || Boolean(errors.email) || Boolean(errors.password) || Boolean(errors.firstName) || Boolean(errors.lastName) || Boolean(errors.phone)}
                    sx={{
                      mt: 2,
                      height: "56px",
                      borderRadius: "8px",
                      backgroundColor: "#667eea",
                      "&:hover": {
                        backgroundColor: "#764ba2",
                      },
                    }}
                  >
                    {loading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      "Register"
                    )}
                  </StyledButton>
              </Grid>
            </Grid>
          </form>
          {errors.form && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {errors.form}
              </Alert>
            )}
        </StyledPaper>
      </Container>
    </FormBackground>
  );
};

export default RegistrationForm;