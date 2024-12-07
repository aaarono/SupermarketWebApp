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
  Snackbar,
  Alert,
  CircularProgress,
  TextField,
  Button,
} from '@mui/material';
import AdminNavigation from './AdminNavigation';
import api from '../../services/api';

function SysCatalogPanel({ setActivePanel }) {
  const [objects, setObjects] = useState([]);
  const [filteredObjects, setFilteredObjects] = useState([]); // Фильтрованные данные
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Пагинация
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [loading, setLoading] = useState(true);

  // Фильтрация
  const [filterName, setFilterName] = useState('');
  const [filterType, setFilterType] = useState('');

  useEffect(() => {
    fetchObjects();
  }, []);

  const fetchObjects = async () => {
    try {
      const response = await api.get('/api/util/objects');
      setObjects(response);
      setFilteredObjects(response); // Изначально фильтрованные данные такие же, как все объекты
      setLoading(false);
    } catch (error) {
      console.error('Ошибка при загрузке объектов:', error);
      setSnackbar({ open: true, message: 'Ошибка при загрузке объектов', severity: 'error' });
      setLoading(false);
    }
  };

  // Обработчик фильтрации
  const handleFilter = () => {
    const filtered = objects.filter(
      (obj) =>
        (!filterName || obj.OBJECT_NAME.toLowerCase().includes(filterName.toLowerCase())) &&
        (!filterType || obj.OBJECT_TYPE.toLowerCase().includes(filterType.toLowerCase()))
    );
    setFilteredObjects(filtered);
    setPage(0); // Сбрасываем пагинацию на первую страницу
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

      {/* Содержимое панели системного каталога */}
      <div style={{ flexGrow: 1, padding: '16px' }}>
        <Typography variant="h4" gutterBottom>
          Системный каталог
        </Typography>

        {/* Поля для фильтрации */}
        <div style={{ marginBottom: '16px', display: 'flex', gap: '16px', alignItems: 'center' }}>
          <TextField
            label="Поиск по имени объекта"
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
            variant="outlined"
            size="small"
          />
          <TextField
            label="Поиск по типу объекта"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            variant="outlined"
            size="small"
          />
          <Button variant="contained" color="primary" onClick={handleFilter}>
            Искать
          </Button>
        </div>

        <Paper sx={{ width: '100%', overflow: 'hidden', marginTop: 2 }}>
          <TableContainer>
            <Table stickyHeader aria-label="system catalog table">
              <TableHead>
                <TableRow>
                  <TableCell>Имя объекта</TableCell>
                  <TableCell>Тип объекта</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredObjects.length > 0 ? (
                  filteredObjects
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((obj, index) => (
                      <TableRow hover key={index}>
                        <TableCell>{obj.OBJECT_NAME}</TableCell>
                        <TableCell>{obj.OBJECT_TYPE}</TableCell>
                      </TableRow>
                    ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={2} align="center">
                      Нет данных
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={filteredObjects.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[10, 25, 50]}
          />
        </Paper>

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

export default SysCatalogPanel;
