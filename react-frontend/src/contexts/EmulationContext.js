// src/contexts/EmulationContext.js
import React, { createContext, useContext } from 'react';
import { Box, Button, Typography } from "@mui/material";
import { styled } from "@mui/system";
import { AuthContext } from './AuthContext';

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
    const { isEmulating, simulationEmail, stopSimulation } = useContext(AuthContext);

    return (
        <EmulationContext.Provider value={{}}>
            {isEmulating && (
                <NotificationContainer role="alert" aria-live="polite">
                    <Typography variant="body1" color="white" sx={{ flexGrow: 1 }}>
                        Emulating {simulationEmail}...
                    </Typography>
                    <StyledButton
                        variant="outlined"
                        onClick={stopSimulation}
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
