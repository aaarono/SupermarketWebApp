import React, { useState, useContext } from "react";
import { login as loginService } from '../../services/authService';
import { AuthContext } from '../../contexts/AuthContext';
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  CircularProgress,
  Paper,
  Alert,
  InputAdornment,
  useTheme,
  useMediaQuery
} from "@mui/material";
import { styled } from "@mui/system";
import { MdEmail, MdLock, MdVisibility, MdVisibilityOff } from "react-icons/md";
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

const StyledForm = styled("form")(({ theme }) => ({
  width: "100%",
  marginTop: theme.spacing(2)
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

const LoginForm = () => {

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Real-time validation
    if (name === "email") {
      setErrors((prev) => ({
        ...prev,
        email: !validateEmail(value) ? "Invalid email format" : ""
      }));
    } else if (name === "password") {
      setErrors((prev) => ({
        ...prev,
        password: value.length < 8 ? "Password must be at least 8 characters" : ""
      }));
    }
  };

  const handleSubmit = async (e) => {
    // e.preventDefault();
    if (!errors.email && !errors.password && formData.email && formData.password) {
      setLoading(true);
      try {
        // Вызов функции login
        const { token, role } = await loginService(formData.email, formData.password);
        login(token, role);
        console.log("Login successful:", token);
        // Переход на страницу пользователя после успешного входа
        navigate(`/${role}`);
      } catch (error) {
        console.error('Error during login:', error);
        setErrors((prev) => ({ ...prev, form: 'Incorrect email or password.' }));
      } finally {
        setLoading(false);
      }
    }
  };
   

  return (
    <FormBackground>
      <Container component="main" maxWidth="xs">
        <StyledPaper elevation={6}>
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
            Welcome Back
          </Typography>

          <StyledForm onSubmit={handleSubmit} noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleChange}
              error={Boolean(errors.email)}
              helperText={errors.email}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MdEmail />
                  </InputAdornment>
                )
              }}
              aria-label="Email input field"
              sx={{
                "& .MuiOutlinedInput-root": {
                  "&:hover fieldset": {
                    borderColor: theme.palette.primary.main
                  }
                }
              }}
            />

            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              error={Boolean(errors.password)}
              helperText={errors.password}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MdLock />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment
                    position="end"
                    onClick={() => setShowPassword(!showPassword)}
                    sx={{ cursor: "pointer" }}
                  >
                    {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                  </InputAdornment>
                )
              }}
              aria-label="Password input field"
            />

              <StyledButton
                onClick={() => handleSubmit()}
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading || Boolean(errors.email) || Boolean(errors.password)}
                aria-label="Login button"
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Login"
                )}
              </StyledButton>
          </StyledForm>
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

export default LoginForm;