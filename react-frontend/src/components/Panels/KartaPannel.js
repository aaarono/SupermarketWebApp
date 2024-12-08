// src/components/Panels/KartaPanel.js

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
  IconButton,
  InputAdornment,
  DialogTitle,
  DialogContent,
  DialogActions,
  Dialog
} from '@mui/material';
import { FiEdit2, FiTrash2, FiPlus, FiSearch, FiX } from 'react-icons/fi';
import AdminNavigation from './AdminNavigation';
import api from '../../services/api';

function KartaPanel({ setActivePanel }) {
  const [karty, setKarty] = useState([]); // Initialize as empty array
  const [filteredKarty, setFilteredKarty] = useState([]); // Filtered data
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [formOpen, setFormOpen] = useState(false);
  const [selectedKarta, setSelectedKarta] = useState(null);
  const [formData, setFormData] = useState({
    cisloKarty: '',
  });
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingAction, setLoadingAction] = useState(false);

  // Search Filters
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchKarty();
  }, []);

  // Fetch karty from the backend
  const fetchKarty = async () => {
    try {
      const response = await api.get('/api/karta');
      console.log('API Response:', response); // Added for debugging
      // Check if response.data exists and is an array
      if (response && response.data && Array.isArray(response.data)) {
        setKarty(response.data);
        setFilteredKarty(response.data);
      } else if (response && Array.isArray(response)) {
        // If API returns an array directly
        setKarty(response);
        setFilteredKarty(response);
      } else {
        // If data format is incorrect
        console.error('Incorrect data format from API:', response);
        setKarty([]);
        setFilteredKarty([]);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching karty:', error);
      setSnackbar({ open: true, message: 'Error fetching cards', severity: 'error' });
      setLoading(false);
    }
  };

  // Open form for adding or editing a karta
  const handleFormOpen = (karta = null) => {
    setSelectedKarta(karta);
    setFormData(
      karta
        ? {
            cisloKarty: karta.cisloKarty,
          }
        : { cisloKarty: '' }
    );
    setFormOpen(true);
  };

  // Close the form and reset formData
  const handleFormClose = () => {
    setFormOpen(false);
    setSelectedKarta(null);
    setFormData({ cisloKarty: '' });
  };

  // Handle form submission for adding or editing a karta
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoadingAction(true);
    try {
      const dataToSend = {
        cisloKarty: formData.cisloKarty,
      };

      if (selectedKarta) {
        await api.put(`/api/karta/${selectedKarta.idPlatby}`, dataToSend);
        setSnackbar({ open: true, message: 'Card updated successfully', severity: 'success' });
      } else {
        await api.post('/api/karta', dataToSend);
        setSnackbar({ open: true, message: 'Card added successfully', severity: 'success' });
      }
      fetchKarty();
      handleFormClose();
    } catch (error) {
      console.error('Error saving card:', error);
      const errorMessage = error.response?.data || 'Error saving card';
      setSnackbar({ open: true, message: errorMessage, severity: 'error' });
    } finally {
      setLoadingAction(false);
    }
  };

  // Open delete confirmation dialog
  const handleDeleteConfirmOpen = (karta) => {
    setSelectedKarta(karta);
    setDeleteConfirmOpen(true);
  };

  // Close delete confirmation dialog
  const handleDeleteConfirmClose = () => {
    setDeleteConfirmOpen(false);
    setSelectedKarta(null);
  };

  // Handle deletion of a karta
  const handleDelete = async () => {
    setLoadingAction(true);
    try {
      await api.delete(`/api/karta/${selectedKarta.idPlatby}`);
      setSnackbar({ open: true, message: 'Card deleted successfully', severity: 'success' });
      fetchKarty();
      handleDeleteConfirmClose();
    } catch (error) {
      console.error('Error deleting card:', error);
      const errorMessage = error.response?.data || 'Error deleting card';
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

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  // Memoized filtered karty based on search term
  const filteredKartyMemo = useMemo(() => {
    return karty.filter(
      (karta) =>
        karta.idPlatby.toString().includes(searchTerm) ||
        karta.cisloKarty.toLowerCase().includes(searchTerm)
    );
  }, [karty, searchTerm]);

  // Update filteredKarty when filteredKartyMemo changes
  useEffect(() => {
    setFilteredKarty(filteredKartyMemo);
  }, [filteredKartyMemo]);

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

      {/* Karta Panel Content */}
      <div style={{ flexGrow: 1, padding: '16px' }}>
        <Typography variant="h4" gutterBottom>
          Cards
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
            placeholder="Search by ID or Card Number..."
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

        {/* Add Card Button */}
        <Button
          variant="contained"
          color="primary"
          startIcon={<FiPlus />}
          onClick={() => handleFormOpen()}
          style={{ marginBottom: '16px' }}
        >
          Add Card
        </Button>

        {/* Cards Table */}
        <Paper sx={{ width: '100%', overflow: 'hidden', marginTop: 2 }}>
          <TableContainer>
            <Table stickyHeader aria-label="cards table">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Card Number</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredKarty.length > 0 ? (
                  filteredKarty
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((karta) => (
                      <TableRow hover key={karta.idPlatby}>
                        <TableCell>{karta.idPlatby}</TableCell>
                        <TableCell>{karta.cisloKarty}</TableCell>
                        <TableCell align="right">
                          <IconButton onClick={() => handleFormOpen(karta)} color="primary">
                            <FiEdit2 />
                          </IconButton>
                          <IconButton onClick={() => handleDeleteConfirmOpen(karta)} color="secondary">
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
            count={filteredKarty.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </Paper>

        {/* Add/Edit Card Dialog */}
        <Dialog open={formOpen} onClose={handleFormClose} fullWidth maxWidth="sm">
          <DialogTitle>{selectedKarta ? 'Edit Card' : 'Add Card'}</DialogTitle>
          <form onSubmit={handleFormSubmit}>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="Card Number"
                type="text"
                fullWidth
                required
                value={formData.cisloKarty}
                onChange={(e) => setFormData({ ...formData, cisloKarty: e.target.value })}
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
          <DialogTitle>Delete Card?</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete the card with ID {selectedKarta?.idPlatby}?
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

export default KartaPanel;
