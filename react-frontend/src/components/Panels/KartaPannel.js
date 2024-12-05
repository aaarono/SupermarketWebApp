// KartaPanel.js

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

function KartaPanel({ setActivePanel }) {
  const [karty, setKarty] = useState([]); // Инициализируем как пустой массив
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Пагинация
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [formOpen, setFormOpen] = useState(false);
  const [selectedKarta, setSelectedKarta] = useState(null);
  const [formData, setFormData] = useState({
    cisloKarty: '',
  });
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchKarty();
  }, []);

  const fetchKarty = async () => {
    try {
      const response = await api.get('/api/karta');
      console.log('API Response:', response); // Добавляем для отладки
      // Проверяем, существует ли response.data и является ли массивом
      if (response && response.data && Array.isArray(response.data)) {
        setKarty(response.data);
      } else if (response && Array.isArray(response)) {
        // В случае, если API возвращает массив напрямую
        setKarty(response);
      } else {
        // Если данные не соответствуют ожидаемому формату
        console.error('Неправильный формат данных от API:', response);
        setKarty([]);
      }
      setLoading(false);
    } catch (error) {
      console.error('Ошибка при загрузке карт:', error);
      setSnackbar({ open: true, message: 'Ошибка при загрузке карт', severity: 'error' });
      setLoading(false);
    }
  };

  const handleFormOpen = (karta = null) => {
    setSelectedKarta(karta);
    setFormData(
      karta
        ? {
            cisloKarty: karta.cisloKarty,
          }
        : { cisloKarty: '' }
    );
    setFormOpen(true);
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setSelectedKarta(null);
    setFormData({ cisloKarty: '' });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        cisloKarty: formData.cisloKarty,
      };

      if (selectedKarta) {
        await api.put(`/api/karta/${selectedKarta.idPlatby}`, dataToSend);
        setSnackbar({ open: true, message: 'Карта успешно обновлена', severity: 'success' });
      } else {
        await api.post('/api/karta', dataToSend);
        setSnackbar({ open: true, message: 'Карта успешно добавлена', severity: 'success' });
      }
      fetchKarty();
      handleFormClose();
    } catch (error) {
      console.error('Ошибка при сохранении карты:', error);
      const errorMessage = error.response?.data || 'Ошибка при сохранении карты';
      setSnackbar({ open: true, message: errorMessage, severity: 'error' });
    }
  };

  const handleDeleteConfirmOpen = (karta) => {
    setSelectedKarta(karta);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirmClose = () => {
    setDeleteConfirmOpen(false);
    setSelectedKarta(null);
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/api/karta/${selectedKarta.idPlatby}`);
      setSnackbar({ open: true, message: 'Карта успешно удалена', severity: 'success' });
      fetchKarty();
      handleDeleteConfirmClose();
    } catch (error) {
      console.error('Ошибка при удалении карты:', error);
      const errorMessage = error.response?.data || 'Ошибка при удалении карты';
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

      {/* Содержимое панели карт */}
      <div style={{ flexGrow: 1, padding: '16px' }}>
        <Typography variant="h4" gutterBottom>
          Карты
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<FiPlus />}
          onClick={() => handleFormOpen()}
          style={{ marginBottom: '16px' }}
        >
          Добавить карту
        </Button>

        <Paper sx={{ width: '100%', overflow: 'hidden', marginTop: 2 }}>
          <TableContainer>
            <Table stickyHeader aria-label="karta table">
              <TableHead>
                <TableRow>
                  <TableCell>ID Карты</TableCell>
                  <TableCell>Номер карты</TableCell>
                  <TableCell align="right">Действия</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {karty.length > 0 ? (
                  karty
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((karta) => (
                      <TableRow hover key={karta.idPlatby}>
                        <TableCell>{karta.idPlatby}</TableCell>
                        <TableCell>{karta.cisloKarty}</TableCell>
                        <TableCell align="right">
                          <IconButton onClick={() => handleFormOpen(karta)} color="primary">
                            <FiEdit2 />
                          </IconButton>
                          <IconButton onClick={() => handleDeleteConfirmOpen(karta)} color="secondary">
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
            count={karty.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </Paper>

        {/* Форма добавления/редактирования */}
        <Dialog open={formOpen} onClose={handleFormClose} fullWidth maxWidth="sm">
          <DialogTitle>{selectedKarta ? 'Редактировать карту' : 'Добавить карту'}</DialogTitle>
          <form onSubmit={handleFormSubmit}>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="Номер карты"
                type="text"
                fullWidth
                required
                value={formData.cisloKarty}
                onChange={(e) => setFormData({ ...formData, cisloKarty: e.target.value })}
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

        {/* Подтверждение удаления */}
        <Dialog open={deleteConfirmOpen} onClose={handleDeleteConfirmClose}>
          <DialogTitle>Удалить карту?</DialogTitle>
          <DialogContent>
            <Typography>
              Вы уверены, что хотите удалить карту с ID {selectedKarta?.idPlatby}?
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

export default KartaPanel;
