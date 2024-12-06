// src/components/OrderProductPanel.js

import React, { useState, useEffect } from 'react';
import {
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Snackbar,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
} from '@mui/material';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import AdminNavigation from './AdminNavigation';
import api from '../../services/api';

function OrderProductPanel({ setActivePanel }) {
  const [orderProducts, setOrderProducts] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Пагинация
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [formOpen, setFormOpen] = useState(false);
  const [selectedOrderProduct, setSelectedOrderProduct] = useState(null);
  const [formData, setFormData] = useState({
    objednavka_id_objednavky: '',
    produkt_id_produktu: '',
    quantity: '',
  });
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderProducts();
  }, []);

  const fetchOrderProducts = async () => {
    try {
      const response = await api.get('/api/order-products'); // Исправлено
      console.log('Полученные данные:', response); // Логирование для отладки

      // Проверка структуры ответа
      if (response && response) {
        setOrderProducts(Array.isArray(response) ? response : []);
      } else {
        setOrderProducts([]);
      }
      setLoading(false);
    } catch (error) {
      console.error('Ошибка при загрузке связей заказ-продукт:', error);
      setSnackbar({ open: true, message: 'Ошибка при загрузке связей заказ-продукт', severity: 'error' });
      setLoading(false);
    }
  };

  const handleFormOpen = (orderProduct = null) => {
    setSelectedOrderProduct(orderProduct);
    setFormData(
      orderProduct
        ? {
            objednavka_id_objednavky: orderProduct.orderId,
            produkt_id_produktu: orderProduct.productId, // Исправлено
            quantity: orderProduct.quantity,
          }
        : { objednavka_id_objednavky: '', produkt_id_produktu: '', quantity: '' }
    );
    setFormOpen(true);
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setSelectedOrderProduct(null);
    setFormData({ objednavka_id_objednavky: '', produkt_id_produktu: '', quantity: '' });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        orderId: parseInt(formData.objednavka_id_objednavky, 10),
        productId: parseInt(formData.produkt_id_produktu, 10), // Исправлено
        quantity: parseInt(formData.quantity, 10),
      };

      if (selectedOrderProduct) {
        await api.put('/api/order-products', dataToSend);
        setSnackbar({ open: true, message: 'Связь обновлена успешно', severity: 'success' });
      } else {
        await api.post('/api/order-products', dataToSend);
        setSnackbar({ open: true, message: 'Связь добавлена успешно', severity: 'success' });
      }
      fetchOrderProducts();
      handleFormClose();
    } catch (error) {
      console.error('Ошибка при сохранении связи:', error);
      const errorMessage = error.response?.data || 'Ошибка при сохранении связи';
      setSnackbar({ open: true, message: errorMessage, severity: 'error' });
    }
  };

  const handleDeleteConfirmOpen = (orderProduct) => {
    setSelectedOrderProduct(orderProduct);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirmClose = () => {
    setDeleteConfirmOpen(false);
    setSelectedOrderProduct(null);
  };

  const handleDelete = async () => {
    try {
      await api.delete('/api/order-products', {
        params: {
          orderId: selectedOrderProduct.orderId, // Исправлено
          productId: selectedOrderProduct.productId, // Исправлено
        },
      });
      setSnackbar({ open: true, message: 'Связь удалена успешно', severity: 'success' });
      fetchOrderProducts();
      handleDeleteConfirmClose();
    } catch (error) {
      console.error('Ошибка при удалении связи:', error);
      const errorMessage = error.response?.data || 'Ошибка при удалении связи';
      setSnackbar({ open: true, message: errorMessage, severity: 'error' });
    }
  };

  // Обработчики пагинации
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // Проверяем, загрузились ли данные
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex' }}>
      {/* Навигация */}
      <AdminNavigation setActivePanel={setActivePanel} />

      {/* Содержимое панели связей заказ-продукт */}
      <div style={{ flexGrow: 1, padding: '16px' }}>
        <Typography variant="h4" gutterBottom>
          Связи Заказ-Продукт
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<FiPlus />}
          onClick={() => handleFormOpen()}
          style={{ marginBottom: '16px' }}
        >
          Добавить связь
        </Button>

        <Paper sx={{ width: '100%', overflow: 'hidden', marginTop: 2 }}>
          <TableContainer>
            <Table stickyHeader aria-label="order-products table">
              <TableHead>
                <TableRow>
                  <TableCell>ID Заказа</TableCell>
                  <TableCell>ID Продукта</TableCell>
                  <TableCell>Количество</TableCell>
                  <TableCell align="right">Действия</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orderProducts.length > 0 ? (
                  orderProducts
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((op) => (
                      <TableRow hover key={`${op.orderId}-${op.productId}`}> {/* Исправлено */}
                        <TableCell>{op.orderId}</TableCell>
                        <TableCell>{op.productId}</TableCell> {/* Исправлено */}
                        <TableCell>{op.quantity}</TableCell>
                        <TableCell align="right">
                          <IconButton onClick={() => handleFormOpen(op)} color="primary">
                            <FiEdit2 />
                          </IconButton>
                          <IconButton onClick={() => handleDeleteConfirmOpen(op)} color="secondary">
                            <FiTrash2 />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center"> {/* Исправлено colSpan */}
                      Нет данных
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={orderProducts.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </Paper>

        {/* Форма добавления/редактирования связи */}
        <Dialog open={formOpen} onClose={handleFormClose} fullWidth maxWidth="sm">
          <DialogTitle>{selectedOrderProduct ? 'Редактировать связь' : 'Добавить связь'}</DialogTitle>
          <form onSubmit={handleFormSubmit}>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="ID Заказа"
                type="number"
                fullWidth
                required
                value={formData.objednavka_id_objednavky}
                onChange={(e) => setFormData({ ...formData, objednavka_id_objednavky: e.target.value })}
                disabled={!!selectedOrderProduct} // Запрещаем изменение ID заказа при редактировании
              />
              <TextField
                margin="dense"
                label="ID Продукта"
                type="number"
                fullWidth
                required
                value={formData.produkt_id_produktu}
                onChange={(e) => setFormData({ ...formData, produkt_id_produktu: e.target.value })}
                disabled={!!selectedOrderProduct} // Запрещаем изменение ID продукта при редактировании
              />
              <TextField
                margin="dense"
                label="Количество"
                type="number"
                fullWidth
                required
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
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
          <DialogTitle>Удалить связь?</DialogTitle>
          <DialogContent>
            <Typography>
              Вы уверены, что хотите удалить связь заказа ID {selectedOrderProduct?.orderId} и продукта ID{' '}
              {selectedOrderProduct?.productId}?
            </Typography>
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
          <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
}

export default OrderProductPanel;
