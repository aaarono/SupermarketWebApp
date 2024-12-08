// src/components/Panels/LogPanel.js

import React, { useState, useEffect, useMemo } from 'react';
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
  const [filteredLogs, setFilteredLogs] = useState([]); // Filtered data
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [loading, setLoading] = useState(true);

  // Sorting
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'

  // Filtering
  const [filterId, setFilterId] = useState('');
  const [filterOperation, setFilterOperation] = useState('');
  const [filterTableName, setFilterTableName] = useState('');
  const [filterDate, setFilterDate] = useState('');

  useEffect(() => {
    fetchLogs();
  }, []);

  // Fetch logs from the backend
  const fetchLogs = async () => {
    try {
      const response = await api.get('/api/util/logs');
      const sortedLogs = response.sort((a, b) => a.idLogu - b.idLogu); // Automatic sorting by ID
      setLogs(sortedLogs);
      setFilteredLogs(sortedLogs); // Initially, filtered logs are the same as all logs
      setLoading(false);
    } catch (error) {
      console.error('Error fetching logs:', error);
      setSnackbar({ open: true, message: 'Error fetching logs', severity: 'error' });
      setLoading(false);
    }
  };

  // Handle sorting toggle
  const handleSort = () => {
    const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    const sortedLogs = [...filteredLogs].sort((a, b) =>
      newSortOrder === 'asc' ? a.idLogu - b.idLogu : b.idLogu - a.idLogu
    );
    setFilteredLogs(sortedLogs);
    setSortOrder(newSortOrder);
  };

  // Handle filtering
  const handleFilter = () => {
    const filtered = logs.filter(
      (log) =>
        (!filterId || log.idLogu.toString().includes(filterId)) &&
        (!filterOperation || log.operace.toLowerCase().includes(filterOperation.toLowerCase())) &&
        (!filterTableName || log.nazevTabulky.toLowerCase().includes(filterTableName.toLowerCase())) &&
        (!filterDate ||
          new Date(log.datumModifikace)
            .toLocaleDateString('en-GB') // Format: DD/MM/YYYY
            .includes(filterDate))
    );
    setFilteredLogs(filtered);
    setPage(0); // Reset pagination to the first page
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

  // Show loading indicator if data is being fetched
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex' }}>
      {/* Navigation */}
      <AdminNavigation setActivePanel={setActivePanel} />

      {/* Log Panel Content */}
      <div style={{ flexGrow: 1, padding: '16px' }}>
        <Typography variant="h4" gutterBottom>
          Logs
        </Typography>

        {/* Filter Fields */}
        <div style={{ marginBottom: '16px', display: 'flex', gap: '16px', alignItems: 'center' }}>
          <TextField
            label="Search by ID"
            value={filterId}
            onChange={(e) => setFilterId(e.target.value)}
            variant="outlined"
            size="small"
          />
          <TextField
            label="Search by Operation"
            value={filterOperation}
            onChange={(e) => setFilterOperation(e.target.value)}
            variant="outlined"
            size="small"
          />
          <TextField
            label="Search by Table Name"
            value={filterTableName}
            onChange={(e) => setFilterTableName(e.target.value)}
            variant="outlined"
            size="small"
          />
          <TextField
            label="Search by Date (DD/MM/YYYY)"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            variant="outlined"
            size="small"
            placeholder="e.g., 25/12/2023"
          />
          <Button variant="contained" color="primary" onClick={handleFilter}>
            Search
          </Button>
        </div>

        {/* Logs Table */}
        <Paper sx={{ width: '100%', overflow: 'hidden', marginTop: 2 }}>
          <TableContainer>
            <Table stickyHeader aria-label="logs table">
              <TableHead>
                <TableRow>
                  <TableCell onClick={handleSort} style={{ cursor: 'pointer' }}>
                    Log ID {sortOrder === 'asc' ? '↑' : '↓'}
                  </TableCell>
                  <TableCell>Operation</TableCell>
                  <TableCell>Table Name</TableCell>
                  <TableCell>Modification Date</TableCell>
                  <TableCell>Old Values</TableCell>
                  <TableCell>New Values</TableCell>
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
                        <TableCell>
                          {new Date(log.datumModifikace).toLocaleString('en-GB', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                          })}
                        </TableCell>
                        <TableCell>{log.oldValues || '—'}</TableCell>
                        <TableCell>{log.newValues || '—'}</TableCell>
                      </TableRow>
                    ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
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
            count={filteredLogs.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[10, 25, 50]}
          />
        </Paper>

        {/* Notifications */}
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
      </div>
    </div>
  );
}

export default LogPanel;
