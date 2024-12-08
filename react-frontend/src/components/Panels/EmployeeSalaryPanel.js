// src/components/Panels/EmployeeSalaryPanel.js

import React, { useState, useEffect, useMemo } from 'react';
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
  InputAdornment,
  IconButton,
} from '@mui/material';
import { FiPlus, FiSearch, FiX } from 'react-icons/fi';
import AdminNavigation from './AdminNavigation'; // Sidebar navigation component
import api from '../../services/api';

function EmployeeSalaryPanel({ setActivePanel }) {
  const [employees, setEmployees] = useState([]); // Employee salary data
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' }); // Notifications
  const [page, setPage] = useState(0); // Current page for pagination
  const [rowsPerPage, setRowsPerPage] = useState(50); // Rows per page for pagination
  const [indexationDialogOpen, setIndexationDialogOpen] = useState(false); // Indexation dialog state
  const [indexationData, setIndexationData] = useState({ min: '', max: '' }); // Indexation data

  // Search and Salary Range Filters
  const [searchTerm, setSearchTerm] = useState(''); // Global search term
  const [salaryRange, setSalaryRange] = useState({ min: '', max: '' }); // Salary range filter

  // Load employee salary data on component mount
  useEffect(() => {
    fetchEmployees();
  }, []);

  // Fetch employee salaries from the backend
  const fetchEmployees = async () => {
    try {
      const response = await api.get('/api/zamestnanci/all-salaries');
      console.log(response);
      setEmployees(response);
    } catch (error) {
      console.error('Error fetching employee salaries:', error);
      setSnackbar({ open: true, message: 'Error fetching employee salaries', severity: 'error' });
    }
  };

  // Handle pagination page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle pagination rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // Open the indexation dialog
  const handleOpenIndexationDialog = () => {
    setIndexationDialogOpen(true);
  };

  // Close the indexation dialog
  const handleCloseIndexationDialog = () => {
    setIndexationDialogOpen(false);
    setIndexationData({ min: '', max: '' });
  };

  // Apply salary indexation
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

  // Memoized filtered and sorted employees based on search and salary range
  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      const searchStr = searchTerm.toLowerCase();

      const matchesSearch =
        employee.EMPLOYEE_ID.toString().includes(searchStr) ||
        (employee.FIRST_NAME && employee.FIRST_NAME.toLowerCase().includes(searchStr)) ||
        (employee.LAST_NAME && employee.LAST_NAME.toLowerCase().includes(searchStr)) ||
        (employee.HOURLY_WAGE && employee.HOURLY_WAGE.toString().includes(searchStr)) ||
        (employee.WORKING_HOURS && employee.WORKING_HOURS.toString().includes(searchStr));

      const matchesSalary =
        (salaryRange.min === '' || (employee.HOURLY_WAGE && employee.HOURLY_WAGE >= parseFloat(salaryRange.min))) &&
        (salaryRange.max === '' || (employee.HOURLY_WAGE && employee.HOURLY_WAGE <= parseFloat(salaryRange.max)));

      return matchesSearch && matchesSalary;
    });
  }, [employees, searchTerm, salaryRange]);

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar Navigation */}
      <AdminNavigation setActivePanel={setActivePanel} />

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, padding: 3, overflowY: 'auto' }}>
        <Typography variant="h4" gutterBottom>
          Employee Salaries
        </Typography>

        {/* Apply Salary Indexation Button */}
        <Button variant="contained" color="primary" onClick={handleOpenIndexationDialog} sx={{ marginBottom: 2 }}>
          Apply Salary Indexation
        </Button>

        {/* Search and Salary Range Filters */}
        <Paper
          sx={{
            padding: '16px',
            marginBottom: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            borderRadius: '8px',
          }}
        >
          {/* Global Search Bar */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <FiSearch style={{ marginRight: '8px', color: '#888' }} />
            <TextField
              placeholder="Search across all fields..."
              variant="standard"
              fullWidth
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                endAdornment: searchTerm && (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setSearchTerm('')}>
                      <FiX />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* Salary Range Filter */}
          <Box sx={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <TextField
              label="Minimum Hourly Wage"
              type="number"
              variant="outlined"
              fullWidth
              value={salaryRange.min}
              onChange={(e) => setSalaryRange({ ...salaryRange, min: e.target.value })}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
            />
            <TextField
              label="Maximum Hourly Wage"
              type="number"
              variant="outlined"
              fullWidth
              value={salaryRange.max}
              onChange={(e) => setSalaryRange({ ...salaryRange, max: e.target.value })}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
            />
          </Box>
        </Paper>

        {/* Employees Salary Table */}
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
                {filteredEmployees.length > 0 ? (
                  filteredEmployees
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((employee) => (
                      <TableRow hover key={employee.EMPLOYEE_ID}>
                        <TableCell>{employee.EMPLOYEE_ID}</TableCell>
                        <TableCell>{employee.FIRST_NAME || 'Not Specified'}</TableCell>
                        <TableCell>{employee.LAST_NAME || 'Not Specified'}</TableCell>
                        <TableCell>${employee.HOURLY_WAGE?.toFixed(2) || 'Not Specified'}</TableCell>
                        <TableCell>{employee.WORKING_HOURS || 'Not Specified'}</TableCell>
                      </TableRow>
                    ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No data available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination Controls */}
          <TablePagination
            component="div"
            count={filteredEmployees.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[10, 25, 50, 100]}
          />
        </Paper>

        {/* Salary Indexation Dialog */}
        <Dialog open={indexationDialogOpen} onClose={handleCloseIndexationDialog}>
          <DialogTitle>Apply Salary Indexation</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              label="Minimum Percentage (%)"
              type="number"
              fullWidth
              value={indexationData.min}
              onChange={(e) => setIndexationData({ ...indexationData, min: e.target.value })}
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
              }}
            />
            <TextField
              margin="dense"
              label="Maximum Percentage (%)"
              type="number"
              fullWidth
              value={indexationData.max}
              onChange={(e) => setIndexationData({ ...indexationData, max: e.target.value })}
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseIndexationDialog}>Cancel</Button>
            <Button onClick={handleApplyIndexation} color="primary">
              Apply
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for Notifications */}
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
