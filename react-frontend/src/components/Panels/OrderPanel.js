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
  IconButton,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  InputAdornment
} from '@mui/material';
import { FiEdit2, FiSearch, FiX } from 'react-icons/fi';
import AdminNavigation from './AdminNavigation';
import api from '../../services/api';

function OrderPanel({ setActivePanel }) {
  const [orders, setOrders] = useState([]);
  const [orderStatuses, setOrderStatuses] = useState([]);
  const [supermarkets, setSupermarkets] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const [searchQuery, setSearchQuery] = useState('');
  
  // Sorting
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc'); // or 'desc'

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Editing states
  const [editOpen, setEditOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [formData, setFormData] = useState({
    ID_OBJEDNAVKY: '',
    DATUM: '',
    STATUS_ID: '',
    ZAKAZNIK_ID_ZAKAZNIKU: '',
    SUPERMARKET_ID_SUPERMARKETU: ''
  });

  useEffect(() => {
    // Сначала загружаем статусы и супермаркеты, затем заказы
    const fetchData = async () => {
      try {
        // Запрос статусов
        const statusesResponse = await api.get('/api/order-statuses');
        setOrderStatuses(Array.isArray(statusesResponse) ? statusesResponse : [statusesResponse]);

        // Запрос супермаркетов
        const marketsResponse = await api.get('/api/supermarkets');
        setSupermarkets(Array.isArray(marketsResponse) ? marketsResponse : [marketsResponse]);

        // Запрос заказов после получения статусов и супермаркетов
        fetchOrders();
      } catch (error) {
        console.error('Error fetching initial data:', error);
      }
    };

    fetchData();
  }, []);

  const fetchOrdersStatuses = async () => {
    try {
      const response = await api.get('/api/order-statuses');
      console.log(response)
      setOrderStatuses(Array.isArray(response) ? response : [response]);
    } catch (error) {
      console.error('Error fetching order statuses:', error);
    }
  };

  const fetchSupermarkets = async () => {
    try {
      const response = await api.get('/api/supermarkets');
      console.log(response)
      setSupermarkets(Array.isArray(response) ? response : [response]);
    } catch (error) {
      console.error('Error fetching supermarkets:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await api.get('/api/orders/admin');
      const ordersArray = Array.isArray(response) ? response : [response];
      
      console.log(response)
      const formattedOrders = ordersArray.map(order => {
        // Находим статус по ID
        const foundStatus = orderStatuses.find(s => s.ID_STATUS === order.STATUS_ID);
        const statusName = foundStatus ? foundStatus.NAZEV : 'Unknown';
      


        // Находим супермаркет по ID
        const foundMarket = supermarkets.find(m => m.ID_SUPERMARKETU === order.SUPERMARKET_ID_SUPERMARKETU);
        const supermarketName = foundMarket ? foundMarket.NAZEV : 'Unknown';

        return {
          id: order.ID_OBJEDNAVKY,
          orderDate: new Date(order.DATUM).toLocaleString(),
          rawDate: order.DATUM,
          customerId: order.ZAKAZNIK_ID_ZAKAZNIKU,
          statusId: order.STATUS_ID,
          statusName: statusName,          // Используем найденное название статуса
          supermarketId: order.SUPERMARKET_ID_SUPERMARKETU,
          supermarketName: supermarketName, // Используем найденное название супермаркета
          totalAmount: calculateTotalAmount(order.SUPERMARKET_ID_SUPERMARKETU),
        };
      });
      
      setOrders(formattedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const getStatusLabel = (statusId) => {
    const status = orderStatuses.find(s => s.ID_STATUS === statusId);
    return status ? status.NAZEV : 'Unknown';
  };

  const getSupermarketName = (supermarketId) => {
    const market = supermarkets.find(m => m.ID_SUPERMARKETU === supermarketId);
    return market ? market.NAZEV : 'Unknown';
  };

  const calculateTotalAmount = (supermarketId) => {
    return supermarketId * 100; // Example
  };

  // Filtering (search)
  const filteredOrders = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return orders.filter(order => {
      return (
        order.id.toString().toLowerCase().includes(query) ||
        order.customerId.toString().toLowerCase().includes(query) ||
        order.orderDate.toLowerCase().includes(query) ||
        order.statusName.toLowerCase().includes(query) ||
        order.totalAmount.toString().toLowerCase().includes(query) ||
        order.supermarketName.toLowerCase().includes(query)
      );
    });
  }, [orders, searchQuery]);

  // Sorting logic
  const sortedOrders = useMemo(() => {
    if (!sortField) return filteredOrders;
    const sorted = [...filteredOrders].sort((a, b) => {
      let aVal, bVal;
      if (sortField === 'id') {
        aVal = a.id;
        bVal = b.id;
      } else if (sortField === 'statusName') {
        aVal = a.statusName.toLowerCase();
        bVal = b.statusName.toLowerCase();
      }
      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredOrders, sortField, sortOrder]);

  const handleSort = (field) => {
    if (sortField === field) {
      // Toggle sort order
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Edit dialog functions
  const handleEditOpen = (order) => {
    setSelectedOrder(order);
    const date = new Date(order.rawDate);
    const localISO = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0,16);

    setFormData({
      ID_OBJEDNAVKY: order.id,
      DATUM: localISO,
      STATUS_ID: order.statusId,
      ZAKAZNIK_ID_ZAKAZNIKU: order.customerId,
      SUPERMARKET_ID_SUPERMARKETU: order.supermarketId
    });
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
    setSelectedOrder(null);
    setFormData({
      ID_OBJEDNAVKY: '',
      DATUM: '',
      STATUS_ID: '',
      ZAKAZNIK_ID_ZAKAZNIKU: '',
      SUPERMARKET_ID_SUPERMARKETU: ''
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!selectedOrder) return;

    try {
      const dateObj = new Date(formData.DATUM);
  
      // Форматируем дату как yyyy-MM-dd HH:mm:ss
      const formattedDate = dateObj.getFullYear() +
        '-' +
        String(dateObj.getMonth() + 1).padStart(2, '0') +
        '-' +
        String(dateObj.getDate()).padStart(2, '0') +
        ' ' +
        String(dateObj.getHours()).padStart(2, '0') +
        ':' +
        String(dateObj.getMinutes()).padStart(2, '0') +
        ':' +
        String(dateObj.getSeconds()).padStart(2, '0');
  
      await api.put(`/api/orders/admin`, {
        ID_OBJEDNAVKY: formData.ID_OBJEDNAVKY,
        DATUM: formattedDate, 
        STATUS_ID: formData.STATUS_ID,
        ZAKAZNIK_ID_ZAKAZNIKU: formData.ZAKAZNIK_ID_ZAKAZNIKU,
        SUPERMARKET_ID_SUPERMARKETU: formData.SUPERMARKET_ID_SUPERMARKETU
      });
      
      setSnackbar({ open: true, message: 'Order successfully updated', severity: 'success' });
      fetchOrders();
      handleEditClose();
    } catch (error) {
      console.error('Error updating order:', error);
      setSnackbar({ open: true, message: 'Error updating order', severity: 'error' });
    }
  };

  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <div style={{ display: 'flex' }}>
      {/* Navigation */}
      <AdminNavigation setActivePanel={setActivePanel} />

      {/* Main Content */}
      <div style={{ flexGrow: 1, padding: '16px' }}>
        <Typography variant="h4" gutterBottom>
          Orders
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
            placeholder="Search by any field..."
            variant="standard"
            fullWidth
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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

        <Paper sx={{ width: '100%', overflow: 'hidden', marginTop: 2 }}>
          <TableContainer>
            <Table stickyHeader aria-label="orders table">
              <TableHead>
                <TableRow>
                  <TableCell
                    onClick={() => handleSort('id')}
                    style={{ cursor: 'pointer', fontWeight: sortField === 'id' ? 'bold' : 'normal' }}
                  >
                    ID {sortField === 'id' && (sortOrder === 'asc' ? '▲' : '▼')}
                  </TableCell>
                  <TableCell>Customer (ID)</TableCell>
                  <TableCell>Order Date</TableCell>
                  <TableCell
                    onClick={() => handleSort('statusName')}
                    style={{ cursor: 'pointer', fontWeight: sortField === 'statusName' ? 'bold' : 'normal' }}
                  >
                    Status {sortField === 'statusName' && (sortOrder === 'asc' ? '▲' : '▼')}
                  </TableCell>
                  <TableCell>Supermarket</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedOrders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((order) => (
                  <TableRow hover key={order.id}>
                    <TableCell>{order.id}</TableCell>
                    <TableCell>{order.customerId}</TableCell>
                    <TableCell>{order.orderDate}</TableCell>
                    <TableCell>{order.statusName}</TableCell>
                    <TableCell>{order.supermarketName}</TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => handleEditOpen(order)}>
                        <FiEdit2 />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {sortedOrders.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      No data
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={sortedOrders.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>

        {/* Edit Order Dialog */}
        <Dialog open={editOpen} onClose={handleEditClose}>
          <DialogTitle>Edit Order</DialogTitle>
          <DialogContent>
            <Box component="form" sx={{ mt: 2 }}>

              <TextField
                label="Order Date"
                type="datetime-local"
                fullWidth
                value={formData.DATUM}
                onChange={(e) => setFormData({ ...formData, DATUM: e.target.value })}
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
              />

              <FormControl fullWidth margin="normal">
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.STATUS_ID}
                  label="Status"
                  onChange={(e) => setFormData({ ...formData, STATUS_ID: e.target.value })}
                >
                  {orderStatuses.map((status) => (
                    <MenuItem key={status.ID_STATUS} value={status.ID_STATUS}>
                      {status.NAZEV}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label="User ID (Customer)"
                fullWidth
                value={formData.ZAKAZNIK_ID_ZAKAZNIKU}
                onChange={(e) => setFormData({ ...formData, ZAKAZNIK_ID_ZAKAZNIKU: e.target.value })}
                margin="normal"
              />

              <FormControl fullWidth margin="normal">
                <InputLabel>Supermarket</InputLabel>
                <Select
                  value={formData.SUPERMARKET_ID_SUPERMARKETU}
                  label="Supermarket"
                  onChange={(e) => setFormData({ ...formData, SUPERMARKET_ID_SUPERMARKETU: e.target.value })}
                >
                  {supermarkets.map((market) => (
                    <MenuItem key={market.ID_SUPERMARKETU} value={market.ID_SUPERMARKETU}>
                      {market.NAZEV}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleEditClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleFormSubmit} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>

        {/* Notifications */}
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

export default OrderPanel;
