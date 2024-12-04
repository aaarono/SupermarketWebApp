// src/components/Panels/AddressPanel.js

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
  IconButton,
  Snackbar,
  Alert,
} from '@mui/material';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import AdminNavigation from './AdminNavigation';
import api from '../../services/api';

function AddressPanel({ setActivePanel }) {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [formData, setFormData] = useState({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Пагинация
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const response = await api.get('/addresses');
      setAddresses(response.data);
    } catch (error) {
      console.error('Ошибка при загрузке адресов:', error);
    }
  };

  const handleFormOpen = (address = null) => {
    setSelectedAddress(address);
    setFormData(
      address
        ? {
            street: address.street,
            city: address.city,
            state: address.state,
            postalCode: address.postalCode,
            country: address.country,
          }
        : { street: '', city: '', state: '', postalCode: '', country: '' }
    );
    setFormOpen(true);
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setSelectedAddress(null);
    setFormData({ street: '', city: '', state: '', postalCode: '', country: '' });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedAddress) {
        await api.put(`/addresses/${selectedAddress.id}`, formData);
        setSnackbar({ open: true, message: 'Адрес обновлен успешно', severity: 'success' });
      } else {
        await api.post('/addresses', formData);
        setSnackbar({ open: true, message: 'Адрес добавлен успешно', severity: 'success' });
      }
      fetchAddresses();
      handleFormClose();
    } catch (error) {
      console.error('Ошибка при сохранении адреса:', error);
      setSnackbar({ open: true, message: 'Ошибка при сохранении адреса', severity: 'error' });
    }
  };

  const handleDeleteConfirmOpen = (address) => {
    setSelectedAddress(address);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirmClose = () => {
    setDeleteConfirmOpen(false);
    setSelectedAddress(null);
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/addresses/${selectedAddress.id}`);
      setSnackbar({ open: true, message: 'Адрес удален успешно', severity: 'success' });
      fetchAddresses();
      handleDeleteConfirmClose();
    } catch (error) {
      console.error('Ошибка при удалении адреса:', error);
      setSnackbar({ open: true, message: 'Ошибка при удалении адреса', severity: 'error' });
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

  return (
    <div style={{ display: 'flex' }}>
      {/* Навигация */}
      <AdminNavigation setActivePanel={setActivePanel} />

      {/* Содержимое панели адресов */}
      <div style={{ flexGrow: 1, padding: '16px' }}>
        <Typography variant="h4" gutterBottom>
          Addresses
        </Typography>

        <Button variant="contained" color="primary" startIcon={<FiPlus />} onClick={() => handleFormOpen()}>
          Добавить адрес
        </Button>

        <Paper sx={{ width: '100%', overflow: 'hidden', marginTop: 2 }}>
          <TableContainer>
            <Table stickyHeader aria-label="addresses table">
              <TableHead>
                <TableRow>
                  <TableCell>Улица</TableCell>
                  <TableCell>Город</TableCell>
                  <TableCell>Штат/Область</TableCell>
                  <TableCell>Почтовый индекс</TableCell>
                  <TableCell>Страна</TableCell>
                  <TableCell align="right">Действия</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {addresses.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((address) => (
                  <TableRow hover key={address.id}>
                    <TableCell>{address.street}</TableCell>
                    <TableCell>{address.city}</TableCell>
                    <TableCell>{address.state}</TableCell>
                    <TableCell>{address.postalCode}</TableCell>
                    <TableCell>{address.country}</TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => handleFormOpen(address)}>
                        <FiEdit2 />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteConfirmOpen(address)}>
                        <FiTrash2 />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {addresses.length === 0 && (
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
            count={addresses.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>

        {/* Диалоговая форма добавления/редактирования */}
        <Dialog open={formOpen} onClose={handleFormClose}>
          <DialogTitle>{selectedAddress ? 'Редактировать адрес' : 'Добавить адрес'}</DialogTitle>
          <form onSubmit={handleFormSubmit}>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="Улица"
                type="text"
                fullWidth
                required
                value={formData.street}
                onChange={(e) => setFormData({ ...formData, street: e.target.value })}
              />
              <TextField
                margin="dense"
                label="Город"
                type="text"
                fullWidth
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
              <TextField
                margin="dense"
                label="Штат/Область"
                type="text"
                fullWidth
                required
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              />
              <TextField
                margin="dense"
                label="Почтовый индекс"
                type="text"
                fullWidth
                required
                value={formData.postalCode}
                onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
              />
              <TextField
                margin="dense"
                label="Страна"
                type="text"
                fullWidth
                required
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
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
          <DialogTitle>Удалить адрес?</DialogTitle>
          <DialogContent>
            <Typography>
              Вы уверены, что хотите удалить адрес "{selectedAddress?.street}, {selectedAddress?.city}"?
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

export default AddressPanel;
