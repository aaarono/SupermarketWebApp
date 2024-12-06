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
  // Добавьте другие позиции по необходимости
};

// Рекурсивный компонент для отображения сотрудников
const EmployeeListItem = ({ employee, positionsMap, level = 0 }) => {
  const [open, setOpen] = useState(false);
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Обработчик клика для разворачивания/сворачивания списка подчинённых
  const handleClick = () => {
    // Разворачивать можно только на уровне менеджеров (level === 0)
    if (level === 0) {
      if (open) {
        setOpen(false);
      } else {
        if (children.length === 0) {
          fetchChildren();
        } else {
          setOpen(true);
        }
      }
    }
  };

  // Функция для загрузки подчинённых сотрудников
  const fetchChildren = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/api/zamestnanci/hierarchy/${employee.idZamestnance}`);
      if (response && Array.isArray(response)) {
        setChildren(response);
        if (response.length > 0) {
          setOpen(true);
        } else {
          // Если подчинённых нет, можно показать уведомление или просто оставить список свернутым
          setSnackbar({
            open: true,
            message: "У этого сотрудника нет подчинённых.",
            severity: "info",
          });
        }
      } else {
        console.error("Неправильный формат данных от API:", response);
        setChildren([]);
      }
    } catch (error) {
      console.error("Ошибка при загрузке иерархии:", error);
      setSnackbar({
        open: true,
        message: "Ошибка при загрузке иерархии",
        severity: "error",
      });
      setChildren([]);
    } finally {
      setLoading(false);
    }
  };

  // Получение названия позиции из карты позиций
  const positionName = positionsMap[employee.poziceIdPozice] || "Неизвестная позиция";
  // Получение иконки позиции
  const positionIcon = positionIcons[employee.poziceIdPozice] || <PersonIcon color="primary" />;

  return (
    <>
      <ListItem
        sx={{ pl: level * 4 }}
        secondaryAction={
          // Показывать иконку разворота только для менеджеров (level === 0)
          level === 0 && (
            <IconButton edge="end" onClick={handleClick}>
              {open ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          )
        }
      >
        <ListItemAvatar>
          <Avatar>
            {employee.employeeName ? employee.employeeName.charAt(0) : "?"}
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={
            <Box display="flex" alignItems="center">
              {positionIcon}
              <Typography variant="subtitle1" sx={{ ml: 1, fontWeight: 'bold' }}>
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
            </>
          }
          onClick={handleClick}
          // Устанавливаем курсор только для менеджеров, чтобы показать, что элемент кликабельный
          style={{ cursor: level === 0 ? "pointer" : "default" }}
        />
      </ListItem>
      {/* Разворачиваемый список подчинённых */}
      <Collapse in={open} timeout="auto" unmountOnExit>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" padding={2}>
            <CircularProgress size={20} />
          </Box>
        ) : (
          children.length > 0 && (
            <List component="div" disablePadding>
              {children.map((child) => {
                // Убедитесь, что у подчинённого есть idZamestnance
                if (!child.idZamestnance) {
                  console.warn("Child employee missing idZamestnance:", child);
                  return null;
                }
                return (
                  <EmployeeListItem
                    key={child.idZamestnance}
                    employee={child}
                    positionsMap={positionsMap}
                    level={level + 1}
                  />
                );
              })}
            </List>
          )
        )}
      </Collapse>
      {/* Snackbar для уведомлений */}
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
    </>
  );
};

// Корневой компонент для отображения дерева сотрудников
const EmployeeInfo = () => {
  const [managers, setManagers] = useState([]);
  const [positions, setPositions] = useState({});
  const [loading, setLoading] = useState(true);
  const [positionsLoading, setPositionsLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Список ID менеджеров. Замените на реальные ID или получите их из API
  const managerIds = [1, 2]; // Примерные ID

  // Функция для загрузки списка позиций
  const fetchPositions = async () => {
    setPositionsLoading(true);
    try {
      const response = await api.get("/api/zamestnanci/pozice");
      console.log('Positions API Response:', response);
      if (response && Array.isArray(response)) {
        const map = {};
        response.forEach((pos) => {
          map[pos.ID_POZICE] = pos.NAZEV;
        });
        setPositions(map);
      } else {
        console.error("Неправильный формат данных позиций:", response);
        setPositions({});
      }
    } catch (error) {
      console.error("Ошибка при загрузке позиций:", error);
      setSnackbar({
        open: true,
        message: "Ошибка при загрузке позиций",
        severity: "error",
      });
      setPositions({});
    } finally {
      setPositionsLoading(false);
    }
  };

  // Функция для загрузки менеджеров
  const fetchManagers = async () => {
    setLoading(true);
    try {
      const fetchPromises = managerIds.map((id) =>
        api.get(`/api/zamestnanci/hierarchy/${id}`)
      );
      const results = await Promise.all(fetchPromises);
      console.log('Managers API Responses:', results);
      // Предполагаем, что первый элемент в каждом ответе — это сам менеджер
      const managersData = results
        .map((result) => {
          if (result && Array.isArray(result) && result.length > 0) {
            return result[0];
          }
          return null;
        })
        .filter((manager) => manager !== null && manager.idZamestnance);
      setManagers(managersData);
    } catch (error) {
      console.error("Ошибка при загрузке менеджеров:", error);
      setSnackbar({
        open: true,
        message: "Ошибка при загрузке менеджеров",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Загрузка позиций при монтировании компонента
  useEffect(() => {
    fetchPositions();
  }, []);

  // Загрузка менеджеров после загрузки позиций
  useEffect(() => {
    if (!positionsLoading) {
      fetchManagers();
    }
  }, [positionsLoading]);

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
      {(loading || positionsLoading) ? (
        <Box display="flex" justifyContent="center" alignItems="center" padding={2}>
          <CircularProgress />
        </Box>
      ) : (
        <List>
          {managers.map((manager) => {
            // Убедитесь, что у менеджера есть idZamestnance
            if (!manager.idZamestnance) {
              console.warn("Manager missing idZamestnance:", manager);
              return null;
            }
            return (
              <EmployeeListItem
                key={manager.idZamestnance}
                employee={manager}
                positionsMap={positions}
                level={0} // Менеджеры находятся на уровне 0
              />
            );
          })}
        </List>
      )}
      {/* Snackbar для уведомлений */}
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
