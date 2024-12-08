// src/components/Panels/AddressPanel.js

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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Snackbar,
  Alert,
  TableSortLabel,
  InputAdornment,
} from '@mui/material';
import { FiEdit2, FiTrash2, FiPlus, FiSearch, FiX } from 'react-icons/fi';
import AdminNavigation from './AdminNavigation';
import api from '../../services/api';

function AddressPanel({ setActivePanel }) {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [formData, setFormData] = useState({
    ulice: '',
    mesto: '',
    psc: '',
    cisloPopisne: '',
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Sorting
  const [order, setOrder] = useState('asc'); // 'asc' or 'desc'
  const [orderBy, setOrderBy] = useState('idAdresy'); // Column to sort by

  // Search
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAddresses();
  }, []);

  // Fetch addresses from the backend
  const fetchAddresses = async () => {
    try {
      const response = await api.get('/api/addresses');
      console.log('Addresses:', response);
      setAddresses(response);
    } catch (error) {
      console.error('Error loading addresses:', error);
      setSnackbar({ open: true, message: 'Error loading addresses', severity: 'error' });
    }
  };

  // Open the add/edit form
  const handleFormOpen = (address = null) => {
    setSelectedAddress(address);
    setFormData(
      address
        ? {
            ulice: address.ulice,
            mesto: address.mesto,
            psc: address.psc,
            cisloPopisne: address.cisloPopisne,
          }
        : { ulice: '', mesto: '', psc: '', cisloPopisne: '' }
    );
    setFormOpen(true);
  };

  // Close the add/edit form
  const handleFormClose = () => {
    setFormOpen(false);
    setSelectedAddress(null);
    setFormData({ ulice: '', mesto: '', psc: '', cisloPopisne: '' });
  };

  // Handle form submission for add/edit
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedAddress) {
        await api.put(`/api/addresses/${selectedAddress.idAdresy}`, formData);
        setSnackbar({ open: true, message: 'Address updated successfully', severity: 'success' });
      } else {
        await api.post('/api/addresses', formData);
        setSnackbar({ open: true, message: 'Address added successfully', severity: 'success' });
      }
      fetchAddresses();
      handleFormClose();
    } catch (error) {
      console.error('Error saving address:', error);
      const errorMessage = error.response?.data || 'Error saving address';
      setSnackbar({ open: true, message: errorMessage, severity: 'error' });
    }
  };

  // Open delete confirmation dialog
  const handleDeleteConfirmOpen = (address) => {
    setSelectedAddress(address);
    setDeleteConfirmOpen(true);
  };

  // Close delete confirmation dialog
  const handleDeleteConfirmClose = () => {
    setDeleteConfirmOpen(false);
    setSelectedAddress(null);
  };

  // Handle address deletion
  const handleDelete = async () => {
    try {
      await api.delete(`/api/addresses/${selectedAddress.idAdresy}`);
      setSnackbar({ open: true, message: 'Address deleted successfully', severity: 'success' });
      fetchAddresses();
      handleDeleteConfirmClose();
    } catch (error) {
      console.error('Error deleting address:', error);
      const errorMessage = error.response?.data || 'Error deleting address';
      setSnackbar({ open: true, message: errorMessage, severity: 'error' });
    }
  };

  // Handle pagination page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle pagination rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value || 10);
    setPage(0);
  };

  // Handle sorting
  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // Sorting comparator function
  const comparator = (a, b) => {
    if (a[orderBy] < b[orderBy]) {
      return order === 'asc' ? -1 : 1;
    }
    if (a[orderBy] > b[orderBy]) {
      return order === 'asc' ? 1 : -1;
    }
    return 0;
  };

  // Memoized filtered and sorted addresses
  const filteredAndSortedAddresses = useMemo(() => {
    // Apply search filter
    const filtered = addresses.filter((address) => {
      const searchStr = searchTerm.toLowerCase();
      return (
        address.idAdresy.toString().includes(searchStr) ||
        address.ulice.toLowerCase().includes(searchStr) ||
        address.mesto.toLowerCase().includes(searchStr) ||
        address.psc.toLowerCase().includes(searchStr) ||
        address.cisloPopisne.toLowerCase().includes(searchStr)
      );
    });

    // Sort the filtered addresses
    return filtered.slice().sort(comparator);
  }, [addresses, order, orderBy, searchTerm]);

  return (
    <div style={{ display: 'flex' }}>
      {/* Navigation */}
      <AdminNavigation setActivePanel={setActivePanel} />

      {/* Address Panel Content */}
      <div style={{ flexGrow: 1, padding: '16px' }}>
        <Typography variant="h4" gutterBottom>
          Addresses
        </Typography>

        {/* Add Address Button */}
        <Button
          variant="contained"
          color="primary"
          startIcon={<FiPlus />}
          onClick={() => handleFormOpen()}
          style={{ marginBottom: '16px' }}
        >
          Add Address
        </Button>

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
        </Paper>

        {/* Addresses Table */}
        <Paper sx={{ width: '100%', overflow: 'hidden', marginTop: 2 }}>
          <TableContainer>
            <Table stickyHeader aria-label="addresses table">
              <TableHead>
                <TableRow>
                  {/* ID Column with Sorting */}
                  <TableCell sortDirection={orderBy === 'idAdresy' ? order : false}>
                    <TableSortLabel
                      active={orderBy === 'idAdresy'}
                      direction={orderBy === 'idAdresy' ? order : 'asc'}
                      onClick={() => handleRequestSort('idAdresy')}
                    >
                      ID
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>Street</TableCell>
                  <TableCell>City</TableCell>
                  <TableCell>Postal Code</TableCell>
                  <TableCell>House Number</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAndSortedAddresses.length > 0 ? (
                  filteredAndSortedAddresses
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((address) => (
                      <TableRow hover key={address.idAdresy}>
                        <TableCell>{address.idAdresy}</TableCell>
                        <TableCell>{address.ulice}</TableCell>
                        <TableCell>{address.mesto}</TableCell>
                        <TableCell>{address.psc}</TableCell>
                        <TableCell>{address.cisloPopisne}</TableCell>
                        <TableCell align="right">
                          <IconButton onClick={() => handleFormOpen(address)} color="primary">
                            <FiEdit2 />
                          </IconButton>
                          <IconButton onClick={() => handleDeleteConfirmOpen(address)} color="secondary">
                            <FiTrash2 />
                          </IconButton>
                        </TableCell>
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
            count={filteredAndSortedAddresses.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 50]}
          />
        </Paper>

        {/* Add/Edit Address Dialog */}
        <Dialog open={formOpen} onClose={handleFormClose} fullWidth maxWidth="sm">
          <DialogTitle>{selectedAddress ? 'Edit Address' : 'Add Address'}</DialogTitle>
          <form onSubmit={handleFormSubmit}>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="Street"
                type="text"
                fullWidth
                required
                value={formData.ulice}
                onChange={(e) => setFormData({ ...formData, ulice: e.target.value })}
              />
              <TextField
                margin="dense"
                label="City"
                type="text"
                fullWidth
                required
                value={formData.mesto}
                onChange={(e) => setFormData({ ...formData, mesto: e.target.value })}
              />
              <TextField
                margin="dense"
                label="Postal Code"
                type="text"
                fullWidth
                required
                value={formData.psc}
                onChange={(e) => setFormData({ ...formData, psc: e.target.value })}
              />
              <TextField
                margin="dense"
                label="House Number"
                type="text"
                fullWidth
                required
                value={formData.cisloPopisne}
                onChange={(e) => setFormData({ ...formData, cisloPopisne: e.target.value })}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleFormClose}>Cancel</Button>
              <Button type="submit" color="primary">
                Save
              </Button>
            </DialogActions>
          </form>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteConfirmOpen} onClose={handleDeleteConfirmClose}>
          <DialogTitle>Delete Address?</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete the address "{selectedAddress?.ulice}, {selectedAddress?.mesto}"?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteConfirmClose}>Cancel</Button>
            <Button onClick={handleDelete} color="secondary">
              Delete
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
      </div>
    </div>
  );
}

export default AddressPanel;
