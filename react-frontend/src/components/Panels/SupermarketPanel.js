// src/components/Panels/SupermarketPanel.js

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
  MenuItem,
  IconButton,
  Snackbar,
  Alert,
} from '@mui/material';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import AdminNavigation from './AdminNavigation';
import api from '../../services/api';

function SupermarketPanel({ setActivePanel }) {
  const [supermarkets, setSupermarkets] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedSupermarket, setSelectedSupermarket] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', addressId: '' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Пагинация
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    fetchSupermarkets();
    fetchAddresses();
  }, []);

  const fetchSupermarkets = async () => {
    try {
      const response = await api.get('/supermarkets');
      setSupermarkets(response.data);
    } catch (error) {
      console.error('Ошибка при загрузке супермаркетов:', error);
    }
  };

  const fetchAddresses = async () => {
    try {
      const response = await api.get('/addresses');
      setAddresses(response.data);
    } catch (error) {
      console.error('Ошибка при загрузке адресов:', error);
    }
  };

  const handleFormOpen = (supermarket = null) => {
    setSelectedSupermarket(supermarket);
    setFormData(
      supermarket
        ? { name: supermarket.name, addressId: supermarket.addressId }
        : { name: '', addressId: '' }
    );
    setFormOpen(true);
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setSelectedSupermarket(null);
    setFormData({ name: '', addressId: '' });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedSupermarket) {
        await api.put(`/supermarkets/${selectedSupermarket.id}`, formData);
        setSnackbar({ open: true, message: 'Супермаркет обновлен успешно', severity: 'success' });
      } else {
        await api.post('/supermarkets', formData);
        setSnackbar({ open: true, message: 'Супермаркет добавлен успешно', severity: 'success' });
      }
      fetchSupermarkets();
      handleFormClose();
    } catch (error) {
      console.error('Ошибка при сохранении супермаркета:', error);
      setSnackbar({ open: true, message: 'Ошибка при сохранении супермаркета', severity: 'error' });
    }
  };

  const handleDeleteConfirmOpen = (supermarket) => {
    setSelectedSupermarket(supermarket);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirmClose = () => {
    setDeleteConfirmOpen(false);
    setSelectedSupermarket(null);
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/supermarkets/${selectedSupermarket.id}`);
      setSnackbar({ open: true, message: 'Супермаркет удален успешно', severity: 'success' });
      fetchSupermarkets();
      handleDeleteConfirmClose();
    } catch (error) {
      console.error('Ошибка при удалении супермаркета:', error);
      setSnackbar({ open: true, message: 'Ошибка при удалении супермаркета', severity: 'error' });
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

      {/* Содержимое панели супермаркетов */}
      <div style={{ flexGrow: 1, padding: '16px' }}>
        <Typography variant="h4" gutterBottom>
          Supermarkets
        </Typography>

        <Button variant="contained" color="primary" startIcon={<FiPlus />} onClick={() => handleFormOpen()}>
          Добавить супермаркет
        </Button>

        <Paper sx={{ width: '100%', overflow: 'hidden', marginTop: 2 }}>
          <TableContainer>
            <Table stickyHeader aria-label="supermarkets table">
              <TableHead>
                <TableRow>
                  <TableCell>Название</TableCell>
                  <TableCell>Адрес</TableCell>
                  <TableCell align="right">Действия</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {supermarkets.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((supermarket) => (
                  <TableRow hover key={supermarket.id}>
                    <TableCell>{supermarket.name}</TableCell>
                    <TableCell>{supermarket.address}</TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => handleFormOpen(supermarket)}>
                        <FiEdit2 />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteConfirmOpen(supermarket)}>
                        <FiTrash2 />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {supermarkets.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      Нет данных
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={supermarkets.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>

        {/* Диалоговая форма добавления/редактирования */}
        <Dialog open={formOpen} onClose={handleFormClose}>
          <DialogTitle>{selectedSupermarket ? 'Редактировать супермаркет' : 'Добавить супермаркет'}</DialogTitle>
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
              <Select
                margin="dense"
                label="Адрес"
                fullWidth
                required
                value={formData.addressId}
                onChange={(e) => setFormData({ ...formData, addressId: e.target.value })}
                displayEmpty
              >
                <MenuItem value="" disabled>
                  Выберите адрес
                </MenuItem>
                {addresses.map((address) => (
                  <MenuItem key={address.id} value={address.id}>
                    {`${address.street}, ${address.city}`}
                  </MenuItem>
                ))}
              </Select>
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
          <DialogTitle>Удалить супермаркет?</DialogTitle>
          <DialogContent>
            <Typography>Вы уверены, что хотите удалить супермаркет "{selectedSupermarket?.name}"?</Typography>
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

export default SupermarketPanel;
