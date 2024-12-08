// src/components/Panels/PaymentPanel.js

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

function PaymentPanel({ setActivePanel }) {
  const [payments, setPayments] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Search
  const [searchTerm, setSearchTerm] = useState('');

  const [formOpen, setFormOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [formData, setFormData] = useState({
    suma: '',
    datum: '',
    typ: '',
    objednavkaId: '',
  });
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  // Fetch payments from the backend
  const fetchPayments = async () => {
    try {
      const response = await api.get('/api/payments');
      setPayments(response);
      setLoading(false);
    } catch (error) {
      console.error('Error loading payments:', error);
      setSnackbar({ open: true, message: 'Error loading payments', severity: 'error' });
      setLoading(false);
    }
  };

  // Open the add/edit form
  const handleFormOpen = (payment = null) => {
    setSelectedPayment(payment);
    setFormData(
      payment
        ? {
            suma: payment.suma,
            datum: payment.datum ? new Date(payment.datum).toISOString().substr(0, 10) : '',
            typ: payment.typ,
            objednavkaId: payment.objednavkaId,
          }
        : { suma: '', datum: '', typ: '', objednavkaId: '' }
    );
    setFormOpen(true);
  };

  // Close the add/edit form
  const handleFormClose = () => {
    setFormOpen(false);
    setSelectedPayment(null);
    setFormData({ suma: '', datum: '', typ: '', objednavkaId: '' });
  };

  // Handle form submission for add/edit
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        suma: formData.suma,
        datum: formData.datum,
        typ: formData.typ,
        objednavkaId: formData.objednavkaId,
      };

      if (selectedPayment) {
        await api.put(`/api/payments/${selectedPayment.id}`, dataToSend);
        setSnackbar({ open: true, message: 'Payment updated successfully', severity: 'success' });
      } else {
        await api.post('/api/payments', dataToSend);
        setSnackbar({ open: true, message: 'Payment added successfully', severity: 'success' });
      }
      fetchPayments();
      handleFormClose();
    } catch (error) {
      console.error('Error saving payment:', error);
      const errorMessage = error.response?.data || 'Error saving payment';
      setSnackbar({ open: true, message: errorMessage, severity: 'error' });
    }
  };

  // Open delete confirmation dialog
  const handleDeleteConfirmOpen = (payment) => {
    setSelectedPayment(payment);
    setDeleteConfirmOpen(true);
  };

  // Close delete confirmation dialog
  const handleDeleteConfirmClose = () => {
    setDeleteConfirmOpen(false);
    setSelectedPayment(null);
  };

  // Handle payment deletion
  const handleDelete = async () => {
    try {
      await api.delete(`/api/payments/${selectedPayment.id}`);
      setSnackbar({ open: true, message: 'Payment deleted successfully', severity: 'success' });
      fetchPayments();
      handleDeleteConfirmClose();
    } catch (error) {
      console.error('Error deleting payment:', error);
      const errorMessage = error.response?.data || 'Error deleting payment';
      setSnackbar({ open: true, message: errorMessage, severity: 'error' });
    }
  };

  // Handle pagination page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle pagination rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value || 5);
    setPage(0);
  };

  // Handle sorting (optional, can be removed if not needed)
  // const [order, setOrder] = useState('asc'); // 'asc' or 'desc'
  // const [orderBy, setOrderBy] = useState('id'); // Column to sort by

  // // Handle sorting
  // const handleRequestSort = (property) => {
  //   const isAsc = orderBy === property && order === 'asc';
  //   setOrder(isAsc ? 'desc' : 'asc');
  //   setOrderBy(property);
  // };

  // // Sorting comparator function
  // const comparator = (a, b) => {
  //   if (a[orderBy] < b[orderBy]) {
  //     return order === 'asc' ? -1 : 1;
  //   }
  //   if (a[orderBy] > b[orderBy]) {
  //     return order === 'asc' ? 1 : -1;
  //   }
  //   return 0;
  // };

  // // Memoized filtered and sorted payments
  // const filteredAndSortedPayments = useMemo(() => {
  //   // Apply search filter
  //   const filtered = payments.filter((payment) => {
  //     const searchStr = searchTerm.toLowerCase();
  //     return (
  //       payment.id.toString().includes(searchStr) ||
  //       payment.suma.toString().includes(searchStr) ||
  //       (payment.datum && payment.datum.toLowerCase().includes(searchStr)) ||
  //       payment.typ.toLowerCase().includes(searchStr) ||
  //       payment.objednavkaId.toString().includes(searchStr)
  //     );
  //   });

  //   // Sort the filtered payments
  //   return filtered.slice().sort(comparator);
  // }, [payments, order, orderBy, searchTerm]);

  // Memoized filtered payments
  const filteredPayments = useMemo(() => {
    // Apply search filter
    const filtered = payments.filter((payment) => {
      const searchStr = searchTerm.toLowerCase();
      return (
        payment.id.toString().includes(searchStr) ||
        payment.suma.toString().includes(searchStr) ||
        (payment.datum && payment.datum.toLowerCase().includes(searchStr)) ||
        payment.typ.toLowerCase().includes(searchStr) ||
        payment.objednavkaId.toString().includes(searchStr)
      );
    });

    return filtered;
  }, [payments, searchTerm]);

  // Check if data is still loading
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

      {/* Payment Panel Content */}
      <div style={{ flexGrow: 1, padding: '16px' }}>
        <Typography variant="h4" gutterBottom>
          Payments
        </Typography>

        {/* Add Payment Button */}
        <Button
          variant="contained"
          color="primary"
          startIcon={<FiPlus />}
          onClick={() => handleFormOpen()}
          style={{ marginBottom: '16px' }}
        >
          Add Payment
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

        {/* Payments Table */}
        <Paper sx={{ width: '100%', overflow: 'hidden', marginTop: 2 }}>
          <TableContainer>
            <Table stickyHeader aria-label="payments table">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Order ID</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredPayments.length > 0 ? (
                  filteredPayments
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((payment) => (
                      <TableRow hover key={payment.id}>
                        <TableCell>{payment.id}</TableCell>
                        <TableCell>{payment.suma}</TableCell>
                        <TableCell>{new Date(payment.datum).toLocaleDateString()}</TableCell>
                        <TableCell>{payment.typ}</TableCell>
                        <TableCell>{payment.objednavkaId}</TableCell>
                        <TableCell align="right">
                          <IconButton onClick={() => handleFormOpen(payment)} color="primary">
                            <FiEdit2 />
                          </IconButton>
                          <IconButton onClick={() => handleDeleteConfirmOpen(payment)} color="secondary">
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
            count={filteredPayments.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </Paper>

        {/* Add/Edit Payment Dialog */}
        <Dialog open={formOpen} onClose={handleFormClose} fullWidth maxWidth="sm">
          <DialogTitle>{selectedPayment ? 'Edit Payment' : 'Add Payment'}</DialogTitle>
          <form onSubmit={handleFormSubmit}>
            <DialogContent>
              {/* Amount Field */}
              <TextField
                autoFocus
                margin="dense"
                label="Amount"
                type="number"
                fullWidth
                required
                value={formData.suma}
                onChange={(e) => setFormData({ ...formData, suma: parseFloat(e.target.value) })}
              />
              {/* Date Field */}
              <TextField
                margin="dense"
                label="Date"
                type="date"
                fullWidth
                required
                InputLabelProps={{
                  shrink: true,
                }}
                value={formData.datum}
                onChange={(e) => setFormData({ ...formData, datum: e.target.value })}
              />
              {/* Type Field */}
              <TextField
                margin="dense"
                label="Type"
                type="text"
                fullWidth
                required
                value={formData.typ}
                onChange={(e) => setFormData({ ...formData, typ: e.target.value })}
              />
              {/* Order ID Field */}
              <TextField
                margin="dense"
                label="Order ID"
                type="number"
                fullWidth
                required
                value={formData.objednavkaId}
                onChange={(e) => setFormData({ ...formData, objednavkaId: parseInt(e.target.value, 10) })}
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
          <DialogTitle>Delete Payment?</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete the payment with ID {selectedPayment?.id}?
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

export default PaymentPanel;
