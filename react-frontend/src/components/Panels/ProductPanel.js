// src/components/Panels/ProductPanel.js

import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  InputLabel,
  FormControl,
  MenuItem,
  IconButton,
  Snackbar,
  Alert,
} from '@mui/material';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import AdminNavigation from './AdminNavigation';
import api from '../../services/api';

function ProductPanel({ setActivePanel }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [skladIds, setskladIds] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    categoryId: '',
    skladId: '',
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Пагинация
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    fetchData();
  }, []);

  // Объединяем загрузку данных в одну функцию
  const fetchData = async () => {
    try {
      const [productsResponse, categoriesResponse, skladIdsResponse] = await Promise.all([
        api.get('/api/products'),
        api.get('/api/categories'),
        api.get('/api/sklads'),
      ]);
      console.log('Продукты:', productsResponse);
      console.log('Категории:', categoriesResponse);
      console.log('Склады:', skladIdsResponse);
      setProducts(productsResponse);
      setCategories(categoriesResponse);
      setskladIds(skladIdsResponse);
    } catch (error) {
      console.error('Ошибка при загрузке данных:', error);
    }
  };

  const handleFormOpen = (product = null) => {
    setSelectedProduct(product);
    setFormData(
      product
        ? {
            name: product.name,
            price: product.price,
            description: product.description,
            categoryId: product.categoryId,
            skladId: product.skladId,
          }
        : { name: '', price: '', categoryId: '', skladId: '' }
    );
    setFormOpen(true);
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setSelectedProduct(null);
    setFormData({ name: '', price: '', categoryId: '', skladId: '' });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedProduct) {
        await api.put(`/api/products/${selectedProduct.id}`, formData);
        setSnackbar({ open: true, message: 'Продукт обновлен успешно', severity: 'success' });
      } else {
        await api.post('/api/products', formData);
        setSnackbar({ open: true, message: 'Продукт добавлен успешно', severity: 'success' });
      }
      fetchData();
      handleFormClose();
    } catch (error) {
      console.error('Ошибка при сохранении продукта:', error);
      setSnackbar({ open: true, message: 'Ошибка при сохранении продукта', severity: 'error' });
    }
  };

  const handleDeleteConfirmOpen = (product) => {
    setSelectedProduct(product);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirmClose = () => {
    setDeleteConfirmOpen(false);
    setSelectedProduct(null);
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/api/products/${selectedProduct.id}`);
      setSnackbar({ open: true, message: 'Продукт удален успешно', severity: 'success' });
      fetchData();
      handleDeleteConfirmClose();
    } catch (error) {
      console.error('Ошибка при удалении продукта:', error);
      setSnackbar({ open: true, message: 'Ошибка при удалении продукта', severity: 'error' });
    }
  };

  // Обработчики пагинации
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value || 5);
    setPage(0);
  };

  // Проверяем загрузились ли все данные
  if (!products || !categories || !skladIds) {
    return <Typography>Загрузка данных...</Typography>;
  }

  return (
    <div style={{ display: 'flex' }}>
      {/* Навигация */}
      <AdminNavigation setActivePanel={setActivePanel} />

      {/* Содержимое панели продуктов */}
      <div style={{ flexGrow: 1, padding: '16px' }}>
        <Typography variant="h4" gutterBottom>
          Продукты
        </Typography>

        <Button
          variant="contained"
          color="primary"
          startIcon={<FiPlus />}
          onClick={() => handleFormOpen()}
          style={{ marginBottom: '16px' }}
        >
          Добавить продукт
        </Button>

        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer>
            <Table stickyHeader aria-label="products table">
              <TableHead>
                <TableRow>
                  <TableCell>Название</TableCell>
                  <TableCell>Цена</TableCell>
                  <TableCell>Описание</TableCell>
                  <TableCell>Категория</TableCell>
                  <TableCell>Склад</TableCell>
                  <TableCell align="right">Действия</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.length > 0 ? (
                  products.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((product) => {
                    const categoryId = categories.find((cat) => cat.id === product.categoryId);
                    const warehouse = skladIds.find((wh) => wh.id === product.skladId);
                    return (
                      <TableRow hover key={product.id}>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>{product.price}</TableCell>
                        <TableCell>{product.description}</TableCell>
                        <TableCell>{product.categoryId ? product.categoryId : 'Без категории'}</TableCell>
                        <TableCell>{product.skladId ? product.skladId : 'Без склада'}</TableCell>
                        <TableCell align="right">
                          <IconButton onClick={() => handleFormOpen(product)} color="primary">
                            <FiEdit2 />
                          </IconButton>
                          <IconButton onClick={() => handleDeleteConfirmOpen(product)} color="secondary">
                            <FiTrash2 />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      Нет данных
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={products.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>

        {/* Диалоговая форма добавления/редактирования */}
        <Dialog open={formOpen} onClose={handleFormClose} fullWidth maxWidth="sm">
          <DialogTitle>{selectedProduct ? 'Редактировать продукт' : 'Добавить продукт'}</DialogTitle>
          <form onSubmit={handleFormSubmit}>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="Название"
                type="text"
                fullWidth
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <TextField
                margin="dense"
                label="Цена"
                type="number"
                fullWidth
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
              <TextField
                margin="dense"
                label="Описапние"
                type="text"
                fullWidth
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
              <TextField
                autoFocus
                margin="dense"
                label="Категория"
                type="number"
                fullWidth
                required
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              />
              <TextField
                margin="dense"
                label="Склад"
                type="number"
                fullWidth
                required
                value={formData.skladId}
                onChange={(e) => setFormData({ ...formData, skladId : e.target.value })}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleFormClose}>Отмена</Button>
              <Button type="submit" color="primary">
                Сохранить
              </Button>
            </DialogActions>
          </form>
        </Dialog>

        {/* Диалог подтверждения удаления */}
        <Dialog open={deleteConfirmOpen} onClose={handleDeleteConfirmClose}>
          <DialogTitle>Удалить продукт?</DialogTitle>
          <DialogContent>
            <Typography>Вы уверены, что хотите удалить продукт "{selectedProduct?.name}"?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteConfirmClose}>Отмена</Button>
            <Button onClick={handleDelete} color="secondary">
              Удалить
            </Button>
          </DialogActions>
        </Dialog>

        {/* Уведомления */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
}

export default ProductPanel;