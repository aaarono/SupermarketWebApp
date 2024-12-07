// src/components/Panels/UserPanel.js

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

function UserPanel({ setActivePanel }) {
  const [users, setUsers] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Пагинация
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [formOpen, setFormOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    jmeno: '',
    prijmeni: '',
    email: '',
    password: '',
    roleIdRole: '',
    zakaznikIdZakazniku: '',
    zamnestnanecIdZamnestnance: '',
  });
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  // Исправленный метод fetchUsers
  const fetchUsers = async () => {
    try {
      const response = await api.get('/api/users');
      console.log('Полученные данные пользователей:', response); // Для отладки
      setUsers(response); // Используем response
      setLoading(false);
    } catch (error) {
      console.error('Ошибка при загрузке пользователей:', error);
      setSnackbar({ open: true, message: 'Ошибка при загрузке пользователей', severity: 'error' });
      setLoading(false);
    }
  };

  const handleFormOpen = (user = null) => {
    setSelectedUser(user);
    setFormData(
      user
        ? {
            jmeno: user.jmeno,
            prijmeni: user.prijmeni,
            email: user.email,
            password: '', // Не отображаем пароль при редактировании
            roleIdRole: user.roleIdRole,
            zakaznikIdZakazniku: user.zakaznikIdZakazniku,
            zamnestnanecIdZamnestnance: user.zamnestnanecIdZamnestnance,
          }
        : { jmeno: '', prijmeni: '', email: '', password: '', roleIdRole: '', zakaznikIdZakazniku: '', zamnestnanecIdZamnestnance: '' }
    );
    setFormOpen(true);
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setSelectedUser(null);
    setFormData({ jmeno: '', prijmeni: '', email: '', password: '', roleIdRole: '', zakaznikIdZakazniku: '', zamnestnanecIdZamnestnance: '' });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        jmeno: formData.jmeno,
        prijmeni: formData.prijmeni,
        email: formData.email,
        ...(selectedUser ? {} : { password: formData.password }),
        roleIdRole: formData.roleIdRole,
        zakaznikIdZakazniku: formData.zakaznikIdZakazniku,
        zamnestnanecIdZamnestnance: formData.zamnestnanecIdZamnestnance,
      };

      if (selectedUser) {
        await api.put(`/api/users/${selectedUser.idUser}`, dataToSend);
        setSnackbar({ open: true, message: 'Пользователь обновлен успешно', severity: 'success' });
      } else {
        await api.post('/api/users', dataToSend);
        setSnackbar({ open: true, message: 'Пользователь добавлен успешно', severity: 'success' });
      }
      fetchUsers();
      handleFormClose();
    } catch (error) {
      console.error('Ошибка при сохранении пользователя:', error);
      const errorMessage = error.response?.data || 'Ошибка при сохранении пользователя';
      setSnackbar({ open: true, message: errorMessage, severity: 'error' });
    }
  };

  const handleDeleteConfirmOpen = (user) => {
    setSelectedUser(user);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirmClose = () => {
    setDeleteConfirmOpen(false);
    setSelectedUser(null);
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/api/users/${selectedUser.idUser}`);
      setSnackbar({ open: true, message: 'Пользователь удален успешно', severity: 'success' });
      fetchUsers();
      handleDeleteConfirmClose();
    } catch (error) {
      console.error('Ошибка при удалении пользователя:', error);
      const errorMessage = error.response?.data || 'Ошибка при удалении пользователя';
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

      {/* Содержимое панели пользователей */}
      <div style={{ flexGrow: 1, padding: '16px' }}>
        <Typography variant="h4" gutterBottom>
          Пользователи
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<FiPlus />}
          onClick={() => handleFormOpen()}
          style={{ marginBottom: '16px' }}
        >
          Добавить пользователя
        </Button>

        <Paper sx={{ width: '100%', overflow: 'hidden', marginTop: 2 }}>
          <TableContainer>
            <Table stickyHeader aria-label="users table">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Имя</TableCell>
                  <TableCell>Фамилия</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Роль ID</TableCell>
                  <TableCell>ID Заказчика</TableCell>
                  <TableCell>ID Сотрудника</TableCell>
                  <TableCell align="right">Действия</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.length > 0 ? (
                  users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user) => (
                    <TableRow hover key={user.idUser}>
                      <TableCell>{user.idUser}</TableCell>
                      <TableCell>{user.jmeno}</TableCell>
                      <TableCell>{user.prijmeni}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.roleIdRole}</TableCell>
                      <TableCell>{user.zakaznikIdZakazniku}</TableCell>
                      <TableCell>{user.zamnestnanecIdZamnestnance}</TableCell>
                      <TableCell align="right">
                        <IconButton onClick={() => handleFormOpen(user)} color="primary">
                          <FiEdit2 />
                        </IconButton>
                        <IconButton onClick={() => handleDeleteConfirmOpen(user)} color="secondary">
                          <FiTrash2 />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      Нет данных
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={users.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </Paper>

        {/* Форма добавления/редактирования пользователя */}
        <Dialog open={formOpen} onClose={handleFormClose} fullWidth maxWidth="sm">
          <DialogTitle>{selectedUser ? 'Редактировать пользователя' : 'Добавить пользователя'}</DialogTitle>
          <form onSubmit={handleFormSubmit}>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="Имя"
                type="text"
                fullWidth
                required
                value={formData.jmeno}
                onChange={(e) => setFormData({ ...formData, jmeno: e.target.value })}
              />
              <TextField
                margin="dense"
                label="Фамилия"
                type="text"
                fullWidth
                required
                value={formData.prijmeni}
                onChange={(e) => setFormData({ ...formData, prijmeni: e.target.value })}
              />
              <TextField
                margin="dense"
                label="Email"
                type="email"
                fullWidth
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              {!selectedUser && (
                <TextField
                  margin="dense"
                  label="Пароль"
                  type="password"
                  fullWidth
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              )}
              <TextField
                margin="dense"
                label="Роль ID"
                type="number"
                fullWidth
                required
                value={formData.roleIdRole}
                onChange={(e) => setFormData({ ...formData, roleIdRole: e.target.value })}
              />
              <TextField
                margin="dense"
                label="ID Заказчика"
                type="number"
                fullWidth
                value={formData.zakaznikIdZakazniku}
                onChange={(e) => setFormData({ ...formData, zakaznikIdZakazniku: e.target.value })}
              />
              <TextField
                margin="dense"
                label="ID Сотрудника"
                type="number"
                fullWidth
                value={formData.zamnestnanecIdZamnestnance}
                onChange={(e) => setFormData({ ...formData, zamnestnanecIdZamnestnance: e.target.value })}
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
          <DialogTitle>Удалить пользователя?</DialogTitle>
          <DialogContent>
            <Typography>
              Вы уверены, что хотите удалить пользователя с ID {selectedUser?.idUser}?
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

export default UserPanel;
