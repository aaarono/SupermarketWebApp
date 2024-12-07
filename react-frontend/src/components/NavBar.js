import React, { useState, useEffect } from "react";
import AdminNavBar from "./NavBarTypes/AdminNavBar";
import EmployeeNavBar from "./NavBarTypes/EmployeeNavBar";
import PublicNavBar from "./NavBarTypes/PublicNavBar";
import UserNavBar from "./NavBarTypes/UserNavBar";

import api from '../services/api';
import CircularProgress from '@mui/material/CircularProgress';
import { jwtDecode } from 'jwt-decode';

const NavBar = ({ NavBarUserRole }) => {

    const [userName, setUserName] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setLoading(false);
                    return;
                }

                const tokenWithoutBearer = token.startsWith('Bearer ') ? token.slice(7) : token;
                const decoded = jwtDecode(tokenWithoutBearer);
                const email = decoded.sub;

                if (email) {
                    const response = await api.get('/api/users');
                    const users = response;
                    const currentUser = users.find(user => user.email.toLowerCase() === email.toLowerCase());
                    if (currentUser) {
                        setUserName(`${currentUser.jmeno} ${currentUser.prijmeni}`);
                    } else {
                        setUserName('');
                    }
                } else {
                    setUserName('');
                }
                setLoading(false);
            } catch (error) {
                console.error('Ошибка при получении данных пользователя:', error);
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
                <CircularProgress />
            </div>
        );
    }

    if (NavBarUserRole === 'user') {
        return <UserNavBar NavBarTypeRole={NavBarUserRole} userName={userName} />
    } else if (NavBarUserRole === 'admin') {
        return <AdminNavBar NavBarTypeRole={NavBarUserRole} userName={userName} />
    } else if (NavBarUserRole === 'employee') {
        return <EmployeeNavBar NavBarTypeRole={NavBarUserRole} userName={userName} />
    } else {
        return <PublicNavBar />
    }

};

export default NavBar;