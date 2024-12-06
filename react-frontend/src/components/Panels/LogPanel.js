// LogPanel.js

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
} from '@mui/material';
import AdminNavigation from './AdminNavigation';
import api from '../../services/api';

function LogPanel({ setActivePanel }) {
  const [logs, setLogs] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Пагинация
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await api.get('/api/logs');
      setLogs(response);
      setLoading(false);
    } catch (error) {
      console.error('Ошибка при загрузке логов:', error);
      setSnackbar({ open: true, message: 'Ошибка при загрузке логов', severity: 'error' });
      setLoading(false);
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

      {/* Содержимое панели логов */}
      <div style={{ flexGrow: 1, padding: '16px' }}>
        <Typography variant="h4" gutterBottom>
          Логи
        </Typography>

        <Paper sx={{ width: '100%', overflow: 'hidden', marginTop: 2 }}>
          <TableContainer>
            <Table stickyHeader aria-label="logs table">
              <TableHead>
                <TableRow>
                  <TableCell>ID Лога</TableCell>
                  <TableCell>Операция</TableCell>
                  <TableCell>Название Таблицы</TableCell>
                  <TableCell>Дата Модификации</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {logs.length > 0 ? (
                  logs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((log) => (
                    <TableRow hover key={log.id_logu}>
                      <TableCell>{log.id_logu}</TableCell>
                      <TableCell>{log.operace}</TableCell>
                      <TableCell>{log.nazevtabulky}</TableCell>
                      <TableCell>{new Date(log.datummodifikace).toLocaleString()}</TableCell>
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
            count={logs.length}
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
