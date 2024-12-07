// src/components/Panels/OrderPanel.js

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
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import AdminNavigation from './AdminNavigation';
import api from '../../services/api';

function OrderPanel({ setActivePanel }) {
  const [orders, setOrders] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Пагинация
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/api/orders');
      setOrders(response);
    } catch (error) {
      console.error('Ошибка при загрузке заказов:', error);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.put(`/api/orders/${orderId}`, { status: newStatus });
      setSnackbar({ open: true, message: 'Статус заказа обновлен', severity: 'success' });
      fetchOrders();
    } catch (error) {
      console.error('Ошибка при обновлении статуса заказа:', error);
      setSnackbar({ open: true, message: 'Ошибка при обновлении статуса заказа', severity: 'error' });
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

      {/* Содержимое панели заказов */}
      <div style={{ flexGrow: 1, padding: '16px' }}>
        <Typography variant="h4" gutterBottom>
          Orders
        </Typography>

        <Paper sx={{ width: '100%', overflow: 'hidden', marginTop: 2 }}>
          <TableContainer>
            <Table stickyHeader aria-label="orders table">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Покупатель</TableCell>
                  <TableCell>Дата заказа</TableCell>
                  <TableCell>Статус</TableCell>
                  <TableCell>Сумма</TableCell>
                  <TableCell align="right">Действия</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((order) => (
                  <TableRow hover key={order.id}>
                    <TableCell>{order.id}</TableCell>
                    <TableCell>{order.customerName}</TableCell>
                    <TableCell>{order.orderDate}</TableCell>
                    <TableCell>{order.status}</TableCell>
                    <TableCell>{order.totalAmount}</TableCell>
                    <TableCell align="right">
                      {/* Здесь можно добавить кнопки для изменения статуса или просмотра деталей */}
                      <IconButton onClick={() => handleStatusChange(order.id, 'Shipped')}>
                        <FiEdit2 />
                      </IconButton>
                      {/* Удаление заказов обычно не практикуется, но можно добавить при необходимости */}
                    </TableCell>
                  </TableRow>
                ))}
                {orders.length === 0 && (
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
            count={orders.length}
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

export default OrderPanel;
