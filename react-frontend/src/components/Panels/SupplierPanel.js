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
  InputAdornment,
} from '@mui/material';
import { FiEdit2, FiTrash2, FiPlus, FiSearch } from 'react-icons/fi';
import AdminNavigation from './AdminNavigation';
import api from '../../services/api';

function SupplierPanel({ setActivePanel }) {
  const [suppliers, setSuppliers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [loading, setLoading] = useState(true);

  // Пагинация
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [formOpen, setFormOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [formData, setFormData] = useState({
    NAZEV: '',
    KONTAKTNI_OSOBA: '',
    TELEFON: '',
    EMAIL: '',
  });
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/dodavatele');
      setSuppliers(response);
    } catch (error) {
      setSnackbar({ open: true, message: 'Ошибка при загрузке поставщиков', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const filteredSuppliers = suppliers.filter(
    (supplier) =>
      supplier.NAZEV.toLowerCase().includes(searchQuery) ||
      supplier.KONTAKTNI_OSOBA.toLowerCase().includes(searchQuery)
  );

  const handleFormOpen = (supplier = null) => {
    setSelectedSupplier(supplier);
    setFormData(
      supplier
        ? {
            NAZEV: supplier.NAZEV,
            KONTAKTNI_OSOBA: supplier.KONTAKTNI_OSOBA,
            TELEFON: supplier.TELEFON,
            EMAIL: supplier.EMAIL,
          }
        : { NAZEV: '', KONTAKTNI_OSOBA: '', TELEFON: '', EMAIL: '' }
    );
    setFormOpen(true);
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setSelectedSupplier(null);
    setFormData({ NAZEV: '', KONTAKTNI_OSOBA: '', TELEFON: '', EMAIL: '' });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoadingAction(true);
    try {
      const dataToSend = { ...formData };

      if (selectedSupplier) {
        await api.put(`/api/dodavatele/${selectedSupplier.ID_DODAVATELU}`, dataToSend);
        setSnackbar({ open: true, message: 'Поставщик обновлен успешно', severity: 'success' });
      } else {
        await api.post('/api/dodavatele', dataToSend);
        setSnackbar({ open: true, message: 'Поставщик добавлен успешно', severity: 'success' });
      }
      fetchSuppliers();
      handleFormClose();
    } catch (error) {
      setSnackbar({ open: true, message: 'Ошибка при сохранении поставщика', severity: 'error' });
    } finally {
      setLoadingAction(false);
    }
  };

  const handleDeleteConfirmOpen = (supplier) => {
    setSelectedSupplier(supplier);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirmClose = () => {
    setDeleteConfirmOpen(false);
    setSelectedSupplier(null);
  };

  const handleDelete = async () => {
    setLoadingAction(true);
    try {
      await api.delete(`/api/dodavatele/${selectedSupplier.ID_DODAVATELU}`);
      setSnackbar({ open: true, message: 'Поставщик удален успешно', severity: 'success' });
      fetchSuppliers();
      handleDeleteConfirmClose();
    } catch (error) {
      setSnackbar({ open: true, message: 'Ошибка при удалении поставщика', severity: 'error' });
    } finally {
      setLoadingAction(false);
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
          Поставщики
        </Typography>
        <TextField
          placeholder="Поиск по названию или контактному лицу"
          fullWidth
          variant="outlined"
          margin="normal"
          value={searchQuery}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FiSearch />
              </InputAdornment>
            ),
          }}
        />
        <Button
          variant="contained"
          color="primary"
          startIcon={<FiPlus />}
          onClick={() => handleFormOpen()}
          style={{ marginBottom: '16px' }}
        >
          Добавить поставщика
        </Button>

        <Paper sx={{ width: '100%', overflow: 'hidden', marginTop: 2 }}>
          <TableContainer>
            <Table stickyHeader aria-label="suppliers table">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Название</TableCell>
                  <TableCell>Контактное лицо</TableCell>
                  <TableCell>Телефон</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell align="right">Действия</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredSuppliers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((supplier) => (
                  <TableRow hover key={supplier.ID_DODAVATELU}>
                    <TableCell>{supplier.ID_DODAVATELU}</TableCell>
                    <TableCell>{supplier.NAZEV}</TableCell>
                    <TableCell>{supplier.KONTAKTNI_OSOBA}</TableCell>
                    <TableCell>{supplier.TELEFON}</TableCell>
                    <TableCell>{supplier.EMAIL}</TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => handleFormOpen(supplier)} color="primary">
                        <FiEdit2 />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteConfirmOpen(supplier)} color="secondary">
                        <FiTrash2 />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={filteredSuppliers.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </Paper>

        <Dialog open={formOpen} onClose={handleFormClose} fullWidth maxWidth="sm">
          <DialogTitle>{selectedSupplier ? 'Редактировать поставщика' : 'Добавить поставщика'}</DialogTitle>
          <form onSubmit={handleFormSubmit}>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="Название"
                type="text"
                fullWidth
                required
                value={formData.NAZEV}
                onChange={(e) => setFormData({ ...formData, NAZEV: e.target.value })}
              />
              <TextField
                margin="dense"
                label="Контактное лицо"
                type="text"
                fullWidth
                required
                value={formData.KONTAKTNI_OSOBA}
                onChange={(e) => setFormData({ ...formData, KONTAKTNI_OSOBA: e.target.value })}
              />
              <TextField
                margin="dense"
                label="Телефон"
                type="number"
                fullWidth
                required
                value={formData.TELEFON}
                onChange={(e) => setFormData({ ...formData, TELEFON: e.target.value })}
              />
              <TextField
                margin="dense"
                label="Email"
                type="email"
                fullWidth
                required
                value={formData.EMAIL}
                onChange={(e) => setFormData({ ...formData, EMAIL: e.target.value })}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleFormClose}>Отмена</Button>
              <Button type="submit" color="primary" disabled={loadingAction}>
                {loadingAction ? <CircularProgress size={20} /> : 'Сохранить'}
              </Button>
            </DialogActions>
          </form>
        </Dialog>

        <Dialog open={deleteConfirmOpen} onClose={handleDeleteConfirmClose}>
          <DialogTitle>Удалить поставщика?</DialogTitle>
          <DialogContent>
            <Typography>
              Вы уверены, что хотите удалить поставщика с ID {selectedSupplier?.ID_DODAVATELU}?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteConfirmClose}>Отмена</Button>
            <Button onClick={handleDelete} color="secondary" disabled={loadingAction}>
              {loadingAction ? <CircularProgress size={20} /> : 'Удалить'}
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

export default SupplierPanel;
