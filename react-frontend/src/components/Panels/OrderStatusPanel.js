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

function OrderStatusPanel({ setActivePanel }) {
  const [statuses, setStatuses] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Пагинация
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [formOpen, setFormOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [formData, setFormData] = useState({
    NAZEV: '',
  });
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatuses();
  }, []);

  // Получение всех статусов
  const fetchStatuses = async () => {
    try {
      const response = await api.get('/api/order-statuses'); // Эндпоинт для получения всех статусов
      setStatuses(response);
      setLoading(false);
    } catch (error) {
      console.error('Ошибка при загрузке статусов заказов:', error);
      setSnackbar({ open: true, message: 'Ошибка при загрузке статусов заказов', severity: 'error' });
      setLoading(false);
    }
  };

  // Открытие формы добавления или редактирования
  const handleFormOpen = (status = null) => {
    setSelectedStatus(status);
    setFormData(
      status
        ? {
            NAZEV: status.NAZEV,
          }
        : { NAZEV: '' }
    );
    setFormOpen(true);
  };

  // Закрытие формы
  const handleFormClose = () => {
    setFormOpen(false);
    setSelectedStatus(null);
    setFormData({ NAZEV: '' });
  };

  // Сохранение нового или обновленного статуса
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        NAZEV: formData.NAZEV,
      };
      console.log(dataToSend)
      if (selectedStatus) {
        await api.put(`/api/order-statuses/${selectedStatus.ID_STATUS}`, dataToSend); // Обновление
        setSnackbar({ open: true, message: 'Статус обновлен успешно', severity: 'success' });
      } else {
        await api.post('/api/order-statuses', dataToSend); // Создание
        setSnackbar({ open: true, message: 'Статус добавлен успешно', severity: 'success' });
      }
      fetchStatuses();
      handleFormClose();
    } catch (error) {
      console.error('Ошибка при сохранении статуса:', error);
      const errorMessage = error.response?.data || 'Ошибка при сохранении статуса';
      setSnackbar({ open: true, message: errorMessage, severity: 'error' });
    }
  };

  // Открытие подтверждения удаления
  const handleDeleteConfirmOpen = (status) => {
    setSelectedStatus(status);
    setDeleteConfirmOpen(true);
  };

  // Закрытие подтверждения удаления
  const handleDeleteConfirmClose = () => {
    setDeleteConfirmOpen(false);
    setSelectedStatus(null);
  };

  // Удаление статуса
  const handleDelete = async () => {
    try {
      await api.delete(`/api/order-statuses/${selectedStatus.ID_STATUS}`); // Удаление
      setSnackbar({ open: true, message: 'Статус удален успешно', severity: 'success' });
      fetchStatuses();
      handleDeleteConfirmClose();
    } catch (error) {
      console.error('Ошибка при удалении статуса:', error);
      const errorMessage = error.response?.data || 'Ошибка при удалении статуса';
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
      <AdminNavigation setActivePanel={setActivePanel} />
      <div style={{ flexGrow: 1, padding: '16px' }}>
        <Typography variant="h4" gutterBottom>
          Статусы заказов
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<FiPlus />}
          onClick={() => handleFormOpen()}
          style={{ marginBottom: '16px' }}
        >
          Добавить статус
        </Button>
        <Paper sx={{ width: '100%', overflow: 'hidden', marginTop: 2 }}>
          <TableContainer>
            <Table stickyHeader aria-label="order statuses table">
              <TableHead>
                <TableRow>
                  <TableCell>ID Статуса</TableCell>
                  <TableCell>Название статуса</TableCell>
                  <TableCell align="right">Действия</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {statuses.length > 0 ? (
                  statuses.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((status) => (
                    <TableRow hover key={status.ID_STATUS}>
                      <TableCell>{status.ID_STATUS}</TableCell>
                      <TableCell>{status.NAZEV}</TableCell>
                      <TableCell align="right">
                        <IconButton onClick={() => handleFormOpen(status)} color="primary">
                          <FiEdit2 />
                        </IconButton>
                        <IconButton onClick={() => handleDeleteConfirmOpen(status)} color="secondary">
                          <FiTrash2 />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
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
            count={statuses.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </Paper>
        <Dialog open={formOpen} onClose={handleFormClose} fullWidth maxWidth="sm">
          <DialogTitle>{selectedStatus ? 'Редактировать статус' : 'Добавить статус'}</DialogTitle>
          <form onSubmit={handleFormSubmit}>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="Название статуса"
                type="text"
                fullWidth
                required
                value={formData.NAZEV}
                onChange={(e) => setFormData({ ...formData, NAZEV: e.target.value })}
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
          <DialogTitle>Удалить статус?</DialogTitle>
          <DialogContent>
            <Typography>
              Вы уверены, что хотите удалить статус с ID {selectedStatus?.ID_STATUS}?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteConfirmClose}>Отмена</Button>
            <Button onClick={handleDelete} color="secondary">
              Удалить
            </Button>
          </DialogActions>
        </Dialog>
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

export default OrderStatusPanel;
