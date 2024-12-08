// EmployeeInfo.js
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  IconButton,
  Collapse,
  Paper,
} from "@mui/material";
import {
  ExpandLess,
  ExpandMore,
  Person as PersonIcon,
} from "@mui/icons-material";
import { FaUserTie, FaUsers, FaEnvelope, FaPhone } from "react-icons/fa"; // Icons for positions
import api from "../services/api"; // Your API client

// Icons map
const positionIcons = {
  1: <FaUserTie color="primary" />, // Manager
  2: <FaUsers color="secondary" />, // Commander
  3: <FaEnvelope color="success" />, // Administrator
  4: <FaPhone color="warning" />, // Employee
};

const buildHierarchy = (employees) => {
  const map = {};
  const roots = [];

  console.log("Исходные данные:", employees);


  // Обновляем zamestnanecIdZamestnance для сотрудников с уровнем 1
  employees.forEach((employee) => {
    if (employee.level === 1) {
      employee.zamestnanecIdZamestnance = null;
    }
  });

  // Создаем карту сотрудников
  employees.forEach((employee) => {
    map[employee.idZamestnance] = { ...employee, children: [] };
  });
  // Формируем иерархию
  employees.forEach((employee) => {
    if (employee.zamestnanecIdZamestnance) {
      const parent = map[employee.zamestnanecIdZamestnance];
      if (parent) {
        parent.children.push(map[employee.idZamestnance]);
      } else {
        console.warn(`Родитель с ID ${employee.zamestnanecIdZamestnance} не найден для сотрудника с ID ${employee.idZamestnance}`);
      }
    } else {
      roots.push(map[employee.idZamestnance]);
    }
  });

  console.log("Корни до удаления поля zamestnanecIdZamestnance:", roots);

  return roots;
};


// Recursive component for employees
const EmployeeListItem = ({ employee, positionsMap, averageSalaries, level = 0 }) => {
  const [open, setOpen] = useState(false);

  const positionName = positionsMap[employee.poziceIdPozice] || "Unknown position";
  const positionIcon = positionIcons[employee.poziceIdPozice] || <PersonIcon color="primary" />;
  const averageSalary = averageSalaries[employee.idZamestnance];

  const handleToggle = () => {
    setOpen(!open);
  };

  return (
    <>
      <ListItem sx={{ pl: level * 4 }}>
        <ListItemAvatar>
          <Avatar>{employee.employeeName?.charAt(0) || "?"}</Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={
            <Box display="flex" alignItems="center">
              {positionIcon}
              <Typography variant="subtitle1" sx={{ ml: 1, fontWeight: "bold" }}>
                {employee.employeeName || "N/A"}
              </Typography>
            </Box>
          }
          secondary={
            <>
              <Typography variant="body2" color="textSecondary">
                {positionName}
              </Typography>
              {employee.email && (
                <Typography variant="body2" color="textSecondary">
                  📧 {employee.email}
                </Typography>
              )}
              {employee.phone && (
                <Typography variant="body2" color="textSecondary">
                  📞 {employee.phone}
                </Typography>
              )}
              <Typography variant="body2" color="textSecondary">
                {averageSalary !== null
                  ? `Average subordinate salary: ${averageSalary.toFixed(2)}`
                  : "No average salary data"}
              </Typography>
            </>
          }
        />
        {employee.children?.length > 0 && (
          <IconButton edge="end" onClick={handleToggle}>
            {open ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        )}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {employee.children.map((child) => (
            <EmployeeListItem
              key={child.idZamestnance}
              employee={child}
              positionsMap={positionsMap}
              averageSalaries={averageSalaries}
              level={level + 1}
            />
          ))}
        </List>
      </Collapse>
    </>
  );
};

// Root component
const EmployeeInfo = () => {
  const [hierarchy, setHierarchy] = useState([]);
  const [positions, setPositions] = useState({});
  const [averageSalaries, setAverageSalaries] = useState({});
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [currentEmployee, setCurrentEmployee] = useState(null);

  const fetchPositions = async () => {
    try {
      const response = await api.get("/api/zamestnanci/pozice");
      const map = response.reduce((acc, pos) => {
        acc[pos.ID_POZICE] = pos.NAZEV;
        return acc;
      }, {});
      setPositions(map);
    } catch (error) {
      console.error("Error loading positions:", error);
      setSnackbar({
        open: true,
        message: "Error loading positions",
        severity: "error",
      });
    }
  };

  const fetchAverageSalaries = async (employees) => {
    const salaries = {};
    const promises = employees.map(async (employee) => {
      try {
        const response = await api.get(`/api/zamestnanci/${employee.idZamestnance}/average-salary`);
        salaries[employee.idZamestnance] = response;
      } catch (error) {
        console.error(`Error loading average salary for employee ${employee.idZamestnance}:`, error);
        salaries[employee.idZamestnance] = null;
      }
    });
    await Promise.all(promises);
    setAverageSalaries(salaries);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const userResponse = await api.get("/api/user/customer");
      const userId = userResponse.user.zamnestnanecIdZamnestnance;

      if (!userId) throw new Error("Failed to get the current user's ID");

      await fetchPositions();

      const hierarchyResponse = await api.get(`/api/zamestnanci/hierarchy/${userId}`);
      const tree = buildHierarchy(hierarchyResponse);
      
      setHierarchy(tree);

      const employeeResponse = await api.get(`/api/zamestnanci/${userId}`);
      setCurrentEmployee(employeeResponse);

      await fetchAverageSalaries(hierarchyResponse || []);
    } catch (error) {
      console.error("Error loading data:", error);
      setSnackbar({
        open: true,
        message: "Error loading data",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Box
      sx={{
        maxWidth: 800,
        margin: "0 auto",
        padding: 3,
      }}
      role="main"
      aria-label="Employee hierarchy display"
    >
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Employee Directory
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" padding={2}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {currentEmployee && (
            <Paper sx={{ padding: 2, marginBottom: 2 }}>
              <Typography variant="h6">Current employee information:</Typography>
              <Typography>First Name: {currentEmployee.EMPLOYEE_FIRST_NAME}</Typography>
              <Typography>Last Name: {currentEmployee.EMPLOYEE_LAST_NAME}</Typography>
              <Typography>Email: {currentEmployee.EMPLOYEE_EMAIL}</Typography>
              <Typography>Position: {currentEmployee.POSITION_NAME}</Typography>
              <Typography>Address: {currentEmployee.EMPLOYEE_ADDRESS}</Typography>
              <Typography>Location: {currentEmployee.LOCATION_NAME}</Typography>
              <Typography>Salary/Hour: {currentEmployee.SALARY_PER_HOUR}</Typography>
              <Typography>Working hours: {currentEmployee.WORKING_HOURS}</Typography>
              <Typography>Start date: {currentEmployee.START_DATE}</Typography>
            </Paper>
          )}
          <List>
            {hierarchy.map((employee) => (
              <EmployeeListItem
                key={employee.idZamestnance}
                employee={employee}
                positionsMap={positions}
                averageSalaries={averageSalaries}
              />
            ))}
          </List>
        </>
      )}
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
    </Box>
  );
};

export default EmployeeInfo;
