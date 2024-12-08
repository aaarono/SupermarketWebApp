import React, { useState, useEffect } from 'react';
import {
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
} from '@mui/material';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import AdminNavigation from './AdminNavigation';
import api from '../../services/api';

function CategoryPanel({ setActivePanel }) {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [formData, setFormData] = useState({ id: null, name: '' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/api/categories');
      setCategories(response);
    } catch (error) {
      console.error('Error loading categories:', error);
      setSnackbar({ open: true, message: 'Error loading categories', severity: 'error' });
    }
  };

  const handleFormOpen = (category = null) => {
    setSelectedCategory(category);
    setFormData(category ? { id: category.id, name: category.label } : { id: null, name: '' });
    setFormOpen(true);
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setSelectedCategory(null);
    setFormData({ id: null, name: '' });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedCategory) {
        await api.put(`/api/categories/${formData.id}`, { value: formData.name });
        setSnackbar({ open: true, message: 'Category updated successfully', severity: 'success' });
      } else {
        await api.post('/api/categories', { value: formData.name });
        setSnackbar({ open: true, message: 'Category added successfully', severity: 'success' });
      }
      fetchCategories();
      handleFormClose();
    } catch (error) {
      console.error('Error saving category:', error);
      setSnackbar({ open: true, message: 'Error saving category', severity: 'error' });
    }
  };

  const handleDeleteConfirmOpen = (category) => {
    setSelectedCategory(category);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirmClose = () => {
    setDeleteConfirmOpen(false);
    setSelectedCategory(null);
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/api/categories/${selectedCategory.id}`);
      setSnackbar({ open: true, message: 'Category deleted successfully', severity: 'success' });
      fetchCategories();
      handleDeleteConfirmClose();
    } catch (error) {
      console.error('Error deleting category:', error);
      setSnackbar({ open: true, message: 'Error deleting category', severity: 'error' });
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

      {/* Category Panel Content */}
      <div style={{ flexGrow: 1, padding: '16px' }}>
        <Typography variant="h4" gutterBottom>
          Categories
        </Typography>

        <Button variant="contained" color="primary" startIcon={<FiPlus />} onClick={() => handleFormOpen()}>
          Add Category
        </Button>

        <Paper sx={{ width: '100%', overflow: 'hidden', marginTop: 2 }}>
          <TableContainer>
            <Table stickyHeader aria-label="categories table">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {categories.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((category) => (
                  <TableRow hover key={category.id}>
                    <TableCell>{category.label}</TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => handleFormOpen(category)}>
                        <FiEdit2 />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteConfirmOpen(category)}>
                        <FiTrash2 />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {categories.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={2} align="center">
                      No data
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={categories.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>

        {/* Add/Edit Category Dialog */}
        <Dialog open={formOpen} onClose={handleFormClose}>
          <DialogTitle>{selectedCategory ? 'Edit Category' : 'Add Category'}</DialogTitle>
          <form onSubmit={handleFormSubmit}>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="Name"
                type="text"
                fullWidth
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
          <DialogTitle>Delete Category?</DialogTitle>
          <DialogContent>
            <Typography>Are you sure you want to delete the category "{selectedCategory?.label}"?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteConfirmClose}>Cancel</Button>
            <Button onClick={handleDelete} color="secondary">
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar Notifications */}
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

export default CategoryPanel;
