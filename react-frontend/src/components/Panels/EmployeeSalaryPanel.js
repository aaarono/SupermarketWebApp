import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Snackbar,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import AdminNavigation from './AdminNavigation'; // Компонент бокового меню
import api from '../../services/api';

function EmployeeSalaryPanel({ setActivePanel }) {
  const [employees, setEmployees] = useState([]); // Данные сотрудников
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' }); // Уведомления
  const [page, setPage] = useState(0); // Текущая страница
  const [rowsPerPage, setRowsPerPage] = useState(50); // Количество строк на странице
  const [indexationDialogOpen, setIndexationDialogOpen] = useState(false); // Состояние диалога индексации
  const [indexationData, setIndexationData] = useState({ min: '', max: '' }); // Данные для индексации

  // Загрузка данных о зарплатах
  useEffect(() => {
    fetchEmployees();
  }, []);

  // Обработчик смены страницы
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const fetchEmployees = async () => {
    try {
      const response = await api.get('/api/zamestnanci/all-salaries');
      console.log(response)
      setEmployees(response);
    } catch (error) {
      console.error('Error fetching employee salaries:', error);
      setSnackbar({ open: true, message: 'Error fetching employee salaries', severity: 'error' });
    }
  };

  // Обработчик изменения количества строк на странице
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // Открытие диалога индексации
  const handleOpenIndexationDialog = () => {
    setIndexationDialogOpen(true);
  };

  // Закрытие диалога индексации
  const handleCloseIndexationDialog = () => {
    setIndexationDialogOpen(false);
    setIndexationData({ min: '', max: '' });
  };

  // Обработка индексации зарплаты
  const handleApplyIndexation = async () => {
    if (!indexationData.min || !indexationData.max) {
      setSnackbar({ open: true, message: 'Please provide both minimum and maximum percentages.', severity: 'warning' });
      return;
    }

    try {
      await api.post('/api/zamestnanci/apply-salary-indexation', {
        minPercentage: parseFloat(indexationData.min),
        maxPercentage: parseFloat(indexationData.max),
      });
      setSnackbar({ open: true, message: 'Salary indexation applied successfully.', severity: 'success' });
      handleCloseIndexationDialog();
      fetchEmployees();
    } catch (error) {
      console.error('Error applying salary indexation:', error);
      setSnackbar({ open: true, message: 'Error applying salary indexation.', severity: 'error' });
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Боковая панель навигации */}
      <AdminNavigation setActivePanel={setActivePanel} />

      {/* Основное содержимое */}
      <Box sx={{ flexGrow: 1, padding: 3 }}>
        <Typography variant="h4" gutterBottom>
          Employee Salaries
        </Typography>

        <Button variant="contained" color="primary" onClick={handleOpenIndexationDialog} sx={{ marginBottom: 2 }}>
          Apply Salary Indexation
        </Button>

        <Paper sx={{ width: '100%', overflow: 'hidden', marginTop: 2 }}>
          <TableContainer>
            <Table stickyHeader aria-label="employee salaries table">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>First Name</TableCell>
                  <TableCell>Last Name</TableCell>
                  <TableCell>Hourly Wage</TableCell>
                  <TableCell>Working Hours</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {employees.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((employee) => (
                  <TableRow hover key={employee.EMPLOYEE_ID}>
                    <TableCell>{employee.EMPLOYEE_ID}</TableCell>
                    <TableCell>{employee.FIRST_NAME || 'Not Specified'}</TableCell>
                    <TableCell>{employee.LAST_NAME || 'Not Specified'}</TableCell>
                    <TableCell>{employee.HOURLY_WAGE || 'Not Specified'}</TableCell>
                    <TableCell>{employee.WORKING_HOURS || 'Not Specified'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={employees.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>

        {/* Диалог индексации зарплат */}
        <Dialog open={indexationDialogOpen} onClose={handleCloseIndexationDialog}>
          <DialogTitle>Apply Salary Indexation</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              label="Minimum Percentage"
              type="number"
              fullWidth
              value={indexationData.min}
              onChange={(e) => setIndexationData({ ...indexationData, min: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Maximum Percentage"
              type="number"
              fullWidth
              value={indexationData.max}
              onChange={(e) => setIndexationData({ ...indexationData, max: e.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseIndexationDialog}>Cancel</Button>
            <Button onClick={handleApplyIndexation} color="primary">
              Apply
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar для уведомлений */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </div>
  );
}

export default EmployeeSalaryPanel;
