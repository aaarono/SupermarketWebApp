// EmulationContext.js
import React, { createContext, useState, useEffect } from 'react';
import { Box, Button, Typography } from "@mui/material";
import { styled } from "@mui/system";
import api from '../services/api';

export const EmulationContext = createContext();

const NotificationContainer = styled(Box)(({ theme }) => ({
    height: "50px",
    backgroundColor: theme.palette.error.main,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: theme.spacing(0, 5),
}));

const StyledButton = styled(Button)(({ theme }) => ({
    backgroundColor: "transparent",
    border: `1px solid ${theme.palette.common.white}`,
    color: theme.palette.common.white,
    "&:hover": {
        backgroundColor: theme.palette.common.white,
        color: theme.palette.error.main
    }
}));

export const EmulationProvider = ({ children }) => {
    const [simulationEmail, setSimulationEmail] = useState('');
    const [isEmulating, setIsEmulating] = useState(false);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');

        if (token) {
            api.setAuthToken(token);
            localStorage.setItem('simulationToken', token);
            setIsEmulating(true);
            // Получаем email или используем заглушку
            setSimulationEmail("user@example.com");
        } else {
            // Нет токена — нет эмуляции
            setIsEmulating(false);
        }
    }, []);

    const handleStop = () => {
        localStorage.removeItem('simulationToken');
        setIsEmulating(false);
        // Можно закрыть окно или сделать redirect
        window.close();
    };

    const startEmulation = (user) => {
        console.log('Эмулируем пользователя:', user);
    };

    return (
        <EmulationContext.Provider value={{ startEmulation }}>
            {/* Отображаем панель только если есть эмуляция */}
            {isEmulating && (
                <NotificationContainer role="alert" aria-live="polite">
                    <Typography variant="body1" color="white" sx={{ flexGrow: 1 }}>
                        Emulating {simulationEmail}...
                    </Typography>
                    <StyledButton
                        variant="outlined"
                        onClick={handleStop}
                        aria-label="Stop emulation"
                        size="small"
                    >
                        Stop
                    </StyledButton>
                </NotificationContainer>
            )}
            {children}
        </EmulationContext.Provider>
    );
};
