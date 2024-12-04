// src/components/Panels/PaymentPanel.js

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
  IconButton,
  Snackbar,
  Alert,
} from '@mui/material';
import { FiCheckCircle, FiXCircle } from 'react-icons/fi';
import AdminNavigation from './AdminNavigation';
import api from '../../services/api';

function PaymentPanel({ setActivePanel }) {
  const [payments, setPayments] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Пагинация
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await api.get('/payments');
      setPayments(response.data);
    } catch (error) {
      console.error('Ошибка при загрузке платежей:', error);
    }
  };

  const handleConfirmPayment = async (paymentId) => {
    try {
      await api.put(`/payments/${paymentId}/confirm`);
      setSnackbar({ open: true, message: 'Платеж подтвержден', severity: 'success' });
      fetchPayments();
    } catch (error) {
      console.error('Ошибка при подтверждении платежа:', error);
      setSnackbar({ open: true, message: 'Ошибка при подтверждении платежа', severity: 'error' });
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

      {/* Содержимое панели платежей */}
      <div style={{ flexGrow: 1, padding: '16px' }}>
        <Typography variant="h4" gutterBottom>
          Payments
        </Typography>

        <Paper sx={{ width: '100%', overflow: 'hidden', marginTop: 2 }}>
          <TableContainer>
            <Table stickyHeader aria-label="payments table">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Пользователь</TableCell>
                  <TableCell>Сумма</TableCell>
                  <TableCell>Статус</TableCell>
                  <TableCell align="right">Действия</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {payments.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((payment) => (
                  <TableRow hover key={payment.id}>
                    <TableCell>{payment.id}</TableCell>
                    <TableCell>{payment.userName}</TableCell>
                    <TableCell>{payment.amount}</TableCell>
                    <TableCell>{payment.status}</TableCell>
                    <TableCell align="right">
                      {payment.status !== 'Confirmed' && (
                        <IconButton onClick={() => handleConfirmPayment(payment.id)}>
                          <FiCheckCircle />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {payments.length === 0 && (
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
            count={payments.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>

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
