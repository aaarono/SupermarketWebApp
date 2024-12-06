// PositionPanel.js

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

function PositionPanel({ setActivePanel }) {
  const [positions, setPositions] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Пагинация
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [formOpen, setFormOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [formData, setFormData] = useState({
    nazev: '',
  });
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPositions();
  }, []);

  const fetchPositions = async () => {
    try {
      const response = await api.get('/api/positions');
      setPositions(response);
      setLoading(false);
    } catch (error) {
      console.error('Ошибка при загрузке позиций:', error);
      setSnackbar({ open: true, message: 'Ошибка при загрузке позиций', severity: 'error' });
      setLoading(false);
    }
  };

  const handleFormOpen = (position = null) => {
    setSelectedPosition(position);
    setFormData(
      position
        ? {
            nazev: position.nazev,
          }
        : { nazev: '' }
    );
    setFormOpen(true);
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setSelectedPosition(null);
    setFormData({ nazev: '' });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        nazev: formData.nazev,
      };

      if (selectedPosition) {
        await api.put(`/api/positions/${selectedPosition.ID_POZICE}`, dataToSend);
        setSnackbar({ open: true, message: 'Позиция обновлена успешно', severity: 'success' });
      } else {
        await api.post('/api/positions', dataToSend);
        setSnackbar({ open: true, message: 'Позиция добавлена успешно', severity: 'success' });
      }
      fetchPositions();
      handleFormClose();
    } catch (error) {
      console.error('Ошибка при сохранении позиции:', error);
      const errorMessage = error.response?.data || 'Ошибка при сохранении позиции';
      setSnackbar({ open: true, message: errorMessage, severity: 'error' });
    }
  };

  const handleDeleteConfirmOpen = (position) => {
    setSelectedPosition(position);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirmClose = () => {
    setDeleteConfirmOpen(false);
    setSelectedPosition(null);
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/api/positions/${selectedPosition.ID_POZICE}`);
      setSnackbar({ open: true, message: 'Позиция удалена успешно', severity: 'success' });
      fetchPositions();
      handleDeleteConfirmClose();
    } catch (error) {
      console.error('Ошибка при удалении позиции:', error);
      const errorMessage = error.response?.data || 'Ошибка при удалении позиции';
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

      {/* Содержимое панели позиций */}
      <div style={{ flexGrow: 1, padding: '16px' }}>
        <Typography variant="h4" gutterBottom>
          Позиции
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<FiPlus />}
          onClick={() => handleFormOpen()}
          style={{ marginBottom: '16px' }}
        >
          Добавить позицию
        </Button>

        <Paper sx={{ width: '100%', overflow: 'hidden', marginTop: 2 }}>
          <TableContainer>
            <Table stickyHeader aria-label="positions table">
              <TableHead>
                <TableRow>
                  <TableCell>ID Позиции</TableCell>
                  <TableCell>Название</TableCell>
                  <TableCell align="right">Действия</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {positions.length > 0 ? (
                  positions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((position) => (
                    <TableRow hover key={position.ID_POZICE}>
                      <TableCell>{position.ID_POZICE}</TableCell>
                      <TableCell>{position.nazev}</TableCell>
                      <TableCell align="right">
                        <IconButton onClick={() => handleFormOpen(position)} color="primary">
                          <FiEdit2 />
                        </IconButton>
                        <IconButton onClick={() => handleDeleteConfirmOpen(position)} color="secondary">
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
            count={positions.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </Paper>

        {/* Форма добавления/редактирования позиции */}
        <Dialog open={formOpen} onClose={handleFormClose} fullWidth maxWidth="sm">
          <DialogTitle>{selectedPosition ? 'Редактировать позицию' : 'Добавить позицию'}</DialogTitle>
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
          <DialogTitle>Удалить позицию?</DialogTitle>
          <DialogContent>
            <Typography>
              Вы уверены, что хотите удалить позицию с ID {selectedPosition?.ID_POZICE}?
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

export default PositionPanel;
