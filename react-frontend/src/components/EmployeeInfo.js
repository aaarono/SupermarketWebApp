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
} from "@mui/material";
import {
  ExpandLess,
  ExpandMore,
  Person as PersonIcon,
} from "@mui/icons-material";
import { FaUserTie, FaUsers, FaEnvelope, FaPhone } from "react-icons/fa"; // Иконки для позиций
import api from "../services/api"; // Предполагается, что у вас настроен axios или другой клиент API

// Карта иконок для позиций
const positionIcons = {
  1: <FaUserTie color="primary" />, // Менеджер
  2: <FaUsers color="secondary" />, // Командир
  3: <FaEnvelope color="success" />, // Администратор
  4: <FaPhone color="warning" />, // Сотрудник
};

// Функция для построения дерева иерархии
const buildHierarchy = (employees) => {
  const map = {};
  const roots = [];

  employees.forEach((employee) => {
    map[employee.idZamestnance] = { ...employee, children: [] };
  });

  employees.forEach((employee) => {
    if (employee.zamestnanecIdZamestnance) {
      const parent = map[employee.zamestnanecIdZamestnance];
      if (parent) {
        parent.children.push(map[employee.idZamestnance]);
      }
    } else {
      roots.push(map[employee.idZamestnance]);
    }
  });

  return roots;
};

// Рекурсивный компонент для отображения сотрудников
const EmployeeListItem = ({ employee, positionsMap, averageSalaries, level = 0 }) => {
  const [open, setOpen] = useState(false);

  const positionName = positionsMap[employee.poziceIdPozice] || "Неизвестная позиция";
  const positionIcon = positionIcons[employee.poziceIdPozice] || <PersonIcon color="primary" />;
  const averageSalary = averageSalaries[employee.idZamestnance]; // Средняя зарплата из пропсов

  // Обработчик раскрытия/сворачивания
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
                  ? `Средняя зарплата подчиненных: ${averageSalary.toFixed(2)}`
                  : "Средняя зарплата отсутствует"}
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
              averageSalaries={averageSalaries} // Передаем зарплаты дальше
              level={level + 1}
            />
          ))}
        </List>
      </Collapse>
    </>
  );
};


// Корневой компонент
const EmployeeInfo = () => {
  const [hierarchy, setHierarchy] = useState([]);
  const [positions, setPositions] = useState({});
  const [averageSalaries, setAverageSalaries] = useState({}); // Средние зарплаты подчиненных
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Загрузка позиций
  const fetchPositions = async () => {
    try {
      const response = await api.get("/api/zamestnanci/pozice");
      const map = response.reduce((acc, pos) => {
        acc[pos.ID_POZICE] = pos.NAZEV;
        return acc;
      }, {});
      setPositions(map);
    } catch (error) {
      console.error("Ошибка загрузки позиций:", error);
      setSnackbar({
        open: true,
        message: "Ошибка загрузки позиций",
        severity: "error",
      });
    }
  };

  // Загрузка средней зарплаты для всех сотрудников
  const fetchAverageSalaries = async (employees) => {
    const salaries = {};
    const promises = employees.map(async (employee) => {
      try {
        const response = await api.get(`/api/zamestnanci/${employee.idZamestnance}/average-salary`);
        salaries[employee.idZamestnance] = response || null; // Предполагается, что API возвращает число
      } catch (error) {
        console.error(`Ошибка загрузки средней зарплаты для сотрудника ${employee.idZamestnance}:`, error);
        salaries[employee.idZamestnance] = null; // В случае ошибки
      }
    });
    await Promise.all(promises);
    setAverageSalaries(salaries);
  };

  // Функция для загрузки всех данных
  const fetchData = async () => {
    try {
      await fetchPositions();
      const response = await api.get("/api/zamestnanci/hierarchy/1");
      console.log(response)
      const tree = buildHierarchy(response);
      setHierarchy(tree);
      await fetchAverageSalaries(response); // Загружаем зарплаты после иерархии
    } catch (error) {
      console.error("Ошибка загрузки данных:", error);
      setSnackbar({
        open: true,
        message: "Ошибка загрузки данных",
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
      aria-label="Отображение иерархии сотрудников"
    >
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Справочник сотрудников
      </Typography>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" padding={2}>
          <CircularProgress />
        </Box>
      ) : (
        <List>
          {hierarchy.map((employee) => (
            <EmployeeListItem
              key={employee.idZamestnance}
              employee={employee}
              positionsMap={positions}
              averageSalaries={averageSalaries} // Передаем средние зарплаты
            />
          ))}
        </List>
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
