// ImagePanel.js

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
  Avatar,
} from '@mui/material';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import AdminNavigation from './AdminNavigation';
import api from '../../services/api';

function ImagePanel({ setActivePanel }) {
  const [images, setImages] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Пагинация
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [formOpen, setFormOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [formData, setFormData] = useState({
    obrazek: null,
    nazev: '',
    typ: '',
    format_id_formatu: '',
    produkt_id_produktu: '',
  });
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await api.get('/api/images');
      setImages(response);
      setLoading(false);
    } catch (error) {
      console.error('Ошибка при загрузке изображений:', error);
      setSnackbar({ open: true, message: 'Ошибка при загрузке изображений', severity: 'error' });
      setLoading(false);
    }
  };

  const handleFormOpen = (image = null) => {
    setSelectedImage(image);
    setFormData(
      image
        ? {
            obrazek: null, // Не загружаем изображение при редактировании
            nazev: image.nazev,
            typ: image.typ,
            format_id_formatu: image.format_id_formatu,
            produkt_id_produktu: image.produkt_id_produktu,
          }
        : { obrazek: null, nazev: '', typ: '', format_id_formatu: '', produkt_id_produktu: '' }
    );
    setFormOpen(true);
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setSelectedImage(null);
    setFormData({ obrazek: null, nazev: '', typ: '', format_id_formatu: '', produkt_id_produktu: '' });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = new FormData();
      if (!selectedImage) {
        dataToSend.append('obrazek', formData.obrazek);
      }
      dataToSend.append('nazev', formData.nazev);
      dataToSend.append('typ', formData.typ);
      dataToSend.append('format_id_formatu', parseInt(formData.format_id_formatu, 10));
      dataToSend.append('produkt_id_produktu', parseInt(formData.produkt_id_produktu, 10));

      if (selectedImage) {
        await api.put(`/api/images/${selectedImage.id}`, dataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setSnackbar({ open: true, message: 'Изображение обновлено успешно', severity: 'success' });
      } else {
        await api.post('/api/images', dataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setSnackbar({ open: true, message: 'Изображение добавлено успешно', severity: 'success' });
      }
      fetchImages();
      handleFormClose();
    } catch (error) {
      console.error('Ошибка при сохранении изображения:', error);
      const errorMessage = error.response?.data || 'Ошибка при сохранении изображения';
      setSnackbar({ open: true, message: errorMessage, severity: 'error' });
    }
  };

  const handleDeleteConfirmOpen = (image) => {
    setSelectedImage(image);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirmClose = () => {
    setDeleteConfirmOpen(false);
    setSelectedImage(null);
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/api/images/${selectedImage.id}`);
      setSnackbar({ open: true, message: 'Изображение удалено успешно', severity: 'success' });
      fetchImages();
      handleDeleteConfirmClose();
    } catch (error) {
      console.error('Ошибка при удалении изображения:', error);
      const errorMessage = error.response?.data || 'Ошибка при удалении изображения';
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

      {/* Содержимое панели изображений */}
      <div style={{ flexGrow: 1, padding: '16px' }}>
        <Typography variant="h4" gutterBottom>
          Изображения
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<FiPlus />}
          onClick={() => handleFormOpen()}
          style={{ marginBottom: '16px' }}
        >
          Добавить изображение
        </Button>

        <Paper sx={{ width: '100%', overflow: 'hidden', marginTop: 2 }}>
          <TableContainer>
            <Table stickyHeader aria-label="images table">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Изображение</TableCell>
                  <TableCell>Название</TableCell>
                  <TableCell>Тип</TableCell>
                  <TableCell>ID Формата</TableCell>
                  <TableCell>ID Продукта</TableCell>
                  <TableCell align="right">Действия</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {images.length > 0 ? (
                  images.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((image) => (
                    <TableRow hover key={image.id}>
                      <TableCell>{image.id}</TableCell>
                      <TableCell>
                        {image.obrazek ? (
                          <Avatar variant="square" src={`data:image/jpeg;base64,${image.obrazek}`} alt={image.nazev} />
                        ) : (
                          'Нет изображения'
                        )}
                      </TableCell>
                      <TableCell>{image.nazev}</TableCell>
                      <TableCell>{image.typ}</TableCell>
                      <TableCell>{image.format_id_formatu}</TableCell>
                      <TableCell>{image.produkt_id_produktu}</TableCell>
                      <TableCell align="right">
                        <IconButton onClick={() => handleFormOpen(image)} color="primary">
                          <FiEdit2 />
                        </IconButton>
                        <IconButton onClick={() => handleDeleteConfirmOpen(image)} color="secondary">
                          <FiTrash2 />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      Нет данных
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={images.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </Paper>

        {/* Форма добавления/редактирования изображения */}
        <Dialog open={formOpen} onClose={handleFormClose} fullWidth maxWidth="sm">
          <DialogTitle>{selectedImage ? 'Редактировать изображение' : 'Добавить изображение'}</DialogTitle>
          <form onSubmit={handleFormSubmit}>
            <DialogContent>
              {!selectedImage && (
                <Button
                  variant="contained"
                  component="label"
                  fullWidth
                  style={{ marginBottom: '16px' }}
                >
                  Загрузить изображение
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => setFormData({ ...formData, obrazek: e.target.files[0] })}
                  />
                </Button>
              )}
              {selectedImage && (
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Изображение не может быть изменено
                </Typography>
              )}
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
                label="ID Формата"
                type="number"
                fullWidth
                required
                value={formData.format_id_formatu}
                onChange={(e) => setFormData({ ...formData, format_id_formatu: e.target.value })}
              />
              <TextField
                margin="dense"
                label="ID Продукта"
                type="number"
                fullWidth
                required
                value={formData.produkt_id_produktu}
                onChange={(e) => setFormData({ ...formData, produkt_id_produktu: e.target.value })}
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
          <DialogTitle>Удалить изображение?</DialogTitle>
          <DialogContent>
            <Typography>
              Вы уверены, что хотите удалить изображение с ID {selectedImage?.id}?
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

export default ImagePanel;
