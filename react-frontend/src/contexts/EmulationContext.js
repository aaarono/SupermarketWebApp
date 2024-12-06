// contexts/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import { Box, Button, Typography } from "@mui/material";
import { styled } from "@mui/system";
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

export const EmualtionContext = createContext();

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
    const [authData, setAuthData] = useState({
        token: localStorage.getItem('token') || null
    });

    return (
        <EmualtionContext.Provider value={{ authData }}>

            <NotificationContainer role="alert" aria-live="polite">
                <Typography variant="body1" color="white" sx={{ flexGrow: 1 }}>
                    Emulating useremail@email.email...
                </Typography>
                <StyledButton
                    variant="outlined"
                    onClick={console.log('clicked')}
                    aria-label="Stop emulation"
                    size="small"
                >
                    Stop
                </StyledButton>
            </NotificationContainer>

            {children}

        </EmualtionContext.Provider>
    );
};
