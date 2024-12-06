// FormatPanel.js

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

function FormatPanel({ setActivePanel }) {
  const [formats, setFormats] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Пагинация
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [formOpen, setFormOpen] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState(null);
  const [formData, setFormData] = useState({
    ROZIRENI: '',
  });
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFormats();
  }, []);

  const fetchFormats = async () => {
    try {
      const response = await api.get('/api/image-formats');
      setFormats(response);
      setLoading(false);
    } catch (error) {
      console.error('Ошибка при загрузке форматов:', error);
      setSnackbar({ open: true, message: 'Ошибка при загрузке форматов', severity: 'error' });
      setLoading(false);
    }
  };

  const handleFormOpen = (format = null) => {
    setSelectedFormat(format);
    setFormData(
      format
        ? {
            ROZIRENI: format.ROZIRENI,
          }
        : { ROZIRENI: '' }
    );
    setFormOpen(true);
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setSelectedFormat(null);
    setFormData({ ROZIRENI: '' });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        ROZIRENI: formData.ROZIRENI,
      };

      if (selectedFormat) {
        await api.put(`/api/formats/${selectedFormat.ID_FORMATU}`, dataToSend);
        setSnackbar({ open: true, message: 'Формат обновлен успешно', severity: 'success' });
      } else {
        await api.post('/api/formats', dataToSend);
        setSnackbar({ open: true, message: 'Формат добавлен успешно', severity: 'success' });
      }
      fetchFormats();
      handleFormClose();
    } catch (error) {
      console.error('Ошибка при сохранении формата:', error);
      const errorMessage = error.response?.data || 'Ошибка при сохранении формата';
      setSnackbar({ open: true, message: errorMessage, severity: 'error' });
    }
  };

  const handleDeleteConfirmOpen = (format) => {
    setSelectedFormat(format);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirmClose = () => {
    setDeleteConfirmOpen(false);
    setSelectedFormat(null);
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/api/formats/${selectedFormat.ID_FORMATU}`);
      setSnackbar({ open: true, message: 'Формат удален успешно', severity: 'success' });
      fetchFormats();
      handleDeleteConfirmClose();
    } catch (error) {
      console.error('Ошибка при удалении формата:', error);
      const errorMessage = error.response?.data || 'Ошибка при удалении формата';
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

      {/* Содержимое панели форматов */}
      <div style={{ flexGrow: 1, padding: '16px' }}>
        <Typography variant="h4" gutterBottom>
          Форматы
        </Typography>
        {/* <Button
          variant="contained"
          color="primary"
          startIcon={<FiPlus />}
          onClick={() => handleFormOpen()}
          style={{ marginBottom: '16px' }}
        >
          Добавить формат
        </Button> */}

        <Paper sx={{ width: '100%', overflow: 'hidden', marginTop: 2 }}>
          <TableContainer>
            <Table stickyHeader aria-label="formats table">
              <TableHead>
                <TableRow>
                  <TableCell>ID Формата</TableCell>
                  <TableCell>Разрешение</TableCell>
                  {/* <TableCell align="right">Действия</TableCell> */}
                </TableRow>
              </TableHead>
              <TableBody>
                {formats.length > 0 ? (
                  formats.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((format) => (
                    <TableRow hover key={format.ID_FORMATU}>
                      <TableCell>{format.ID_FORMATU}</TableCell>
                      <TableCell>{format.ROZIRENI}</TableCell>
                      {/* <TableCell align="right">
                        <IconButton onClick={() => handleFormOpen(format)} color="primary">
                          <FiEdit2 />
                        </IconButton>
                        <IconButton onClick={() => handleDeleteConfirmOpen(format)} color="secondary">
                          <FiTrash2 />
                        </IconButton>
                      </TableCell> */}
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
            count={formats.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </Paper>

        {/* Форма добавления/редактирования формата */}
        {/* <Dialog open={formOpen} onClose={handleFormClose} fullWidth maxWidth="sm">
          <DialogTitle>{selectedFormat ? 'Редактировать формат' : 'Добавить формат'}</DialogTitle>
          <form onSubmit={handleFormSubmit}>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="Разрешение"
                type="text"
                fullWidth
                required
                value={formData.ROZIRENI}
                onChange={(e) => setFormData({ ...formData, ROZIRENI: e.target.value })}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleFormClose}>Отмена</Button>
              <Button type="submit" color="primary">
                Сохранить
              </Button>
            </DialogActions>
          </form>
        </Dialog> */}

        {/* Диалог подтверждения удаления */}
        {/* <Dialog open={deleteConfirmOpen} onClose={handleDeleteConfirmClose}>
          <DialogTitle>Удалить формат?</DialogTitle>
          <DialogContent>
            <Typography>
              Вы уверены, что хотите удалить формат с ID {selectedFormat?.ID_FORMATU}?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteConfirmClose}>Отмена</Button>
            <Button onClick={handleDelete} color="secondary">
              Удалить
            </Button>
          </DialogActions>
        </Dialog> */}

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

export default FormatPanel;
