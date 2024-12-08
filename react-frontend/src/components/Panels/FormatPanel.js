// src/components/Panels/FormatPanel.js

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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { FiEdit2, FiTrash2, FiPlus, FiSearch, FiX } from 'react-icons/fi';
import AdminNavigation from './AdminNavigation';
import api from '../../services/api';

function FormatPanel({ setActivePanel }) {
  const [formats, setFormats] = useState([]);
  const [filteredFormats, setFilteredFormats] = useState([]); // Filtered data
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [formOpen, setFormOpen] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState(null);
  const [formData, setFormData] = useState({
    ROZIRENI: '',
  });
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingAction, setLoadingAction] = useState(false);

  // Search Term
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchFormats();
  }, []);

  // Fetch formats from the backend
  const fetchFormats = async () => {
    try {
      const response = await api.get('/api/image-formats');
      setFormats(response);
      setFilteredFormats(response);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching formats:', error);
      setSnackbar({ open: true, message: 'Error fetching formats', severity: 'error' });
      setLoading(false);
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  // Memoized filtered formats based on search term
  const filteredFormatsMemo = useMemo(() => {
    return formats.filter(
      (format) =>
        format.ID_FORMATU.toString().includes(searchTerm) ||
        format.ROZIRENI.toLowerCase().includes(searchTerm)
    );
  }, [formats, searchTerm]);

  // Update filteredFormats when filteredFormatsMemo changes
  useEffect(() => {
    setFilteredFormats(filteredFormatsMemo);
  }, [filteredFormatsMemo]);

  // Open form for adding or editing a format
  const handleFormOpen = (format = null) => {
    setSelectedFormat(format);
    setFormData(
      format
        ? {
            ROZIRENI: format.ROZIRENI,
          }
        : { ROZIRENI: '' }
    );
    setFormOpen(true);
  };

  // Close the form and reset formData
  const handleFormClose = () => {
    setFormOpen(false);
    setSelectedFormat(null);
    setFormData({ ROZIRENI: '' });
  };

  // Handle form submission for adding or editing a format
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoadingAction(true);
    try {
      const dataToSend = {
        ROZIRENI: formData.ROZIRENI,
      };

      if (selectedFormat) {
        await api.put(`/api/formats/${selectedFormat.ID_FORMATU}`, dataToSend);
        setSnackbar({ open: true, message: 'Format updated successfully', severity: 'success' });
      } else {
        await api.post('/api/formats', dataToSend);
        setSnackbar({ open: true, message: 'Format added successfully', severity: 'success' });
      }
      fetchFormats();
      handleFormClose();
    } catch (error) {
      console.error('Error saving format:', error);
      const errorMessage = error.response?.data || 'Error saving format';
      setSnackbar({ open: true, message: errorMessage, severity: 'error' });
    } finally {
      setLoadingAction(false);
    }
  };

  // Open delete confirmation dialog
  const handleDeleteConfirmOpen = (format) => {
    setSelectedFormat(format);
    setDeleteConfirmOpen(true);
  };

  // Close delete confirmation dialog
  const handleDeleteConfirmClose = () => {
    setDeleteConfirmOpen(false);
    setSelectedFormat(null);
  };

  // Handle deletion of a format
  const handleDelete = async () => {
    setLoadingAction(true);
    try {
      await api.delete(`/api/formats/${selectedFormat.ID_FORMATU}`);
      setSnackbar({ open: true, message: 'Format deleted successfully', severity: 'success' });
      fetchFormats();
      handleDeleteConfirmClose();
    } catch (error) {
      console.error('Error deleting format:', error);
      const errorMessage = error.response?.data || 'Error deleting format';
      setSnackbar({ open: true, message: errorMessage, severity: 'error' });
    } finally {
      setLoadingAction(false);
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

      {/* Format Panel Content */}
      <div style={{ flexGrow: 1, padding: '16px' }}>
        <Typography variant="h4" gutterBottom>
          Formats
        </Typography>

        {/* Search Bar */}
        <Paper
          sx={{
            padding: '8px 16px',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            borderRadius: '8px',
          }}
        >
          <FiSearch style={{ marginRight: '8px', color: '#888' }} />
          <TextField
            placeholder="Search by ID or Resolution..."
            variant="standard"
            fullWidth
            value={searchTerm}
            onChange={handleSearchChange}
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
        </Paper>

        {/* Add Format Button */}
        <Button
          variant="contained"
          color="primary"
          startIcon={<FiPlus />}
          onClick={() => handleFormOpen()}
          style={{ marginBottom: '16px' }}
        >
          Add Format
        </Button>

        {/* Formats Table */}
        <Paper sx={{ width: '100%', overflow: 'hidden', marginTop: 2 }}>
          <TableContainer>
            <Table stickyHeader aria-label="formats table">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Resolution</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredFormats.length > 0 ? (
                  filteredFormats
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((format) => (
                      <TableRow hover key={format.ID_FORMATU}>
                        <TableCell>{format.ID_FORMATU}</TableCell>
                        <TableCell>{format.ROZIRENI}</TableCell>
                        <TableCell align="right">
                          <IconButton onClick={() => handleFormOpen(format)} color="primary">
                            <FiEdit2 />
                          </IconButton>
                          <IconButton onClick={() => handleDeleteConfirmOpen(format)} color="secondary">
                            <FiTrash2 />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
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
            count={filteredFormats.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </Paper>

        {/* Add/Edit Format Dialog */}
        <Dialog open={formOpen} onClose={handleFormClose} fullWidth maxWidth="sm">
          <DialogTitle>{selectedFormat ? 'Edit Format' : 'Add Format'}</DialogTitle>
          <form onSubmit={handleFormSubmit}>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="Resolution"
                type="text"
                fullWidth
                required
                value={formData.ROZIRENI}
                onChange={(e) => setFormData({ ...formData, ROZIRENI: e.target.value })}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleFormClose}>Cancel</Button>
              <Button type="submit" color="primary" disabled={loadingAction}>
                {loadingAction ? <CircularProgress size={20} /> : 'Save'}
              </Button>
            </DialogActions>
          </form>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteConfirmOpen} onClose={handleDeleteConfirmClose}>
          <DialogTitle>Delete Format?</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete the format with ID {selectedFormat?.ID_FORMATU}?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteConfirmClose}>Cancel</Button>
            <Button onClick={handleDelete} color="secondary" disabled={loadingAction}>
              {loadingAction ? <CircularProgress size={20} /> : 'Delete'}
            </Button>
          </DialogActions>
        </Dialog>

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

export default FormatPanel;
