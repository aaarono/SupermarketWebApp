// ProductSupplierPanel.js

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

function ProductSupplierPanel({ setActivePanel }) {
  const [productSuppliers, setProductSuppliers] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Пагинация
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [formOpen, setFormOpen] = useState(false);
  const [selectedProductSupplier, setSelectedProductSupplier] = useState(null);
  const [formData, setFormData] = useState({
    produkt_id_produktu: '',
    dodavatel_id_dodavatelu: '',
  });
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProductSuppliers();
  }, []);

  const fetchProductSuppliers = async () => {
    try {
      const response = await api.get('/api/product-suppliers');
      setProductSuppliers(response);
      setLoading(false);
    } catch (error) {
      console.error('Ошибка при загрузке связей продукт-поставщик:', error);
      setSnackbar({ open: true, message: 'Ошибка при загрузке связей продукт-поставщик', severity: 'error' });
      setLoading(false);
    }
  };

  const handleFormOpen = (productSupplier = null) => {
    setSelectedProductSupplier(productSupplier);
    setFormData(
      productSupplier
        ? {
            produkt_id_produktu: productSupplier.produkt_id_produktu,
            dodavatel_id_dodavatelu: productSupplier.dodavatel_id_dodavatelu,
          }
        : { produkt_id_produktu: '', dodavatel_id_dodavatelu: '' }
    );
    setFormOpen(true);
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setSelectedProductSupplier(null);
    setFormData({ produkt_id_produktu: '', dodavatel_id_dodavatelu: '' });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        produkt_id_produktu: parseInt(formData.produkt_id_produktu, 10),
        dodavatel_id_dodavatelu: parseInt(formData.dodavatel_id_dodavatelu, 10),
      };

      if (selectedProductSupplier) {
        await api.put(`/api/product-suppliers/${selectedProductSupplier.id}`, dataToSend);
        setSnackbar({ open: true, message: 'Связь обновлена успешно', severity: 'success' });
      } else {
        await api.post('/api/product-suppliers', dataToSend);
        setSnackbar({ open: true, message: 'Связь добавлена успешно', severity: 'success' });
      }
      fetchProductSuppliers();
      handleFormClose();
    } catch (error) {
      console.error('Ошибка при сохранении связи:', error);
      const errorMessage = error.response?.data || 'Ошибка при сохранении связи';
      setSnackbar({ open: true, message: errorMessage, severity: 'error' });
    }
  };

  const handleDeleteConfirmOpen = (productSupplier) => {
    setSelectedProductSupplier(productSupplier);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirmClose = () => {
    setDeleteConfirmOpen(false);
    setSelectedProductSupplier(null);
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/api/product-suppliers/${selectedProductSupplier.id}`);
      setSnackbar({ open: true, message: 'Связь удалена успешно', severity: 'success' });
      fetchProductSuppliers();
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

      {/* Содержимое панели связей продукт-поставщик */}
      <div style={{ flexGrow: 1, padding: '16px' }}>
        <Typography variant="h4" gutterBottom>
          Связи Продукт-Поставщик
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
            <Table stickyHeader aria-label="product-suppliers table">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>ID Продукта</TableCell>
                  <TableCell>ID Поставщика</TableCell>
                  <TableCell align="right">Действия</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {productSuppliers.length > 0 ? (
                  productSuppliers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((ps) => (
                    <TableRow hover key={ps.id}>
                      <TableCell>{ps.id}</TableCell>
                      <TableCell>{ps.produkt_id_produktu}</TableCell>
                      <TableCell>{ps.dodavatel_id_dodavatelu}</TableCell>
                      <TableCell align="right">
                        <IconButton onClick={() => handleFormOpen(ps)} color="primary">
                          <FiEdit2 />
                        </IconButton>
                        <IconButton onClick={() => handleDeleteConfirmOpen(ps)} color="secondary">
                          <FiTrash2 />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      Нет данных
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={productSuppliers.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </Paper>

        {/* Форма добавления/редактирования связи */}
        <Dialog open={formOpen} onClose={handleFormClose} fullWidth maxWidth="sm">
          <DialogTitle>{selectedProductSupplier ? 'Редактировать связь' : 'Добавить связь'}</DialogTitle>
          <form onSubmit={handleFormSubmit}>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="ID Продукта"
                type="number"
                fullWidth
                required
                value={formData.produkt_id_produktu}
                onChange={(e) => setFormData({ ...formData, produkt_id_produktu: e.target.value })}
              />
              <TextField
                margin="dense"
                label="ID Поставщика"
                type="number"
                fullWidth
                required
                value={formData.dodavatel_id_dodavatelu}
                onChange={(e) => setFormData({ ...formData, dodavatel_id_dodavatelu: e.target.value })}
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
              Вы уверены, что хотите удалить связь с ID {selectedProductSupplier?.id}?
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

export default ProductSupplierPanel;
