// RolePanel.js

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

function RolePanel({ setActivePanel }) {
  const [roles, setRoles] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Пагинация
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [formOpen, setFormOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [formData, setFormData] = useState({
    ROLENAME: '',
  });
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await api.get('/api/util/roles');
      setRoles(response);
      setLoading(false);
    } catch (error) {
      console.error('Ошибка при загрузке ролей:', error);
      setSnackbar({ open: true, message: 'Ошибка при загрузке ролей', severity: 'error' });
      setLoading(false);
    }
  };

  const handleFormOpen = (role = null) => {
    setSelectedRole(role);
    setFormData(
      role
        ? {
            ROLENAME: role.ROLENAME,
          }
        : { ROLENAME: '' }
    );
    setFormOpen(true);
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setSelectedRole(null);
    setFormData({ ROLENAME: '' });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        ROLENAME: formData.ROLENAME,
      };

      if (selectedRole) {
        await api.put(`/api/roles/${selectedRole.ID_ROLE}`, dataToSend);
        setSnackbar({ open: true, message: 'Роль обновлена успешно', severity: 'success' });
      } else {
        await api.post('/api/roles', dataToSend);
        setSnackbar({ open: true, message: 'Роль добавлена успешно', severity: 'success' });
      }
      fetchRoles();
      handleFormClose();
    } catch (error) {
      console.error('Ошибка при сохранении роли:', error);
      const errorMessage = error.response?.data || 'Ошибка при сохранении роли';
      setSnackbar({ open: true, message: errorMessage, severity: 'error' });
    }
  };

  const handleDeleteConfirmOpen = (role) => {
    setSelectedRole(role);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirmClose = () => {
    setDeleteConfirmOpen(false);
    setSelectedRole(null);
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/api/roles/${selectedRole.ID_ROLE}`);
      setSnackbar({ open: true, message: 'Роль удалена успешно', severity: 'success' });
      fetchRoles();
      handleDeleteConfirmClose();
    } catch (error) {
      console.error('Ошибка при удалении роли:', error);
      const errorMessage = error.response?.data || 'Ошибка при удалении роли';
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

      {/* Содержимое панели ролей */}
      <div style={{ flexGrow: 1, padding: '16px' }}>
        <Typography variant="h4" gutterBottom>
          Роли
        </Typography>
        {/* <Button
          variant="contained"
          color="primary"
          startIcon={<FiPlus />}
          onClick={() => handleFormOpen()}
          style={{ marginBottom: '16px' }}
        >
          Добавить роль
        </Button> */}

        <Paper sx={{ width: '100%', overflow: 'hidden', marginTop: 2 }}>
          <TableContainer>
            <Table stickyHeader aria-label="roles table">
              <TableHead>
                <TableRow>
                  <TableCell>ID Роли</TableCell>
                  <TableCell>Название роли</TableCell>
                  {/* <TableCell align="right">Действия</TableCell> */}
                </TableRow>
              </TableHead>
              <TableBody>
                {roles.length > 0 ? (
                  roles.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((role) => (
                    <TableRow hover key={role.ID_ROLE}>
                      <TableCell>{role.ID_ROLE}</TableCell>
                      <TableCell>{role.ROLENAME}</TableCell>
                      {/* <TableCell align="right">
                        <IconButton onClick={() => handleFormOpen(role)} color="primary">
                          <FiEdit2 />
                        </IconButton>
                        <IconButton onClick={() => handleDeleteConfirmOpen(role)} color="secondary">
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
            count={roles.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </Paper>

        {/* Форма добавления/редактирования роли */}
        {/* <Dialog open={formOpen} onClose={handleFormClose} fullWidth maxWidth="sm">
          <DialogTitle>{selectedRole ? 'Редактировать роль' : 'Добавить роль'}</DialogTitle>
          <form onSubmit={handleFormSubmit}>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="Название роли"
                type="text"
                fullWidth
                required
                value={formData.ROLENAME}
                onChange={(e) => setFormData({ ...formData, ROLENAME: e.target.value })}
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
          <DialogTitle>Удалить роль?</DialogTitle>
          <DialogContent>
            <Typography>
              Вы уверены, что хотите удалить роль с ID {selectedRole?.ID_ROLE}?
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
        {/* <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
            {snackbar.message}
          </Alert>
        </Snackbar> */}
      </div>
    </div>
  );
}

export default RolePanel;
