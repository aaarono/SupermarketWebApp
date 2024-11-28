import React, { useState, useEffect } from "react";
import UserNavBar from "../components/NavBarTypes/PublicNavBar";
import api from "../services/api"; // Убедитесь, что путь корректен
import {
    Box,
    Container,
    Button,
    Grid,
    Typography,
} from "@mui/material";

const TestOutput = () => {
    const [adminMessage, setAdminMessage] = useState('');
    const [employeeMessage, setEmployeeMessage] = useState('');
    const [userMessage, setUserMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleAdminAccess = async () => {
        try {
            const response = await api.get('/api/auth/admin');
            setAdminMessage(response.data);
            setErrorMessage('');
        } catch (error) {
            setAdminMessage('');
            handleError(error);
        }
    };

    const handleEmployeeAccess = async () => {
        try {
            const response = await api.get('/api/auth/employee');
            setEmployeeMessage(response.data);
            setErrorMessage('');
        } catch (error) {
            setEmployeeMessage('');
            handleError(error);
        }
    };

    const handleUserAccess = async () => {
        try {
            const response = await api.get('/api/auth/user');
            setUserMessage(response.data);
            setErrorMessage('');
        } catch (error) {
            setUserMessage('');
            handleError(error);
        }
    };

    const handleError = (error) => {
        if (error.response) {
            // Сервер ответил с кодом, отличным от 2xx
            setErrorMessage(`Ошибка ${error.response.status}: ${error.response.data}`);
        } else if (error.request) {
            // Запрос был отправлен, но ответа не получено
            setErrorMessage('Сервер не ответил на запрос.');
        } else {
            // Произошла ошибка при настройке запроса
            setErrorMessage('Произошла ошибка при отправке запроса.');
        }
    };

    return (
        <>
            <UserNavBar/>
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Тестирование защищённых эндпоинтов
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Button variant="contained" color="primary" onClick={handleAdminAccess}>
                            Доступ для Администратора
                        </Button>
                        {adminMessage && (
                            <Typography variant="body1" sx={{ mt: 2 }}>
                                Ответ: {adminMessage}
                            </Typography>
                        )}
                    </Grid>
                    <Grid item xs={12}>
                        <Button variant="contained" color="secondary" onClick={handleEmployeeAccess}>
                            Доступ для Сотрудника
                        </Button>
                        {employeeMessage && (
                            <Typography variant="body1" sx={{ mt: 2 }}>
                                Ответ: {employeeMessage}
                            </Typography>
                        )}
                    </Grid>
                    <Grid item xs={12}>
                        <Button variant="contained" color="success" onClick={handleUserAccess}>
                            Доступ для Пользователя
                        </Button>
                        {userMessage && (
                            <Typography variant="body1" sx={{ mt: 2 }}>
                                Ответ: {userMessage}
                            </Typography>
                        )}
                    </Grid>
                    {errorMessage && (
                        <Grid item xs={12}>
                            <Typography variant="body1" color="error">
                                {errorMessage}
                            </Typography>
                        </Grid>
                    )}
                </Grid>
            </Container>
        </>
    );
};

export default TestOutput;
