// src/components/Panels/HotovostPanel.js

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
  Dialog, 
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { FiEdit2, FiTrash2, FiPlus, FiSearch, FiX } from 'react-icons/fi';
import AdminNavigation from './AdminNavigation';
import api from '../../services/api';

function HotovostPanel({ setActivePanel }) {
  const [hotovosts, setHotovosts] = useState([]);
  const [filteredHotovosts, setFilteredHotovosts] = useState([]); // Filtered data
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [formOpen, setFormOpen] = useState(false);
  const [selectedHotovost, setSelectedHotovost] = useState(null);
  const [formData, setFormData] = useState({
    prijato: '',
    vraceno: '',
  });
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingAction, setLoadingAction] = useState(false);

  // Search Term
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchHotovosts();
  }, []);

  // Fetch cash payments from the backend
  const fetchHotovosts = async () => {
    try {
      const response = await api.get('/api/hotovost');
      setHotovosts(response);
      setFilteredHotovosts(response);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching cash payments:', error);
      setSnackbar({ open: true, message: 'Error fetching cash payments', severity: 'error' });
      setLoading(false);
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  // Memoized filtered cash payments based on search term
  const filteredHotovostsMemo = useMemo(() => {
    return hotovosts.filter(
      (hotovost) =>
        hotovost.idPlatby.toString().includes(searchTerm) ||
        hotovost.prijato.toString().includes(searchTerm) ||
        hotovost.vraceno.toString().includes(searchTerm)
    );
  }, [hotovosts, searchTerm]);

  // Update filteredHotovosts when filteredHotovostsMemo changes
  useEffect(() => {
    setFilteredHotovosts(filteredHotovostsMemo);
  }, [filteredHotovostsMemo]);

  // Open form for adding or editing a cash payment
  const handleFormOpen = (hotovost = null) => {
    setSelectedHotovost(hotovost);
    setFormData(
      hotovost
        ? {
            prijato: hotovost.prijato,
            vraceno: hotovost.vraceno,
          }
        : { prijato: '', vraceno: '' }
    );
    setFormOpen(true);
  };

  // Close the form and reset formData
  const handleFormClose = () => {
    setFormOpen(false);
    setSelectedHotovost(null);
    setFormData({ prijato: '', vraceno: '' });
  };

  // Handle form submission for adding or editing a cash payment
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoadingAction(true);
    try {
      const dataToSend = {
        prijato: parseFloat(formData.prijato),
        vraceno: parseFloat(formData.vraceno),
      };

      if (selectedHotovost) {
        await api.put(`/api/hotovost/${selectedHotovost.idPlatby}`, dataToSend);
        setSnackbar({ open: true, message: 'Cash payment updated successfully', severity: 'success' });
      } else {
        await api.post('/api/hotovost', dataToSend);
        setSnackbar({ open: true, message: 'Cash payment added successfully', severity: 'success' });
      }
      fetchHotovosts();
      handleFormClose();
    } catch (error) {
      console.error('Error saving cash payment:', error);
      const errorMessage = error.response?.data || 'Error saving cash payment';
      setSnackbar({ open: true, message: errorMessage, severity: 'error' });
    } finally {
      setLoadingAction(false);
    }
  };

  // Open delete confirmation dialog
  const handleDeleteConfirmOpen = (hotovost) => {
    setSelectedHotovost(hotovost);
    setDeleteConfirmOpen(true);
  };

  // Close delete confirmation dialog
  const handleDeleteConfirmClose = () => {
    setDeleteConfirmOpen(false);
    setSelectedHotovost(null);
  };

  // Handle deletion of a cash payment
  const handleDelete = async () => {
    setLoadingAction(true);
    try {
      await api.delete(`/api/hotovost/${selectedHotovost.idPlatby}`);
      setSnackbar({ open: true, message: 'Cash payment deleted successfully', severity: 'success' });
      fetchHotovosts();
      handleDeleteConfirmClose();
    } catch (error) {
      console.error('Error deleting cash payment:', error);
      const errorMessage = error.response?.data || 'Error deleting cash payment';
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

      {/* Cash Payment Panel Content */}
      <div style={{ flexGrow: 1, padding: '16px' }}>
        <Typography variant="h4" gutterBottom>
          Cash Payments
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
            placeholder="Search by ID, Received, or Returned..."
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

        {/* Add Cash Payment Button */}
        <Button
          variant="contained"
          color="primary"
          startIcon={<FiPlus />}
          onClick={() => handleFormOpen()}
          style={{ marginBottom: '16px' }}
        >
          Add Cash Payment
        </Button>

        {/* Cash Payments Table */}
        <Paper sx={{ width: '100%', overflow: 'hidden', marginTop: 2 }}>
          <TableContainer>
            <Table stickyHeader aria-label="cash payments table">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Received</TableCell>
                  <TableCell>Returned</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredHotovosts.length > 0 ? (
                  filteredHotovosts
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((hotovost) => (
                      <TableRow hover key={hotovost.idPlatby}>
                        <TableCell>{hotovost.idPlatby}</TableCell>
                        <TableCell>{hotovost.prijato}</TableCell>
                        <TableCell>{hotovost.vraceno}</TableCell>
                        <TableCell align="right">
                          <IconButton onClick={() => handleFormOpen(hotovost)} color="primary">
                            <FiEdit2 />
                          </IconButton>
                          <IconButton onClick={() => handleDeleteConfirmOpen(hotovost)} color="secondary">
                            <FiTrash2 />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
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
            count={filteredHotovosts.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </Paper>

        {/* Add/Edit Cash Payment Dialog */}
        <Dialog open={formOpen} onClose={handleFormClose} fullWidth maxWidth="sm">
          <DialogTitle>{selectedHotovost ? 'Edit Cash Payment' : 'Add Cash Payment'}</DialogTitle>
          <form onSubmit={handleFormSubmit}>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="Received"
                type="number"
                fullWidth
                required
                value={formData.prijato}
                onChange={(e) => setFormData({ ...formData, prijato: e.target.value })}
              />
              <TextField
                margin="dense"
                label="Returned"
                type="number"
                fullWidth
                required
                value={formData.vraceno}
                onChange={(e) => setFormData({ ...formData, vraceno: e.target.value })}
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
          <DialogTitle>Delete Cash Payment?</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete the cash payment with ID {selectedHotovost?.idPlatby}?
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

export default HotovostPanel;
