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
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from '@mui/material';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import AdminNavigation from './AdminNavigation';
import api from '../../services/api';

function ImagePanel({ setActivePanel }) {
  const [images, setImages] = useState([]);
  const [products, setProducts] = useState([]);
  const [formats, setFormats] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Пагинация
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [formOpen, setFormOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [formData, setFormData] = useState({
    obrazek: null,
    nazev: '',
    typ: '',
    format_id_formatu: '',
    produkt_id_produktu: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchImages();
    fetchProducts();
    fetchFormats();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await api.get('/api/images');
      console.log(response)
      setImages(response);
      setLoading(false);
    } catch (error) {
      console.error('Ошибка при загрузке изображений:', error);
      setSnackbar({ open: true, message: 'Ошибка при загрузке изображений', severity: 'error' });
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await api.get('/api/products');
      console.log(response)
      setProducts(response);
    } catch (error) {
      console.error('Ошибка при загрузке продуктов:', error);
    }
  };

  const fetchFormats = async () => {
    try {
      const response = await api.get('/api/image-formats');
      console.log(response)
      setFormats(response);
    } catch (error) {
      console.error('Ошибка при загрузке форматов:', error);
    }
  };

  const handleFormOpen = (image = null) => {
    setSelectedImage(image);
    setFormData(
      image
        ? {
            obrazek: null,
            nazev: image.NAZEV,
            typ: image.FORMAT_ID_FORMATU || '', // ID формата выставляется в тип
            format_id_formatu: image.FORMAT_ID_FORMATU || '',
            produkt_id_produktu: image.PRODUKT_ID_PRODUKTU || '',
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
  
    if (!formData.format_id_formatu) {
      setSnackbar({ open: true, message: 'Выберите тип изображения.', severity: 'error' });
      return;
    }
  
    // Разрешаем пустой ID продукта только для изображения с ID 1
    if (!formData.produkt_id_produktu && (!selectedImage || selectedImage.ID_OBRAZKU !== 1)) {
      setSnackbar({ open: true, message: 'Укажите продукт для изображения.', severity: 'error' });
      return;
    }
  
    try {
      const dataToSend = new FormData();
      if (formData.obrazek) {
        dataToSend.append('obrazek', formData.obrazek);
      }
      dataToSend.append('nazev', formData.nazev || '');
      dataToSend.append('format_id_formatu', formData.format_id_formatu || '');
      dataToSend.append('produkt_id_produktu', formData.produkt_id_produktu || '');
  
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };
  
      if (selectedImage) {
        await api.put(`/api/images/${selectedImage.ID_OBRAZKU}`, dataToSend, config);
        setSnackbar({ open: true, message: 'Изображение обновлено успешно', severity: 'success' });
      } else {
        await api.post('/api/images', dataToSend, config);
        setSnackbar({ open: true, message: 'Изображение добавлено успешно', severity: 'success' });
      }
  
      fetchImages();
      handleFormClose();
    } catch (error) {
      console.error('Ошибка при сохранении изображения:', error);
      setSnackbar({ open: true, message: 'Ошибка при сохранении изображения', severity: 'error' });
    }
  };
  

  const handleDeleteConfirmOpen = (image) => {
    if (image.ID_OBRAZKU === 1) {
      setSnackbar({ open: true, message: 'Это изображение нельзя удалить.', severity: 'error' });
      return;
    }
    setSelectedImage(image);
    setDeleteConfirmOpen(true);
  };


  const handleDeleteConfirmClose = () => {
    setDeleteConfirmOpen(false);
    setSelectedImage(null);
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/api/images/${selectedImage.ID_OBRAZKU}`);
      setSnackbar({ open: true, message: 'Изображение удалено успешно', severity: 'success' });
      fetchImages();
      handleDeleteConfirmClose();
    } catch (error) {
      console.error('Ошибка при удалении изображения:', error);
      setSnackbar({ open: true, message: 'Ошибка при удалении изображения', severity: 'error' });
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

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
                    <TableRow hover key={image.ID_OBRAZKU}>
                      <TableCell>{image.ID_OBRAZKU}</TableCell>
                      <TableCell>{image.NAZEV}</TableCell>
                      <TableCell>{formats.find((f) => f.ID_FORMATU === image.FORMAT_ID_FORMATU)?.ROZIRENI || '—' }</TableCell>
                      <TableCell>{image.FORMAT_ID_FORMATU}</TableCell>
                      <TableCell>{products.find((p) => p.id === image.PRODUKT_ID_PRODUKTU)?.name || '—'}</TableCell>
                      <TableCell align="right">
                        <IconButton onClick={() => handleFormOpen(image)} color="primary">
                          <FiEdit2 />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDeleteConfirmOpen(image)}
                          color="secondary"
                          disabled={image.ID_OBRAZKU === 1} // Отключаем кнопку
                        >
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
            count={images.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </Paper>

        <Dialog open={formOpen} onClose={handleFormClose} fullWidth maxWidth="sm">
          <DialogTitle>{selectedImage ? 'Редактировать изображение' : 'Добавить изображение'}</DialogTitle>
          <form onSubmit={handleFormSubmit}>
            <DialogContent>
              <Button
                variant="contained"
                component="label"
                fullWidth
                style={{ marginBottom: '16px' }}
                disabled={!formData.format_id_formatu}
              >
                {selectedImage ? 'Обновить изображение' : 'Загрузить изображение'}
                <input
                  type="file"
                  hidden
                  accept={formats.find((f) => f.ID_FORMATU === parseInt(formData.format_id_formatu, 10))?.ROZIRENI
                    ? `.${formats.find((f) => f.ID_FORMATU === parseInt(formData.format_id_formatu, 10))?.ROZIRENI}`
                    : 'image/*'} // Ограничение по выбранному формату
                  onChange={(e) => setFormData({ ...formData, obrazek: e.target.files[0] })}
                />
              </Button>

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
              <FormControl fullWidth margin="dense">
              <InputLabel>Тип</InputLabel>
                <Select
                  value={formData.format_id_formatu}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      typ: e.target.value, // ID формата
                      format_id_formatu: e.target.value, // ID формата синхронизируется
                    });
                  }}
                  required
                >
                  {formats.map((format) => (
                    <MenuItem key={format.ID_FORMATU} value={format.ID_FORMATU}>
                      {`${format.ID_FORMATU}. ${format.ROZIRENI}`} {/* Отображаем ID и название */}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth margin="dense">
                <InputLabel>Продукт</InputLabel>
                <Select
                  value={formData.produkt_id_produktu}
                  onChange={(e) => setFormData({ ...formData, produkt_id_produktu: e.target.value })}
                  disabled={selectedImage?.ID_OBRAZKU === 1} // Отключаем поле для ID 1
                >
                  {products.map((product) => (
                    <MenuItem key={product.id} value={product.id}>
                      {`${product.id}. ${product.name}`}
                    </MenuItem>
                  ))}
                </Select>
                {selectedImage?.ID_OBRAZKU === 1 && (
                  <Typography variant="body2" color="textSecondary">
                    Продукт для этого изображения не обязателен.
                  </Typography>
                )}
              </FormControl>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleFormClose}>Отмена</Button>
              <Button type="submit" color="primary">
                {selectedImage ? 'Сохранить изменения' : 'Добавить изображение'}
              </Button>
            </DialogActions>
          </form>
        </Dialog>

        <Dialog open={deleteConfirmOpen} onClose={handleDeleteConfirmClose}>
          <DialogTitle>Удалить изображение?</DialogTitle>
          <DialogContent>
            <Typography gutterBottom>
              Вы уверены, что хотите удалить изображение с ID {selectedImage?.ID_OBRAZKU}?
            </Typography>
            {selectedImage && (
              <Typography variant="body2" color="textSecondary">
                Название: {selectedImage?.NAZEV || 'Нет названия'}
              </Typography>
            )}
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

export default ImagePanel;
