// HotovostPanel.js

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

function HotovostPanel({ setActivePanel }) {
  const [hotovosts, setHotovosts] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Пагинация
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [formOpen, setFormOpen] = useState(false);
  const [selectedHotovost, setSelectedHotovost] = useState(null);
  const [formData, setFormData] = useState({
    prijato: '',
    vraceno: '',
  });
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHotovosts();
  }, []);

  const fetchHotovosts = async () => {
    try {
      const response = await api.get('/api/hotovost');
      setHotovosts(response);
      setLoading(false);
    } catch (error) {
      console.error('Ошибка при загрузке платежей наличными:', error);
      setSnackbar({ open: true, message: 'Ошибка при загрузке платежей наличными', severity: 'error' });
      setLoading(false);
    }
  };

  const handleFormOpen = (hotovost = null) => {
    setSelectedHotovost(hotovost);
    setFormData(
      hotovost
        ? {
            prijato: hotovost.prijato,
            vraceno: hotovost.vraceno,
          }
        : { prijato: '', vraceno: '' }
    );
    setFormOpen(true);
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setSelectedHotovost(null);
    setFormData({ prijato: '', vraceno: '' });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        prijato: parseFloat(formData.prijato),
        vraceno: parseFloat(formData.vraceno),
      };

      if (selectedHotovost) {
        await api.put(`/api/hotovost/${selectedHotovost.idPlatby}`, dataToSend);
        setSnackbar({ open: true, message: 'Платеж наличными обновлен успешно', severity: 'success' });
      } else {
        await api.post('/api/hotovost', dataToSend);
        setSnackbar({ open: true, message: 'Платеж наличными добавлен успешно', severity: 'success' });
      }
      fetchHotovosts();
      handleFormClose();
    } catch (error) {
      console.error('Ошибка при сохранении платежа наличными:', error);
      const errorMessage = error.response?.data || 'Ошибка при сохранении платежа наличными';
      setSnackbar({ open: true, message: errorMessage, severity: 'error' });
    }
  };

  const handleDeleteConfirmOpen = (hotovost) => {
    setSelectedHotovost(hotovost);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirmClose = () => {
    setDeleteConfirmOpen(false);
    setSelectedHotovost(null);
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/api/hotovost/${selectedHotovost.idPlatby}`);
      setSnackbar({ open: true, message: 'Платеж наличными удален успешно', severity: 'success' });
      fetchHotovosts();
      handleDeleteConfirmClose();
    } catch (error) {
      console.error('Ошибка при удалении платежа наличными:', error);
      const errorMessage = error.response?.data || 'Ошибка при удалении платежа наличными';
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

      {/* Содержимое панели платежей наличными */}
      <div style={{ flexGrow: 1, padding: '16px' }}>
        <Typography variant="h4" gutterBottom>
          Платежи наличными
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<FiPlus />}
          onClick={() => handleFormOpen()}
          style={{ marginBottom: '16px' }}
        >
          Добавить платеж наличными
        </Button>

        <Paper sx={{ width: '100%', overflow: 'hidden', marginTop: 2 }}>
          <TableContainer>
            <Table stickyHeader aria-label="hotovost table">
              <TableHead>
                <TableRow>
                  <TableCell>ID Платежа</TableCell>
                  <TableCell>Принято</TableCell>
                  <TableCell>Возвращено</TableCell>
                  <TableCell align="right">Действия</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {hotovosts.length > 0 ? (
                  hotovosts
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((hotovost) => (
                      <TableRow hover key={hotovost.idPlatby}>
                        <TableCell>{hotovost.idPlatby}</TableCell>
                        <TableCell>{hotovost.prijato}</TableCell>
                        <TableCell>{hotovost.vraceno}</TableCell>
                        <TableCell align="right">
                          <IconButton onClick={() => handleFormOpen(hotovost)} color="primary">
                            <FiEdit2 />
                          </IconButton>
                          <IconButton onClick={() => handleDeleteConfirmOpen(hotovost)} color="secondary">
                            <FiTrash2 />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      Нет данных
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={hotovosts.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </Paper>

        {/* Форма добавления/редактирования */}
        <Dialog open={formOpen} onClose={handleFormClose} fullWidth maxWidth="sm">
          <DialogTitle>{selectedHotovost ? 'Редактировать платеж наличными' : 'Добавить платеж наличными'}</DialogTitle>
          <form onSubmit={handleFormSubmit}>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="Принято"
                type="number"
                fullWidth
                required
                value={formData.prijato}
                onChange={(e) => setFormData({ ...formData, prijato: parseFloat(e.target.value) })}
              />
              <TextField
                margin="dense"
                label="Возвращено"
                type="number"
                fullWidth
                required
                value={formData.vraceno}
                onChange={(e) => setFormData({ ...formData, vraceno: parseFloat(e.target.value) })}
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
          <DialogTitle>Удалить платеж наличными?</DialogTitle>
          <DialogContent>
            <Typography>
              Вы уверены, что хотите удалить платеж наличными с ID {selectedHotovost?.idPlatby}?
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

export default HotovostPanel;
