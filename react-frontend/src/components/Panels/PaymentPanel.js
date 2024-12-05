// PaymentPanel.js

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

function PaymentPanel({ setActivePanel }) {
  const [payments, setPayments] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Пагинация
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [formOpen, setFormOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [formData, setFormData] = useState({
    suma: '',
    datum: '',
    typ: '',
    objednavkaId: '',
  });
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await api.get('/api/payments');
      setPayments(response);
      setLoading(false);
    } catch (error) {
      console.error('Ошибка при загрузке платежей:', error);
      setSnackbar({ open: true, message: 'Ошибка при загрузке платежей', severity: 'error' });
      setLoading(false);
    }
  };

  const handleFormOpen = (payment = null) => {
    setSelectedPayment(payment);
    setFormData(
      payment
        ? {
            suma: payment.suma,
            datum: payment.datum ? new Date(payment.datum).toISOString().substr(0, 10) : '',
            typ: payment.typ,
            objednavkaId: payment.objednavkaId,
          }
        : { suma: '', datum: '', typ: '', objednavkaId: '' }
    );
    setFormOpen(true);
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setSelectedPayment(null);
    setFormData({ suma: '', datum: '', typ: '', objednavkaId: '' });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        suma: formData.suma,
        datum: formData.datum,
        typ: formData.typ,
        objednavkaId: formData.objednavkaId,
      };

      if (selectedPayment) {
        await api.put(`/api/payments/${selectedPayment.id}`, dataToSend);
        setSnackbar({ open: true, message: 'Платеж обновлен успешно', severity: 'success' });
      } else {
        await api.post('/api/payments', dataToSend);
        setSnackbar({ open: true, message: 'Платеж добавлен успешно', severity: 'success' });
      }
      fetchPayments();
      handleFormClose();
    } catch (error) {
      console.error('Ошибка при сохранении платежа:', error);
      const errorMessage = error.response?.data || 'Ошибка при сохранении платежа';
      setSnackbar({ open: true, message: errorMessage, severity: 'error' });
    }
  };

  const handleDeleteConfirmOpen = (payment) => {
    setSelectedPayment(payment);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirmClose = () => {
    setDeleteConfirmOpen(false);
    setSelectedPayment(null);
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/api/payments/${selectedPayment.id}`);
      setSnackbar({ open: true, message: 'Платеж удален успешно', severity: 'success' });
      fetchPayments();
      handleDeleteConfirmClose();
    } catch (error) {
      console.error('Ошибка при удалении платежа:', error);
      const errorMessage = error.response?.data || 'Ошибка при удалении платежа';
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

      {/* Содержимое панели платежей */}
      <div style={{ flexGrow: 1, padding: '16px' }}>
        <Typography variant="h4" gutterBottom>
          Платежи
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<FiPlus />}
          onClick={() => handleFormOpen()}
          style={{ marginBottom: '16px' }}
        >
          Добавить платеж
        </Button>

        <Paper sx={{ width: '100%', overflow: 'hidden', marginTop: 2 }}>
          <TableContainer>
            <Table stickyHeader aria-label="payments table">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Сумма</TableCell>
                  <TableCell>Дата</TableCell>
                  <TableCell>Тип</TableCell>
                  <TableCell>ID Заказа</TableCell>
                  <TableCell align="right">Действия</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {payments.length > 0 ? (
                  payments.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((payment) => (
                    <TableRow hover key={payment.id}>
                      <TableCell>{payment.id}</TableCell>
                      <TableCell>{payment.suma}</TableCell>
                      <TableCell>{new Date(payment.datum).toLocaleDateString()}</TableCell>
                      <TableCell>{payment.typ}</TableCell>
                      <TableCell>{payment.objednavkaId}</TableCell>
                      <TableCell align="right">
                        <IconButton onClick={() => handleFormOpen(payment)} color="primary">
                          <FiEdit2 />
                        </IconButton>
                        <IconButton onClick={() => handleDeleteConfirmOpen(payment)} color="secondary">
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
            count={payments.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </Paper>
        <Dialog open={formOpen} onClose={handleFormClose} fullWidth maxWidth="sm">
          <DialogTitle>{selectedPayment ? 'Редактировать платеж' : 'Добавить платеж'}</DialogTitle>
          <form onSubmit={handleFormSubmit}>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="Сумма"
                type="number"
                fullWidth
                required
                value={formData.suma}
                onChange={(e) => setFormData({ ...formData, suma: parseFloat(e.target.value) })}
              />
              <TextField
                margin="dense"
                label="Дата"
                type="date"
                fullWidth
                required
                InputLabelProps={{
                  shrink: true,
                }}
                value={formData.datum}
                onChange={(e) => setFormData({ ...formData, datum: e.target.value })}
              />
              <TextField
                margin="dense"
                label="Тип"
                type="text"
                fullWidth
                required
                value={formData.typ}
                onChange={(e) => setFormData({ ...formData, typ: e.target.value })}
              />
              <TextField
                margin="dense"
                label="ID Заказа"
                type="number"
                fullWidth
                required
                value={formData.objednavkaId}
                onChange={(e) => setFormData({ ...formData, objednavkaId: parseInt(e.target.value, 10) })}
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

        <Dialog open={deleteConfirmOpen} onClose={handleDeleteConfirmClose}>
          <DialogTitle>Удалить платеж?</DialogTitle>
          <DialogContent>
            <Typography>
              Вы уверены, что хотите удалить платеж с ID {selectedPayment?.id}?
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

export default PaymentPanel;