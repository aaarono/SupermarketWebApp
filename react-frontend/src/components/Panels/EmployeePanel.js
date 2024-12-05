import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import AdminNavigation from './AdminNavigation';
import api from '../../services/api';

function EmployeePanel({ setActivePanel }) {
  const [employees, setEmployees] = useState([]);
  const [managers, setManagers] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [supermarkets, setSupermarkets] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [positions, setPositions] = useState([]);
  const [formData, setFormData] = useState({
    jmeno: '',
    prijmeni: '',
    skladIdSkladu: '',
    supermarketIdSupermarketu: '',
    mzda: '',
    pracovnidoba: '',
    poziceIdPozice: '',
    datumZamestnani: '',
    zamestnanecIdZamestnance: '',
    adresaIdAdresy: ''
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);

  useEffect(() => {
    fetchEmployees();
    fetchWarehouses();
    fetchSupermarkets();
    fetchManagers();
    fetchPositions();
    fetchAddresses();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await api.get('/api/zamestnanci');
      const sortedEmployees = response.sort((a, b) => a.idZamestnance - b.idZamestnance);
      console.log(sortedEmployees);
      setEmployees(sortedEmployees);
    } catch (error) {
      console.error('Ошибка при загрузке сотрудников:', error);
    }
  };

  const fetchWarehouses = async () => {
    try {
      const response = await api.get('/api/sklads');
      setWarehouses(response);
    } catch (error) {
      console.error('Ошибка при загрузке складов:', error);
    }
  };

  const fetchSupermarkets = async () => {
    try {
      const response = await api.get('/api/supermarkets');
      setSupermarkets(response);
    } catch (error) {
      console.error('Ошибка при загрузке супермаркетов:', error);
    }
  };

  const fetchPositions = async () => {
    try {
      const response = await api.get('/api/zamestnanci/pozice');
      console.log(response);
      setPositions(response);
    } catch (error) {
      console.error('Ошибка при загрузке позиций:', error);
    }
  };

  const fetchManagers = async () => {
    try {
      const response = await api.get('/api/zamestnanci');
      const uniqueManagers = response.filter((manager, index, self) => {
        const warehouse = warehouses.find((w) => w.ID_SKLADU === manager.skladIdSkladu);
        const supermarket = supermarkets.find((s) => s.ID_SUPERMARKETU === manager.supermarketIdSupermarketu);
        return (
          self.findIndex(
            (m) =>
              m.skladIdSkladu === manager.skladIdSkladu || m.supermarketIdSupermarketu === manager.supermarketIdSupermarketu
          ) === index
        );
      });
  
      const managersWithPlace = uniqueManagers.map((manager) => {
        const warehouse = warehouses.find((w) => w.ID_SKLADU === manager.skladIdSkladu);
        const supermarket = supermarkets.find((s) => s.ID_SUPERMARKETU === manager.supermarketIdSupermarketu);
        return {
          ...manager,
          placeType: warehouse ? 'Склад' : supermarket ? 'Супермаркет' : 'Не указано',
          placeName: warehouse ? warehouse.NAZEV : supermarket ? supermarket.NAZEV : 'Не указано',
        };
      });
      setManagers(managersWithPlace);
    } catch (error) {
      console.error('Ошибка при загрузке менеджеров:', error);
    }
  };

  const fetchAddresses = async () => {
    try {
      const response = await api.get('/api/addresses');
      setAddresses(response);
    } catch (error) {
      console.error('Ошибка при загрузке адресов:', error);
    }
  };

  const handleFormOpen = (employee = null) => {
    setSelectedEmployee(employee);
    setFormData(
      employee
        ? {
            jmeno: employee.jmeno,
            prijmeni: employee.prijmeni,
            skladIdSkladu: employee.skladIdSkladu,
            supermarketIdSupermarketu: employee.supermarketIdSupermarketu,
            mzda: employee.mzda,
            pracovnidoba: employee.pracovnidoba,
            poziceIdPozice: employee.poziceIdPozice,
            datumZamestnani: employee.datumZamestnani,
            zamestnanecIdZamestnance: employee.zamestnanecIdZamestnance,
            adresaIdAdresy: employee.adresaIdAdresy,
          }
        : {
            jmeno: '',
            prijmeni: '',
            email: '',
            skladIdSkladu: '',
            supermarketIdSupermarketu: '',
            mzda: '',
            pracovnidoba: '',
            poziceIdPozice: '',
            datumZamestnani: '',
            zamestnanecIdZamestnance: '',
            adresaIdAdresy: '',
          }
    );
    setFormOpen(true);
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setSelectedEmployee(null);
    setFormData({
      jmeno: '',
      prijmeni: '',
      email: '',
      skladIdSkladu: '',
      supermarketIdSupermarketu: '',
      mzda: '',
      pracovnidoba: '',
      poziceIdPozice: '',
      datumZamestnani: '',
      zamestnanecIdZamestnance: '',
      idAdresy: ''
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    // Преобразование необходимых полей в числа
    const payload = {
      ...formData,
      skladIdSkladu: formData.skladIdSkladu !== null ? Number(formData.skladIdSkladu) : null,
      supermarketIdSupermarketu: formData.supermarketIdSupermarketu !== null ? Number(formData.supermarketIdSupermarketu) : null,
      zamestnanecIdZamestnance: formData.zamestnanecIdZamestnance !== null ? Number(formData.zamestnanecIdZamestnance) : null,
      adresaIdAdresy: formData.adresaIdAdresy !== null ? Number(formData.adresaIdAdresy) : null,
    };
  
    try {
      if (selectedEmployee) {
        console.log(payload);
        await api.put(`/api/zamestnanci/${selectedEmployee.idZamestnance}`, payload);
        setSnackbar({ open: true, message: 'Сотрудник обновлен успешно', severity: 'success' });
      } else {
        await api.post('/api/zamestnanci', payload);
        setSnackbar({ open: true, message: 'Сотрудник добавлен успешно', severity: 'success' });
      }
      fetchEmployees();
      handleFormClose();
    } catch (error) {
      console.error('Ошибка при сохранении сотрудника:', error);
      setSnackbar({ open: true, message: 'Ошибка при сохранении сотрудника', severity: 'error' });
    }
  };

  const handleDeleteConfirmOpen = (employee) => {
    setSelectedEmployee(employee);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirmClose = () => {
    setDeleteConfirmOpen(false);
    setSelectedEmployee(null);
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/api/employees/${selectedEmployee.idZamestnance}`);
      setSnackbar({ open: true, message: 'Сотрудник удален успешно', severity: 'success' });
      fetchEmployees();
      handleDeleteConfirmClose();
    } catch (error) {
      console.error('Ошибка при удалении сотрудника:', error);
      setSnackbar({ open: true, message: 'Ошибка при удалении сотрудника', severity: 'error' });
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <div style={{ display: 'flex' }}>
      <AdminNavigation setActivePanel={setActivePanel} />

      <div style={{ flexGrow: 1, padding: '16px' }}>
        <Typography variant="h4" gutterBottom>
          Employees
        </Typography>

        <Button variant="contained" color="primary" startIcon={<FiPlus />} onClick={() => handleFormOpen()}>
          Добавить сотрудника
        </Button>

        <Paper sx={{ width: '100%', overflow: 'hidden', marginTop: 2 }}>
          <TableContainer>
            <Table stickyHeader aria-label="employees table">
              <TableHead>
                <TableRow>
                  <TableCell>Имя</TableCell>
                  <TableCell>Фамилия</TableCell>
                  <TableCell>Склад</TableCell>
                  <TableCell>Супермаркет</TableCell>
                  <TableCell>Менеджер</TableCell>
                  <TableCell>Позиция</TableCell>
                  <TableCell>Зарплата</TableCell>
                  <TableCell>Рабочие часы</TableCell>
                  <TableCell>адрес</TableCell>
                  <TableCell align="right">Действия</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {employees.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((employee) => (
                  <TableRow hover key={employee.idZamestnance}>
                    <TableCell>{employee.jmeno}</TableCell>
                    <TableCell>{employee.prijmeni}</TableCell>
                    <TableCell>{warehouses.find((w) => w.ID_SKLADU === employee.skladIdSkladu)?.NAZEV || 'Не указано'}</TableCell>
                    <TableCell>{supermarkets.find((s) => s.ID_SUPERMARKETU === employee.supermarketIdSupermarketu)?.NAZEV || 'Не указано'}</TableCell>
                    <TableCell>{managers.find((m) => m.idZamestnance === employee.zamestnanecIdZamestnance)?.jmeno || 'Не указано'}</TableCell>
                    <TableCell>
                    {positions.find((p) => p.ID_POZICE === employee.poziceIdPozice)?.NAZEV || 'Не указано'}
                    </TableCell>
                    <TableCell>{employee.mzda}</TableCell>
                    <TableCell>{employee.pracovnidoba}</TableCell>
                    <TableCell>{employee.adresaIdAdresy}</TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => handleFormOpen(employee)}>
                        <FiEdit2 />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteConfirmOpen(employee)}>
                        <FiTrash2 />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={employees.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>

        <Dialog open={formOpen} onClose={handleFormClose}>
          <DialogTitle>{selectedEmployee ? 'Редактировать сотрудника' : 'Добавить сотрудника'}</DialogTitle>
          <form onSubmit={handleFormSubmit}>
            <DialogContent>
              <TextField
                margin="dense"
                label="Имя"
                type="text"
                fullWidth
                required
                value={formData.jmeno}
                onChange={(e) => setFormData({ ...formData, jmeno: e.target.value })}
              />
              <TextField
                margin="dense"
                label="Фамилия"
                type="text"
                fullWidth
                required
                value={formData.prijmeni}
                onChange={(e) => setFormData({ ...formData, prijmeni: e.target.value })}
              />
              <Select
                fullWidth
                value={formData.skladIdSkladu}
                onChange={(e) => setFormData({ ...formData, skladIdSkladu: e.target.value })}
              >
              <MenuItem value="">Выберите склад</MenuItem>
                {warehouses.map((warehouse) => (
                  <MenuItem key={warehouse.ID_SKLADU} value={warehouse.ID_SKLADU}>
                    {warehouse.NAZEV}
                  </MenuItem>
                ))}
              </Select>
              <Select
                fullWidth
                value={formData.supermarketIdSupermarketu}
                onChange={(e) => setFormData({ ...formData, supermarketIdSupermarketu: e.target.value })}
              >
                <MenuItem value="">Выберите супермаркет</MenuItem>
                {supermarkets.map((supermarket) => (
                  <MenuItem key={supermarket.ID_SUPERMARKETU} value={supermarket.ID_SUPERMARKETU}>
                    {supermarket.NAZEV}
                  </MenuItem>
                ))}
              </Select>
              <Select
                fullWidth
                value={formData.zamestnanecIdZamestnance}
                onChange={(e) => setFormData({ ...formData, zamestnanecIdZamestnance: e.target.value })}
              >
                <MenuItem value="">Выберите менеджера</MenuItem>
                {managers
                  .filter(
                    (manager) =>
                      (manager.skladIdSkladu === formData.skladIdSkladu || manager.supermarketIdSupermarketu === formData.supermarketIdSupermarketu)
                  )
                  .map((manager) => (
                    <MenuItem key={manager.idZamestnance} value={manager.idZamestnance}>
                      {`${manager.jmeno} ${manager.prijmeni} (${manager.placeType}: ${manager.placeName})`}
                    </MenuItem>
                  ))}
              </Select>

              <TextField
                margin="dense"
                label="Зарплата"
                type="number"
                fullWidth
                required
                value={formData.mzda}
                onChange={(e) => setFormData({ ...formData, mzda: e.target.value })}
              />
              <Select
                fullWidth
                value={formData.poziceIdPozice}
                onChange={(e) => setFormData({ ...formData, poziceIdPozice: e.target.value })}
              >
                <MenuItem value="">Выберите позицию</MenuItem>
                {positions.map((position) => (
                  <MenuItem key={position.ID_POZICE} value={position.ID_POZICE}>
                    {position.NAZEV}
                  </MenuItem>
                ))}
              </Select>

              <TextField
                margin="dense"
                label="Рабочие часы"
                type="number"
                fullWidth
                required
                value={formData.pracovnidoba}
                onChange={(e) => setFormData({ ...formData, pracovnidoba: e.target.value })}
              />
              <Select
              value={formData.adresaIdAdresy}
              onChange={(e) => setFormData({ ...formData, adresaIdAdresy: e.target.value })}
              fullWidth
            >
              <MenuItem value="">Выберите адрес</MenuItem>
              {addresses.map((address) => (
                <MenuItem key={address.idAdresy} value={address.idAdresy}>
                  {`${address.ulice}, ${address.mesto}`}
                </MenuItem>
              ))}
            </Select>
              <TextField
                margin="dense"
                label="Дата начала работы"
                type="date"
                fullWidth
                required
                value={formData.datumZamestnani}
                onChange={(e) => setFormData({ ...formData, datumZamestnani: e.target.value })}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleFormClose}>Отмена</Button>
              <Button type="submit" color="primary">
                Сохранить
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </div>
    </div>
  );
}

export default EmployeePanel;
