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
  const [formData, setFormData] = useState({ name: '', email: '', addressId: '' });
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
      const response = await api.get('/api/supermarkets');
      setSupermarkets(response);
    } catch (error) {
      console.error('Ошибка при загрузке супермаркетов:', error);
    }
  };

  const fetchAddresses = async () => {
    try {
      const response = await api.get('/api/addresses');
      console.log(response);
      setAddresses(response);
    } catch (error) {
      console.error('Ошибка при загрузке адресов:', error);
    }
  };

  const handleFormOpen = (supermarket = null) => {
    setSelectedSupermarket(supermarket);
    setFormData(
      supermarket
        ? {
            name: supermarket.NAZEV,
            telefon: supermarket.TELEFON,
            email: supermarket.EMAIL,
            addressId: supermarket.ADRESA_ID_ADRESY,
          }
        : { name: '', email: '', addressId: '' }
    );
    setFormOpen(true);
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setSelectedSupermarket(null);
    setFormData({ name: '', email: '', addressId: '' });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedSupermarket) {
        await api.put(`/api/supermarkets/${selectedSupermarket.ID_SUPERMARKETU}`, formData);
        setSnackbar({ open: true, message: 'Супермаркет обновлен успешно', severity: 'success' });
      } else {
        await api.post('/api/supermarkets', formData);
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
      await api.delete(`/api/supermarkets/${selectedSupermarket.ID_SUPERMARKETU}`);
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
      <AdminNavigation setActivePanel={setActivePanel} />

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
                  <TableCell>EMAIL</TableCell>
                  <TableCell>TELEFON</TableCell>
                  <TableCell>Адрес</TableCell>
                  <TableCell align="right">Действия</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {supermarkets.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((supermarket) => (
                  <TableRow hover key={supermarket.ID_SUPERMARKETU}>
                    <TableCell>{supermarket.NAZEV}</TableCell>
                    <TableCell>{supermarket.EMAIL}</TableCell>
                    <TableCell>{supermarket.TELEFON}</TableCell>
                    <TableCell>{addresses.find((a) => a.idAdresy === supermarket.ADRESA_ID_ADRESY)?.mesto}</TableCell>
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
              <TextField
                autoFocus
                margin="dense"
                label="Название"
                type="text"
                fullWidth
                required
                value={formData.telefon}
                onChange={(e) => setFormData({ ...formData, telefon: e.target.value })}
              />
              <TextField
                margin="dense"
                label="Email"
                type="text"
                fullWidth
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <Select
                fullWidth
                value={formData.addressId}
                onChange={(e) => setFormData({ ...formData, addressId: e.target.value })}
              >
                <MenuItem value="">Выберите адрес</MenuItem>
                {addresses.map((address) => (
                  <MenuItem key={address.idAdresy} value={address.idAdresy}>
                    {address.mesto}
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
      </div>
    </div>
  );
}

export default SupermarketPanel;
