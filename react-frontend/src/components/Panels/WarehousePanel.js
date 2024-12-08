// src/components/Panels/WarehousePanel.js

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

function WarehousePanel({ setActivePanel }) {
  const [warehouses, setWarehouses] = useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [formData, setFormData] = useState({ NAZEV: '', EMAIL: '', TELEFON: '', ADRESA_ID_ADRESY: '' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Sorting
  const [order, setOrder] = useState('asc'); // 'asc' or 'desc'
  const [orderBy, setOrderBy] = useState('ID_SKLADU'); // Column to sort by

  // Search
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchWarehouses();
  }, []);

  // Fetch warehouses from the backend
  const fetchWarehouses = async () => {
    try {
      const response = await api.get('/api/sklads');
      console.log('Warehouses:', response);
      setWarehouses(response);
    } catch (error) {
      console.error('Error loading warehouses:', error);
      setSnackbar({ open: true, message: 'Error loading warehouses', severity: 'error' });
    }
  };

  // Open the add/edit form
  const handleFormOpen = (warehouse = null) => {
    setSelectedWarehouse(warehouse);
    setFormData(
      warehouse
        ? {
            NAZEV: warehouse.NAZEV,
            EMAIL: warehouse.EMAIL,
            TELEFON: warehouse.TELEFON,
            ADRESA_ID_ADRESY: warehouse.ADRESA_ID_ADRESY,
          }
        : { NAZEV: '', EMAIL: '', TELEFON: '', ADRESA_ID_ADRESY: '' }
    );
    setFormOpen(true);
  };

  // Close the add/edit form
  const handleFormClose = () => {
    setFormOpen(false);
    setSelectedWarehouse(null);
    setFormData({ NAZEV: '', EMAIL: '', TELEFON: '', ADRESA_ID_ADRESY: '' });
  };

  // Handle form submission for add/edit
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedWarehouse) {
        await api.put(`/api/sklads/${selectedWarehouse.ID_SKLADU}`, formData);
        setSnackbar({ open: true, message: 'Warehouse updated successfully', severity: 'success' });
      } else {
        await api.post('/api/sklads', formData);
        setSnackbar({ open: true, message: 'Warehouse added successfully', severity: 'success' });
      }
      fetchWarehouses();
      handleFormClose();
    } catch (error) {
      console.error('Error saving warehouse:', error);
      const errorMessage = error.response?.data || 'Error saving warehouse';
      setSnackbar({ open: true, message: errorMessage, severity: 'error' });
    }
  };

  // Open delete confirmation dialog
  const handleDeleteConfirmOpen = (warehouse) => {
    setSelectedWarehouse(warehouse);
    setDeleteConfirmOpen(true);
  };

  // Close delete confirmation dialog
  const handleDeleteConfirmClose = () => {
    setDeleteConfirmOpen(false);
    setSelectedWarehouse(null);
  };

  // Handle warehouse deletion
  const handleDelete = async () => {
    try {
      await api.delete(`/api/sklads/${selectedWarehouse.ID_SKLADU}`);
      setSnackbar({ open: true, message: 'Warehouse deleted successfully', severity: 'success' });
      fetchWarehouses();
      handleDeleteConfirmClose();
    } catch (error) {
      console.error('Error deleting warehouse:', error);
      const errorMessage = error.response?.data || 'Error deleting warehouse';
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

  // Memoized filtered and sorted warehouses
  const filteredAndSortedWarehouses = useMemo(() => {
    // Apply search filter
    const filtered = warehouses.filter((warehouse) => {
      const searchStr = searchTerm.toLowerCase();
      return (
        warehouse.ID_SKLADU.toString().includes(searchStr) ||
        warehouse.NAZEV.toLowerCase().includes(searchStr) ||
        warehouse.EMAIL.toLowerCase().includes(searchStr) ||
        warehouse.TELEFON.toLowerCase().includes(searchStr) ||
        warehouse.ADRESA_ID_ADRESY.toString().includes(searchStr)
      );
    });

    // Sort the filtered warehouses
    return filtered.slice().sort(comparator);
  }, [warehouses, order, orderBy, searchTerm]);

  return (
    <div style={{ display: 'flex' }}>
      {/* Navigation */}
      <AdminNavigation setActivePanel={setActivePanel} />

      {/* Warehouse Panel Content */}
      <div style={{ flexGrow: 1, padding: '16px' }}>
        <Typography variant="h4" gutterBottom>
          Warehouses
        </Typography>

        {/* Add Warehouse Button */}
        <Button
          variant="contained"
          color="primary"
          startIcon={<FiPlus />}
          onClick={() => handleFormOpen()}
          style={{ marginBottom: '16px' }}
        >
          Add Warehouse
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

        {/* Warehouses Table */}
        <Paper sx={{ width: '100%', overflow: 'hidden', marginTop: 2 }}>
          <TableContainer>
            <Table stickyHeader aria-label="warehouses table">
              <TableHead>
                <TableRow>
                  {/* ID Column with Sorting */}
                  <TableCell sortDirection={orderBy === 'ID_SKLADU' ? order : false}>
                    <TableSortLabel
                      active={orderBy === 'ID_SKLADU'}
                      direction={orderBy === 'ID_SKLADU' ? order : 'asc'}
                      onClick={() => handleRequestSort('ID_SKLADU')}
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
                {filteredAndSortedWarehouses.length > 0 ? (
                  filteredAndSortedWarehouses
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((warehouse) => (
                      <TableRow hover key={warehouse.ID_SKLADU}>
                        <TableCell>{warehouse.ID_SKLADU}</TableCell>
                        <TableCell>{warehouse.NAZEV}</TableCell>
                        <TableCell>{warehouse.EMAIL}</TableCell>
                        <TableCell>{warehouse.TELEFON}</TableCell>
                        <TableCell>{warehouse.ADRESA_ID_ADRESY}</TableCell>
                        <TableCell align="right">
                          <IconButton onClick={() => handleFormOpen(warehouse)} color="primary">
                            <FiEdit2 />
                          </IconButton>
                          <IconButton onClick={() => handleDeleteConfirmOpen(warehouse)} color="secondary">
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
            count={filteredAndSortedWarehouses.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 50]}
          />
        </Paper>

        {/* Add/Edit Warehouse Dialog */}
        <Dialog open={formOpen} onClose={handleFormClose} fullWidth maxWidth="sm">
          <DialogTitle>{selectedWarehouse ? 'Edit Warehouse' : 'Add Warehouse'}</DialogTitle>
          <form onSubmit={handleFormSubmit}>
            <DialogContent>
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
              <TextField
                margin="dense"
                label="Email"
                type="email"
                fullWidth
                required
                value={formData.EMAIL}
                onChange={(e) => setFormData({ ...formData, EMAIL: e.target.value })}
              />
              <TextField
                margin="dense"
                label="Phone"
                type="text"
                fullWidth
                required
                value={formData.TELEFON}
                onChange={(e) => setFormData({ ...formData, TELEFON: e.target.value })}
              />
              <TextField
                margin="dense"
                label="Address ID"
                type="number"
                fullWidth
                required
                value={formData.ADRESA_ID_ADRESY}
                onChange={(e) => setFormData({ ...formData, ADRESA_ID_ADRESY: e.target.value })}
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
          <DialogTitle>Delete Warehouse?</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete the warehouse "{selectedWarehouse?.NAZEV}"?
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

export default WarehousePanel;
