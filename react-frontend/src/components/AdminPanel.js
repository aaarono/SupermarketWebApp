import React, { useState } from "react";
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Toolbar,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  InputAdornment,
  CircularProgress,
  Alert,
  Snackbar
} from "@mui/material";
import { styled } from "@mui/system";
import {
  FiUsers,
  FiSettings,
  FiLogOut,
  FiMenu,
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiPlus
} from "react-icons/fi";

const drawerWidth = 200;

const Root = styled("div")({
  display: "flex"
});

const MainContent = styled("main")(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  marginTop: 64
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover
  }
}));

const mockData = [
  { id: 1, name: "John Doe", email: "john@example.com", role: "Admin" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", role: "User" },
  { id: 3, name: "Mike Johnson", email: "mike@example.com", role: "Editor" },
  { id: 4, name: "Sarah Wilson", email: "sarah@example.com", role: "User" },
  { id: 5, name: "Tom Brown", email: "tom@example.com", role: "Admin" }
];

const AdminPanel = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    setPage(0);
  };

  const handleRowSelect = (id) => {
    const newSelectedRows = selectedRows.includes(id)
      ? selectedRows.filter((rowId) => rowId !== id)
      : [...selectedRows, id];
    setSelectedRows(newSelectedRows);
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setDeleteDialogOpen(false);
      setSelectedRows([]);
      setSnackbar({
        open: true,
        message: "Items deleted successfully",
        severity: "success"
      });
    }, 1000);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setFormDialogOpen(false);
      setEditingUser(null);
      setSnackbar({
        open: true,
        message: "User saved successfully",
        severity: "success"
      });
    }, 1000);
  };

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap>
          Admin Panel
        </Typography>
      </Toolbar>
      <List>
        <ListItem button>
          <ListItemIcon>
            <FiUsers />
          </ListItemIcon>
          <ListItemText primary="Users" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <FiSettings />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItem>
      </List>
    </div>
  );

  const filteredData = mockData.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Root>
      <CssBaseline />

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth
            }
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth
            }
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <MainContent>
        <Paper sx={{ width: "100%", mb: 2, p: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <TextField
              placeholder="Search"
              variant="outlined"
              size="small"
              value={searchQuery}
              onChange={handleSearch}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FiSearch />
                  </InputAdornment>
                )
              }}
            />
            <Button
              variant="contained"
              startIcon={<FiPlus />}
              onClick={() => setFormDialogOpen(true)}
            >
              Add User
            </Button>
          </Box>

          <TableContainer>
            <Table aria-label="users table">
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <input
                      type="checkbox"
                      onChange={(e) =>
                        setSelectedRows(
                          e.target.checked ? mockData.map((user) => user.id) : []
                        )
                      }
                      checked={selectedRows.length === mockData.length}
                    />
                  </TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((user) => (
                    <StyledTableRow key={user.id}>
                      <TableCell padding="checkbox">
                        <input
                          type="checkbox"
                          onChange={() => handleRowSelect(user.id)}
                          checked={selectedRows.includes(user.id)}
                        />
                      </TableCell>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() => {
                            setEditingUser(user);
                            setFormDialogOpen(true);
                          }}
                          size="small"
                        >
                          <FiEdit2 />
                        </IconButton>
                        <IconButton
                          onClick={() => {
                            setSelectedRows([user.id]);
                            setDeleteDialogOpen(true);
                          }}
                          size="small"
                        >
                          <FiTrash2 />
                        </IconButton>
                      </TableCell>
                    </StyledTableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>

        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            Are you sure you want to delete the selected items?
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={handleDelete}
              color="error"
              disabled={loading}
              startIcon={loading && <CircularProgress size={20} />}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={formDialogOpen}
          onClose={() => {
            setFormDialogOpen(false);
            setEditingUser(null);
          }}
        >
          <form onSubmit={handleFormSubmit}>
            <DialogTitle>
              {editingUser ? "Edit User" : "Add New User"}
            </DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="Name"
                type="text"
                fullWidth
                required
                defaultValue={editingUser?.name}
              />
              <TextField
                margin="dense"
                label="Email"
                type="email"
                fullWidth
                required
                defaultValue={editingUser?.email}
              />
              <TextField
                margin="dense"
                label="Role"
                type="text"
                fullWidth
                required
                defaultValue={editingUser?.role}
              />
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => {
                  setFormDialogOpen(false);
                  setEditingUser(null);
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                startIcon={loading && <CircularProgress size={20} />}
              >
                Save
              </Button>
            </DialogActions>
          </form>
        </Dialog>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
        >
          <MenuItem onClick={() => setAnchorEl(null)}>
            <ListItemIcon>
              <FiSettings fontSize="small" />
            </ListItemIcon>
            Settings
          </MenuItem>
          <MenuItem onClick={() => setAnchorEl(null)}>
            <ListItemIcon>
              <FiLogOut fontSize="small" />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </MainContent>
    </Root>
  );
};

export default AdminPanel;
