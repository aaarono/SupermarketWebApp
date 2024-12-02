import React, { useState, useEffect } from 'react';
import {
  Tabs,
  Tab,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

function AdminPanel() {
  const [tables, setTables] = useState([
    {
      name: 'ADRESA',
      columns: [
        { field: 'ID_ADRESY', headerName: 'ID_ADRESY', type: 'number', width: 130 },
        { field: 'ULICE', headerName: 'ULICE', type: 'string', width: 150 },
        { field: 'PSC', headerName: 'PSC', type: 'number', width: 100 },
        { field: 'MESTO', headerName: 'MESTO', type: 'string', width: 150 },
        { field: 'CISLOPOPISNE', headerName: 'CISLOPOPISNE', type: 'number', width: 150 },
      ],
      rows: [],
    },
    // Add similar objects for other tables based on your DDL
  ]);

  const [currentTab, setCurrentTab] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('add'); // 'add' or 'edit'
  const [formData, setFormData] = useState({});

  useEffect(() => {
    // Fetch data for each table
    tables.forEach((table, index) => {
      fetch(`/api/${table.name}`)
        .then((res) => res.json())
        .then((data) => {
          const updatedTables = [...tables];
          updatedTables[index].rows = data;
          setTables(updatedTables);
        })
        .catch((err) => console.error(err));
    });
  }, []);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleAdd = () => {
    setDialogMode('add');
    setFormData({});
    setOpenDialog(true);
  };

  const handleEdit = (params) => {
    setDialogMode('edit');
    setFormData(params.row);
    setOpenDialog(true);
  };

  const handleDelete = (id) => {
    const table = tables[currentTab];
    fetch(`/api/${table.name}/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        // Update the table data after deletion
      })
      .catch((err) => console.error(err));
  };

  const handleDialogSubmit = () => {
    const table = tables[currentTab];
    const method = dialogMode === 'add' ? 'POST' : 'PUT';
    const url =
      dialogMode === 'add'
        ? `/api/${table.name}`
        : `/api/${table.name}/${formData.ID_ADRESY}`; // Adjust ID field accordingly

    fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
      .then(() => {
        // Refresh table data after submission
        setOpenDialog(false);
      })
      .catch((err) => console.error(err));
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs value={currentTab} onChange={handleTabChange}>
        {tables.map((table, index) => (
          <Tab label={table.name} key={index} />
        ))}
      </Tabs>
      {tables.map(
        (table, index) =>
          currentTab === index && (
            <Box key={index} sx={{ p: 2 }}>
              <Button variant="contained" color="primary" onClick={handleAdd}>
                Add Row
              </Button>
              <div style={{ height: 400, width: '100%', marginTop: '16px' }}>
                <DataGrid
                  columns={[
                    ...table.columns,
                    {
                      field: 'actions',
                      headerName: 'Actions',
                      width: 150,
                      renderCell: (params) => (
                        <>
                          <Button
                            variant="outlined"
                            color="primary"
                            size="small"
                            onClick={() => handleEdit(params)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outlined"
                            color="secondary"
                            size="small"
                            onClick={() => handleDelete(params.row.ID_ADRESY)} // Adjust ID field accordingly
                            style={{ marginLeft: 8 }}
                          >
                            Delete
                          </Button>
                        </>
                      ),
                    },
                  ]}
                  rows={table.rows}
                  getRowId={(row) => row.ID_ADRESY} // Adjust ID field accordingly
                />
              </div>
              {/* Dialog for Add/Edit */}
              <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>{dialogMode === 'add' ? 'Add Row' : 'Edit Row'}</DialogTitle>
                <DialogContent>
                  {table.columns.map((column) => (
                    <TextField
                      key={column.field}
                      label={column.headerName}
                      value={formData[column.field] || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, [column.field]: e.target.value })
                      }
                      fullWidth
                      margin="normal"
                    />
                  ))}
                  <Button variant="contained" onClick={handleDialogSubmit} sx={{ mt: 2 }}>
                    Submit
                  </Button>
                </DialogContent>
              </Dialog>
            </Box>
          )
      )}
    </Box>
  );
}

export default AdminPanel;
