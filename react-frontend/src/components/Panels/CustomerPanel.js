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
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import { FiEdit2, FiTrash2, FiPlus, FiSearch, FiX } from 'react-icons/fi';
import AdminNavigation from './AdminNavigation';
import api from '../../services/api';

function CustomerPanel({ setActivePanel }) {
  const [customers, setCustomers] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [loading, setLoading] = useState(true);

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [formOpen, setFormOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [formData, setFormData] = useState({
    TELEFON: '',
    ID_ADRESY: 0,
  });
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);

  useEffect(() => {
    fetchCustomers();
    fetchAddresses();
  }, []);

  // Fetch customers from the backend
  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/zakaznik/all');
      setCustomers(response);
    } catch (error) {
      setSnackbar({ open: true, message: 'Error fetching customers', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Fetch addresses from the backend
  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/addresses');
      console.log(response)
      setAddresses(response);  // Здесь сохраняются все адреса
    } catch (error) {
      setSnackbar({ open: true, message: 'Error fetching addresses', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  // Memoized filtered customers based on search query
  const filteredCustomers = useMemo(() => {
    return customers.filter(
      (customer) =>
        customer.ID_ZAKAZNIKU.toString().includes(searchQuery) ||
        customer.JMENO.toLowerCase().includes(searchQuery) ||
        customer.PRIJMENI.toLowerCase().includes(searchQuery) ||
        customer.TELEFON.toString().includes(searchQuery) ||
        customer.EMAIL.toLowerCase().includes(searchQuery) ||
        customer.ID_USER.toString().includes(searchQuery) ||
        `${customer.ID_ADRESY}: ${customer.ULICE} ${customer.CISLOPOPISNE}, ${customer.MESTO}, ${customer.PSC}`
          .toLowerCase()
          .includes(searchQuery)
    );
  }, [customers, searchQuery]);

  const handleFormOpen = (customer = null) => {
    if (customer) { // Allow form to open only for existing customers
      setSelectedCustomer(customer);
      setFormData({
        TELEFON: customer.TELEFON,
        ID_ADRESY: customer.ID_ADRESY,
      });
      setFormOpen(true);
    }
  };
  

  // Close the form and reset formData
  const handleFormClose = () => {
    setFormOpen(false);
    setSelectedCustomer(null);
    setFormData({ TELEFON: '', ID_ADRESY: 0 });
  };

  // Handle form submission for adding or editing a customer
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoadingAction(true);
    try {
      const dataToSend = { ...formData };

      // Add ID_ZAKAZNIKU for updating existing customer
      if (selectedCustomer) {
        dataToSend.ID_ZAKAZNIKU = selectedCustomer.ID_ZAKAZNIKU;  // Add the customer ID to the data
        await api.put(`/api/zakaznik/update`, dataToSend);  // Update customer
        setSnackbar({ open: true, message: 'Customer updated successfully', severity: 'success' });
      } else {
        await api.post('/api/zakaznik/create', dataToSend);  // Create new customer
        setSnackbar({ open: true, message: 'Customer added successfully', severity: 'success' });
      }
      fetchCustomers();  // Refresh the customer list
      handleFormClose();  // Close the form
    } catch (error) {
      setSnackbar({ open: true, message: 'Error saving customer', severity: 'error' });
    } finally {
      setLoadingAction(false);
    }
  };

  // Open delete confirmation dialog
  const handleDeleteConfirmOpen = (customer) => {
    setSelectedCustomer(customer);
    setDeleteConfirmOpen(true);
  };

  // Close delete confirmation dialog
  const handleDeleteConfirmClose = () => {
    setDeleteConfirmOpen(false);
    setSelectedCustomer(null);
  };

  // Handle deletion of a customer
  const handleDelete = async () => {
    setLoadingAction(true);
    try {
      await api.delete(`/api/zakaznik/delete/${selectedCustomer.ID_ZAKAZNIKU}`);
      setSnackbar({ open: true, message: 'Customer deleted successfully', severity: 'success' });
      fetchCustomers();
      handleDeleteConfirmClose();
    } catch (error) {
      setSnackbar({ open: true, message: 'Error deleting customer', severity: 'error' });
    } finally {
      setLoadingAction(false);
    }
  };

  // Validate phone number (at least 9 digits)
  const validatePhoneNumber = (number) => {
    return /^[0-9]{9,}$/.test(number);
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
          Customers
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
            placeholder="Search by ID, Name, Last Name, User ID, Phone, Email, or Address..."
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
        {/* Customers Table */}
        <Paper sx={{ width: '100%', overflow: 'hidden', marginTop: 2 }}>
          <TableContainer>
            <Table stickyHeader aria-label="customers table">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>First Name</TableCell>
                  <TableCell>Last Name</TableCell>
                  <TableCell>User ID</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Address</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredCustomers.length > 0 ? (
                  filteredCustomers
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((customer) => (
                      <TableRow key={customer.ID_ZAKAZNIKU}>
                        <TableCell>{customer.ID_ZAKAZNIKU}</TableCell>
                        <TableCell>{customer.JMENO}</TableCell>
                        <TableCell>{customer.PRIJMENI}</TableCell>
                        <TableCell>{customer.ID_USER}</TableCell>
                        <TableCell>{customer.TELEFON}</TableCell>
                        <TableCell>{customer.EMAIL}</TableCell>
                        <TableCell>{`${customer.ID_ADRESY}. ${customer.ULICE} ${customer.CISLOPOPISNE}, ${customer.MESTO}, ${customer.PSC}`}</TableCell>
                        <TableCell align="right">
                          <IconButton onClick={() => handleFormOpen(customer)}>
                            <FiEdit2 />
                          </IconButton>
                          <IconButton onClick={() => handleDeleteConfirmOpen(customer)}>
                            <FiTrash2 />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      No customers found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredCustomers.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(event, newPage) => setPage(newPage)}
            onRowsPerPageChange={(event) => setRowsPerPage(parseInt(event.target.value, 10))}
          />
        </Paper>

        {/* Customer Form Dialog */}
        <Dialog open={formOpen} onClose={handleFormClose}>
          <DialogTitle>{selectedCustomer ? 'Edit Customer' : 'Add Customer'}</DialogTitle>
          <DialogContent>
            <TextField
              label="Phone Number"
              fullWidth
              value={formData.TELEFON}
              onChange={(e) =>
                setFormData((prevData) => ({ ...prevData, TELEFON: e.target.value }))
              }
              margin="normal"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Address</InputLabel>
              <Select
                value={formData.ID_ADRESY}
                onChange={(e) =>
                  setFormData((prevData) => ({ ...prevData, ID_ADRESY: e.target.value }))
                }
              >
                {addresses.map((address) => (
                  <MenuItem key={address.idAdresy} value={address.idAdresy}>
                    {address.idAdresy}. {address.ulice} {address.cisloPopisne}, {address.mesto}, {address.psc}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleFormClose} color="primary">
              Cancel
            </Button>
            <Button
              onClick={handleFormSubmit}
              color="primary"
              disabled={!validatePhoneNumber(formData.TELEFON)}
            >
              {selectedCustomer ? 'Save' : 'Add'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteConfirmOpen} onClose={handleDeleteConfirmClose}>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            Are you sure you want to delete this customer?
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteConfirmClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleDelete} color="secondary">
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for messages */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
}

export default CustomerPanel;
