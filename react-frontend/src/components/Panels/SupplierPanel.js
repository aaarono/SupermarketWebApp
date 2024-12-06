// SupplierPanel.js

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

function SupplierPanel({ setActivePanel }) {
  const [suppliers, setSuppliers] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Пагинация
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [formOpen, setFormOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [formData, setFormData] = useState({
    nazev: '',
    kontaktni_osoba: '',
    telefon: '',
    email: '',
  });
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const response = await api.get('/api/suppliers');
      setSuppliers(response);
      setLoading(false);
    } catch (error) {
      console.error('Ошибка при загрузке поставщиков:', error);
      setSnackbar({ open: true, message: 'Ошибка при загрузке поставщиков', severity: 'error' });
      setLoading(false);
    }
  };

  const handleFormOpen = (supplier = null) => {
    setSelectedSupplier(supplier);
    setFormData(
      supplier
        ? {
            nazev: supplier.nazev,
            kontaktni_osoba: supplier.kontaktni_osoba,
            telefon: supplier.telefon,
            email: supplier.email,
          }
        : { nazev: '', kontaktni_osoba: '', telefon: '', email: '' }
    );
    setFormOpen(true);
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setSelectedSupplier(null);
    setFormData({ nazev: '', kontaktni_osoba: '', telefon: '', email: '' });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        nazev: formData.nazev,
        kontaktni_osoba: formData.kontaktni_osoba,
        telefon: parseInt(formData.telefon, 10),
        email: formData.email,
      };

      if (selectedSupplier) {
        await api.put(`/api/suppliers/${selectedSupplier.id}`, dataToSend);
        setSnackbar({ open: true, message: 'Поставщик обновлен успешно', severity: 'success' });
      } else {
        await api.post('/api/suppliers', dataToSend);
        setSnackbar({ open: true, message: 'Поставщик добавлен успешно', severity: 'success' });
      }
      fetchSuppliers();
      handleFormClose();
    } catch (error) {
      console.error('Ошибка при сохранении поставщика:', error);
      const errorMessage = error.response?.data || 'Ошибка при сохранении поставщика';
      setSnackbar({ open: true, message: errorMessage, severity: 'error' });
    }
  };

  const handleDeleteConfirmOpen = (supplier) => {
    setSelectedSupplier(supplier);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirmClose = () => {
    setDeleteConfirmOpen(false);
    setSelectedSupplier(null);
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/api/suppliers/${selectedSupplier.id}`);
      setSnackbar({ open: true, message: 'Поставщик удален успешно', severity: 'success' });
      fetchSuppliers();
      handleDeleteConfirmClose();
    } catch (error) {
      console.error('Ошибка при удалении поставщика:', error);
      const errorMessage = error.response?.data || 'Ошибка при удалении поставщика';
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

      {/* Содержимое панели поставщиков */}
      <div style={{ flexGrow: 1, padding: '16px' }}>
        <Typography variant="h4" gutterBottom>
          Поставщики
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<FiPlus />}
          onClick={() => handleFormOpen()}
          style={{ marginBottom: '16px' }}
        >
          Добавить поставщика
        </Button>

        <Paper sx={{ width: '100%', overflow: 'hidden', marginTop: 2 }}>
          <TableContainer>
            <Table stickyHeader aria-label="suppliers table">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Название</TableCell>
                  <TableCell>Контактное лицо</TableCell>
                  <TableCell>Телефон</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell align="right">Действия</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {suppliers.length > 0 ? (
                  suppliers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((supplier) => (
                    <TableRow hover key={supplier.id}>
                      <TableCell>{supplier.id}</TableCell>
                      <TableCell>{supplier.nazev}</TableCell>
                      <TableCell>{supplier.kontaktni_osoba}</TableCell>
                      <TableCell>{supplier.telefon}</TableCell>
                      <TableCell>{supplier.email}</TableCell>
                      <TableCell align="right">
                        <IconButton onClick={() => handleFormOpen(supplier)} color="primary">
                          <FiEdit2 />
                        </IconButton>
                        <IconButton onClick={() => handleDeleteConfirmOpen(supplier)} color="secondary">
                          <FiTrash2 />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      Нет данных
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={suppliers.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </Paper>

        {/* Форма добавления/редактирования поставщика */}
        <Dialog open={formOpen} onClose={handleFormClose} fullWidth maxWidth="sm">
          <DialogTitle>{selectedSupplier ? 'Редактировать поставщика' : 'Добавить поставщика'}</DialogTitle>
          <form onSubmit={handleFormSubmit}>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="Название"
                type="text"
                fullWidth
                required
                value={formData.nazev}
                onChange={(e) => setFormData({ ...formData, nazev: e.target.value })}
              />
              <TextField
                margin="dense"
                label="Контактное лицо"
                type="text"
                fullWidth
                required
                value={formData.kontaktni_osoba}
                onChange={(e) => setFormData({ ...formData, kontaktni_osoba: e.target.value })}
              />
              <TextField
                margin="dense"
                label="Телефон"
                type="number"
                fullWidth
                required
                value={formData.telefon}
                onChange={(e) => setFormData({ ...formData, telefon: e.target.value })}
              />
              <TextField
                margin="dense"
                label="Email"
                type="email"
                fullWidth
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
          <DialogTitle>Удалить поставщика?</DialogTitle>
          <DialogContent>
            <Typography>
              Вы уверены, что хотите удалить поставщика с ID {selectedSupplier?.id}?
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

export default SupplierPanel;
