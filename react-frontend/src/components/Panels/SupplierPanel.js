// src/components/Panels/SupplierPanel.js

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
  IconButton,
  Snackbar,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  InputAdornment,
} from '@mui/material';
import { FiEdit2, FiTrash2, FiPlus, FiSearch, FiX } from 'react-icons/fi';
import AdminNavigation from './AdminNavigation';
import api from '../../services/api';

function SupplierPanel({ setActivePanel }) {
  const [suppliers, setSuppliers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [loading, setLoading] = useState(true);

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [formOpen, setFormOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [formData, setFormData] = useState({
    NAZEV: '',
    KONTAKTNI_OSOBA: '',
    TELEFON: '',
    EMAIL: '',
  });
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  // Fetch suppliers from the backend
  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/dodavatele');
      setSuppliers(response);
    } catch (error) {
      setSnackbar({ open: true, message: 'Error fetching suppliers', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  // Memoized filtered suppliers based on search query
  const filteredSuppliers = useMemo(() => {
    return suppliers.filter(
      (supplier) =>
        supplier.ID_DODAVATELU.toString().includes(searchQuery) ||
        supplier.NAZEV.toLowerCase().includes(searchQuery) ||
        supplier.KONTAKTNI_OSOBA.toLowerCase().includes(searchQuery) ||
        supplier.TELEFON.toString().includes(searchQuery) ||
        supplier.EMAIL.toLowerCase().includes(searchQuery)
    );
  }, [suppliers, searchQuery]);

  // Open form for adding or editing a supplier
  const handleFormOpen = (supplier = null) => {
    setSelectedSupplier(supplier);
    setFormData(
      supplier
        ? {
            NAZEV: supplier.NAZEV,
            KONTAKTNI_OSOBA: supplier.KONTAKTNI_OSOBA,
            TELEFON: supplier.TELEFON,
            EMAIL: supplier.EMAIL,
          }
        : { NAZEV: '', KONTAKTNI_OSOBA: '', TELEFON: '', EMAIL: '' }
    );
    setFormOpen(true);
  };

  // Close the form and reset formData
  const handleFormClose = () => {
    setFormOpen(false);
    setSelectedSupplier(null);
    setFormData({ NAZEV: '', KONTAKTNI_OSOBA: '', TELEFON: '', EMAIL: '' });
  };

  // Handle form submission for adding or editing a supplier
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoadingAction(true);
    try {
      const dataToSend = { ...formData };

      if (selectedSupplier) {
        await api.put(`/api/dodavatele/${selectedSupplier.ID_DODAVATELU}`, dataToSend);
        setSnackbar({ open: true, message: 'Supplier updated successfully', severity: 'success' });
      } else {
        await api.post('/api/dodavatele', dataToSend);
        setSnackbar({ open: true, message: 'Supplier added successfully', severity: 'success' });
      }
      fetchSuppliers();
      handleFormClose();
    } catch (error) {
      setSnackbar({ open: true, message: 'Error saving supplier', severity: 'error' });
    } finally {
      setLoadingAction(false);
    }
  };

  // Open delete confirmation dialog
  const handleDeleteConfirmOpen = (supplier) => {
    setSelectedSupplier(supplier);
    setDeleteConfirmOpen(true);
  };

  // Close delete confirmation dialog
  const handleDeleteConfirmClose = () => {
    setDeleteConfirmOpen(false);
    setSelectedSupplier(null);
  };

  // Handle deletion of a supplier
  const handleDelete = async () => {
    setLoadingAction(true);
    try {
      await api.delete(`/api/dodavatele/${selectedSupplier.ID_DODAVATELU}`);
      setSnackbar({ open: true, message: 'Supplier deleted successfully', severity: 'success' });
      fetchSuppliers();
      handleDeleteConfirmClose();
    } catch (error) {
      setSnackbar({ open: true, message: 'Error deleting supplier', severity: 'error' });
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

  // Render loading indicator if data is being fetched
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex' }}>
      {/* Sidebar Navigation */}
      <AdminNavigation setActivePanel={setActivePanel} />

      {/* Main Content */}
      <div style={{ flexGrow: 1, padding: '16px' }}>
        <Typography variant="h4" gutterBottom>
          Suppliers
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
            placeholder="Search by ID, Name, Contact Person, Phone, or Email..."
            variant="standard"
            fullWidth
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              endAdornment: searchQuery && (
                <InputAdornment position="end">
                  <IconButton onClick={() => setSearchQuery('')}>
                    <FiX />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Paper>

        {/* Add Supplier Button */}
        <Button
          variant="contained"
          color="primary"
          startIcon={<FiPlus />}
          onClick={() => handleFormOpen()}
          style={{ marginBottom: '16px' }}
        >
          Add Supplier
        </Button>

        {/* Suppliers Table */}
        <Paper sx={{ width: '100%', overflow: 'hidden', marginTop: 2 }}>
          <TableContainer>
            <Table stickyHeader aria-label="suppliers table">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Contact Person</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredSuppliers.length > 0 ? (
                  filteredSuppliers
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((supplier) => (
                      <TableRow hover key={supplier.ID_DODAVATELU}>
                        <TableCell>{supplier.ID_DODAVATELU}</TableCell>
                        <TableCell>{supplier.NAZEV}</TableCell>
                        <TableCell>{supplier.KONTAKTNI_OSOBA}</TableCell>
                        <TableCell>{supplier.TELEFON}</TableCell>
                        <TableCell>{supplier.EMAIL}</TableCell>
                        <TableCell align="right">
                          <IconButton onClick={() => handleFormOpen(supplier)} color="primary">
                            <FiEdit2 />
                          </IconButton>
                          <IconButton onClick={() => handleDeleteConfirmOpen(supplier)} color="secondary">
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
            count={filteredSuppliers.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </Paper>

        {/* Add/Edit Supplier Dialog */}
        <Dialog open={formOpen} onClose={handleFormClose} fullWidth maxWidth="sm">
          <DialogTitle>{selectedSupplier ? 'Edit Supplier' : 'Add Supplier'}</DialogTitle>
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
              {/* Contact Person Field */}
              <TextField
                margin="dense"
                label="Contact Person"
                type="text"
                fullWidth
                required
                value={formData.KONTAKTNI_OSOBA}
                onChange={(e) => setFormData({ ...formData, KONTAKTNI_OSOBA: e.target.value })}
              />
              {/* Phone Field */}
              <TextField
                margin="dense"
                label="Phone"
                type="number"
                fullWidth
                required
                value={formData.TELEFON}
                onChange={(e) => setFormData({ ...formData, TELEFON: e.target.value })}
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
          <DialogTitle>Delete Supplier?</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete supplier with ID {selectedSupplier?.ID_DODAVATELU}?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteConfirmClose}>Cancel</Button>
            <Button onClick={handleDelete} color="secondary" disabled={loadingAction}>
              {loadingAction ? <CircularProgress size={20} /> : 'Delete'}
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

export default SupplierPanel;
