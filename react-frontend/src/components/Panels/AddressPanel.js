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
    ulice: '',
    mesto: '',
    psc: '',
    cisloPopisne: '',
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Пагинация
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const response = await api.get('/api/addresses');
      console.log(response);
      setAddresses(response);
    } catch (error) {
      console.error('Ошибка при загрузке адресов:', error);
    }
  };

  const handleFormOpen = (address = null) => {
    setSelectedAddress(address);
    setFormData(
      address
        ? {
            ulice: address.ulice,
            mesto: address.mesto,
            psc: address.psc,
            cisloPopisne: address.cisloPopisne,
          }
        : { ulice: '', mesto: '', psc: '', cisloPopisne: '' }
    );
    setFormOpen(true);
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setSelectedAddress(null);
    setFormData({ ulice: '', mesto: '', psc: '', cisloPopisne: '' });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedAddress) {
        await api.put(`/api/addresses/${selectedAddress.idAdresy}`, formData);
        setSnackbar({ open: true, message: 'Адрес обновлен успешно', severity: 'success' });
      } else {
        await api.post('/api/addresses', formData);
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
      await api.delete(`/api/addresses/${selectedAddress.idAdresy}`);
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
                  <TableCell>id</TableCell>
                  <TableCell>Улица</TableCell>
                  <TableCell>Город</TableCell>
                  <TableCell>Почтовый индекс</TableCell>
                  <TableCell>cislo Popisne</TableCell>
                  <TableCell align="right">Действия</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {addresses.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((address) => (
                  <TableRow hover key={address.idAdresy}>
                    <TableCell>{address.idAdresy}</TableCell>
                    <TableCell>{address.ulice}</TableCell>
                    <TableCell>{address.mesto}</TableCell>
                    <TableCell>{address.psc}</TableCell>
                    <TableCell>{address.cisloPopisne}</TableCell>
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
                value={formData.ulice}
                onChange={(e) => setFormData({ ...formData, ulice: e.target.value })}
              />
              <TextField
                margin="dense"
                label="Город"
                type="text"
                fullWidth
                required
                value={formData.mesto}
                onChange={(e) => setFormData({ ...formData, mesto: e.target.value })}
              />
              <TextField
                margin="dense"
                label="Почтовый индекс"
                type="text"
                fullWidth
                required
                value={formData.psc}
                onChange={(e) => setFormData({ ...formData, psc: e.target.value })}
              />
              <TextField
                margin="dense"
                label="cisloPopisne"
                type="text"
                fullWidth
                required
                value={formData.cisloPopisne}
                onChange={(e) => setFormData({ ...formData, cisloPopisne: e.target.value })}
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
              Вы уверены, что хотите удалить адрес "{selectedAddress?.ulice}, {selectedAddress?.mesto}"?
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
