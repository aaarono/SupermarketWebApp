// src/components/Panels/SupermarketPanel.js

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
  Select,
  MenuItem,
  IconButton,
  Snackbar,
  Alert,
  TableSortLabel,
  InputAdornment,
} from '@mui/material';
import { FiEdit2, FiTrash2, FiPlus, FiSearch, FiX } from 'react-icons/fi';
import AdminNavigation from './AdminNavigation';
import api from '../../services/api';

function SupermarketPanel({ setActivePanel }) {
  const [supermarkets, setSupermarkets] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedSupermarket, setSelectedSupermarket] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [formData, setFormData] = useState({ NAZEV: '', EMAIL: '', TELEFON: '', ADRESA_ID_ADRESY: '' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Sorting
  const [order, setOrder] = useState('asc'); // 'asc' or 'desc'
  const [orderBy, setOrderBy] = useState('ID_SUPERMARKETU'); // Column to sort by

  // Search
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchSupermarkets();
    fetchAddresses();
  }, []);

  // Fetch supermarkets from the backend
  const fetchSupermarkets = async () => {
    try {
      const response = await api.get('/api/supermarkets');
      console.log('Supermarkets:', response);
      setSupermarkets(response);
    } catch (error) {
      console.error('Error loading supermarkets:', error);
      setSnackbar({ open: true, message: 'Error loading supermarkets', severity: 'error' });
    }
  };

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
  const handleFormOpen = (supermarket = null) => {
    setSelectedSupermarket(supermarket);
    setFormData(
      supermarket
        ? {
            NAZEV: supermarket.NAZEV,
            EMAIL: supermarket.EMAIL,
            TELEFON: supermarket.TELEFON,
            ADRESA_ID_ADRESY: supermarket.ADRESA_ID_ADRESY,
          }
        : { NAZEV: '', EMAIL: '', TELEFON: '', ADRESA_ID_ADRESY: '' }
    );
    setFormOpen(true);
  };

  // Close the add/edit form
  const handleFormClose = () => {
    setFormOpen(false);
    setSelectedSupermarket(null);
    setFormData({ NAZEV: '', EMAIL: '', TELEFON: '', ADRESA_ID_ADRESY: '' });
  };

  // Handle form submission for add/edit
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedSupermarket) {
        await api.put(`/api/supermarkets/${selectedSupermarket.ID_SUPERMARKETU}`, formData);
        setSnackbar({ open: true, message: 'Supermarket updated successfully', severity: 'success' });
      } else {
        await api.post('/api/supermarkets', formData);
        setSnackbar({ open: true, message: 'Supermarket added successfully', severity: 'success' });
      }
      fetchSupermarkets();
      handleFormClose();
    } catch (error) {
      console.error('Error saving supermarket:', error);
      const errorMessage = error.response?.data || 'Error saving supermarket';
      setSnackbar({ open: true, message: errorMessage, severity: 'error' });
    }
  };

  // Open delete confirmation dialog
  const handleDeleteConfirmOpen = (supermarket) => {
    setSelectedSupermarket(supermarket);
    setDeleteConfirmOpen(true);
  };

  // Close delete confirmation dialog
  const handleDeleteConfirmClose = () => {
    setDeleteConfirmOpen(false);
    setSelectedSupermarket(null);
  };

  // Handle supermarket deletion
  const handleDelete = async () => {
    try {
      await api.delete(`/api/supermarkets/${selectedSupermarket.ID_SUPERMARKETU}`);
      setSnackbar({ open: true, message: 'Supermarket deleted successfully', severity: 'success' });
      fetchSupermarkets();
      handleDeleteConfirmClose();
    } catch (error) {
      console.error('Error deleting supermarket:', error);
      const errorMessage = error.response?.data || 'Error deleting supermarket';
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

  // Memoized filtered and sorted supermarkets
  const filteredAndSortedSupermarkets = useMemo(() => {
    // Apply search filter
    const filtered = supermarkets.filter((supermarket) => {
      const searchStr = searchTerm.toLowerCase();
      return (
        supermarket.ID_SUPERMARKETU.toString().includes(searchStr) ||
        supermarket.NAZEV.toLowerCase().includes(searchStr) ||
        supermarket.EMAIL.toLowerCase().includes(searchStr) ||
        supermarket.TELEFON.toLowerCase().includes(searchStr) ||
        supermarket.ADRESA_ID_ADRESY.toString().includes(searchStr)
      );
    });

    // Sort the filtered supermarkets
    return filtered.slice().sort(comparator);
  }, [supermarkets, order, orderBy, searchTerm]);

  return (
    <div style={{ display: 'flex' }}>
      {/* Navigation */}
      <AdminNavigation setActivePanel={setActivePanel} />

      {/* Supermarket Panel Content */}
      <div style={{ flexGrow: 1, padding: '16px' }}>
        <Typography variant="h4" gutterBottom>
          Supermarkets
        </Typography>

        {/* Add Supermarket Button */}
        <Button
          variant="contained"
          color="primary"
          startIcon={<FiPlus />}
          onClick={() => handleFormOpen()}
          style={{ marginBottom: '16px' }}
        >
          Add Supermarket
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

        {/* Supermarkets Table */}
        <Paper sx={{ width: '100%', overflow: 'hidden', marginTop: 2 }}>
          <TableContainer>
            <Table stickyHeader aria-label="supermarkets table">
              <TableHead>
                <TableRow>
                  {/* ID Column with Sorting */}
                  <TableCell sortDirection={orderBy === 'ID_SUPERMARKETU' ? order : false}>
                    <TableSortLabel
                      active={orderBy === 'ID_SUPERMARKETU'}
                      direction={orderBy === 'ID_SUPERMARKETU' ? order : 'asc'}
                      onClick={() => handleRequestSort('ID_SUPERMARKETU')}
                    >
                      ID
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Address ID</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAndSortedSupermarkets.length > 0 ? (
                  filteredAndSortedSupermarkets
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((supermarket) => (
                      <TableRow hover key={supermarket.ID_SUPERMARKETU}>
                        <TableCell>{supermarket.ID_SUPERMARKETU}</TableCell>
                        <TableCell>{supermarket.NAZEV}</TableCell>
                        <TableCell>{supermarket.EMAIL}</TableCell>
                        <TableCell>{supermarket.TELEFON}</TableCell>
                        <TableCell>
                          {addresses.find((a) => a.idAdresy === supermarket.ADRESA_ID_ADRESY)?.mesto || 'No Address'}
                        </TableCell>
                        <TableCell align="right">
                          <IconButton onClick={() => handleFormOpen(supermarket)} color="primary">
                            <FiEdit2 />
                          </IconButton>
                          <IconButton onClick={() => handleDeleteConfirmOpen(supermarket)} color="secondary">
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
            count={filteredAndSortedSupermarkets.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 50]}
          />
        </Paper>

        {/* Add/Edit Supermarket Dialog */}
        <Dialog open={formOpen} onClose={handleFormClose} fullWidth maxWidth="sm">
          <DialogTitle>{selectedSupermarket ? 'Edit Supermarket' : 'Add Supermarket'}</DialogTitle>
          <form onSubmit={handleFormSubmit}>
            <DialogContent>
              {/* Name Field */}
              <TextField
                autoFocus
                margin="dense"
                label="Name"
                type="text"
                fullWidth
                required
                value={formData.NAZEV}
                onChange={(e) => setFormData({ ...formData, NAZEV: e.target.value })}
              />
              {/* Email Field */}
              <TextField
                margin="dense"
                label="Email"
                type="email"
                fullWidth
                required
                value={formData.EMAIL}
                onChange={(e) => setFormData({ ...formData, EMAIL: e.target.value })}
              />
              {/* Phone Field */}
              <TextField
                margin="dense"
                label="Phone"
                type="text"
                fullWidth
                required
                value={formData.TELEFON}
                onChange={(e) => setFormData({ ...formData, TELEFON: e.target.value })}
              />
              {/* Address Selection */}
              <Select
                fullWidth
                displayEmpty
                value={formData.ADRESA_ID_ADRESY}
                onChange={(e) => setFormData({ ...formData, ADRESA_ID_ADRESY: e.target.value })}
                required
                sx={{ marginTop: '16px' }}
              >
                <MenuItem value="">
                  <em>Select Address</em>
                </MenuItem>
                {addresses.map((address) => (
                  <MenuItem key={address.idAdresy} value={address.idAdresy}>
                    {address.mesto}
                  </MenuItem>
                ))}
              </Select>
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
          <DialogTitle>Delete Supermarket?</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete the supermarket "{selectedSupermarket?.NAZEV}"?
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

export default SupermarketPanel;
