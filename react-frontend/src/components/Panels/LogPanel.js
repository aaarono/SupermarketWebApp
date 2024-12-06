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

function LogPanel({ setActivePanel }) {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]); // Фильтрованные данные
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Пагинация
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [loading, setLoading] = useState(true);

  // Сортировка
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' или 'desc'

  // Фильтрация
  const [filterId, setFilterId] = useState('');
  const [filterOperation, setFilterOperation] = useState('');
  const [filterTableName, setFilterTableName] = useState('');
  const [filterDate, setFilterDate] = useState('');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await api.get('/api/util/logs');
      const sortedLogs = response.sort((a, b) => a.idLogu - b.idLogu); // Автоматическая сортировка по ID
      setLogs(sortedLogs);
      setFilteredLogs(sortedLogs); // Изначально фильтрованные данные такие же, как все логи
      setLoading(false);
    } catch (error) {
      console.error('Ошибка при загрузке логов:', error);
      setSnackbar({ open: true, message: 'Ошибка при загрузке логов', severity: 'error' });
      setLoading(false);
    }
  };

  // Обработчик сортировки
  const handleSort = () => {
    const sortedLogs = [...filteredLogs].sort((a, b) => {
      if (sortOrder === 'asc') {
        return b.idLogu - a.idLogu; // Сортировка по убыванию
      } else {
        return a.idLogu - b.idLogu; // Сортировка по возрастанию
      }
    });
    setFilteredLogs(sortedLogs);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  // Обработчик фильтрации
  const handleFilter = () => {
    const filtered = logs.filter(
      (log) =>
        (!filterId || log.idLogu.toString().includes(filterId)) &&
        (!filterOperation || log.operace.toLowerCase().includes(filterOperation.toLowerCase())) &&
        (!filterTableName || log.nazevTabulky.toLowerCase().includes(filterTableName.toLowerCase())) &&
        (!filterDate || new Date(log.datumModifikace).toLocaleDateString().includes(filterDate))
    );
    setFilteredLogs(filtered);
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

      {/* Содержимое панели логов */}
      <div style={{ flexGrow: 1, padding: '16px' }}>
        <Typography variant="h4" gutterBottom>
          Логи
        </Typography>

        {/* Поля для фильтрации */}
        <div style={{ marginBottom: '16px', display: 'flex', gap: '16px', alignItems: 'center' }}>
          <TextField
            label="Поиск по ID"
            value={filterId}
            onChange={(e) => setFilterId(e.target.value)}
            variant="outlined"
            size="small"
          />
          <TextField
            label="Поиск по операции"
            value={filterOperation}
            onChange={(e) => setFilterOperation(e.target.value)}
            variant="outlined"
            size="small"
          />
          <TextField
            label="Поиск по таблице"
            value={filterTableName}
            onChange={(e) => setFilterTableName(e.target.value)}
            variant="outlined"
            size="small"
          />
          <TextField
            label="Поиск по дате (ДД.ММ.ГГГГ)"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            variant="outlined"
            size="small"
          />
          <Button variant="contained" color="primary" onClick={handleFilter}>
            Искать
          </Button>
        </div>

        <Paper sx={{ width: '100%', overflow: 'hidden', marginTop: 2 }}>
          <TableContainer>
            <Table stickyHeader aria-label="logs table">
              <TableHead>
                <TableRow>
                  <TableCell onClick={handleSort} style={{ cursor: 'pointer' }}>
                    ID Лога {sortOrder === 'asc' ? '↑' : '↓'}
                  </TableCell>
                  <TableCell>Операция</TableCell>
                  <TableCell>Название Таблицы</TableCell>
                  <TableCell>Дата Модификации</TableCell>
                  <TableCell>Старые Значения</TableCell>
                  <TableCell>Новые Значения</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredLogs.length > 0 ? (
                  filteredLogs
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((log) => (
                      <TableRow hover key={log.idLogu}>
                        <TableCell>{log.idLogu}</TableCell>
                        <TableCell>{log.operace}</TableCell>
                        <TableCell>{log.nazevTabulky}</TableCell>
                        <TableCell>{new Date(log.datumModifikace).toLocaleString()}</TableCell>
                        <TableCell>{log.oldValues || '—'}</TableCell>
                        <TableCell>{log.newValues || '—'}</TableCell>
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
            count={filteredLogs.length}
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

export default LogPanel;
