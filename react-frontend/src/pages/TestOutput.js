// TestOutput.js
import React, { useState, useEffect } from "react";
import UserNavBar from "../components/UserNavBar";
import TextOutput from "../components/TextOutput"; // Убедитесь, что путь корректен
import api from "../services/api"; // Убедитесь, что путь корректен
import { Grid2 } from "@mui/material";
import {
    Box,
    Card,
    CardContent,
    CardMedia,
    Typography,
    Grid,
    Container,
    TextField,
    Select,
    MenuItem,
    Pagination,
    Button,
    FormControl,
    InputLabel,
    InputAdornment,
    Zoom,
  } from "@mui/material";

const TestOutput = () => {
    const [products, setProducts] = useState([]);
    const [supermarkets, setSupermarkets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Функция для загрузки названий продуктов
    const fetchProductNames = async () => {
        try {
            const productNames = await api.get('/api/produkts/names'); // Используем новый эндпоинт
            // Предполагается, что productNames - массив строк
            setProducts(productNames);
            setError(null);
        } catch (err) {
            console.error('Ошибка при загрузке названий продуктов:', err);
            setError('Не удалось загрузить список названий продуктов.');
        } finally {
            setLoading(false);
        }
    };

    const fetchSupermarketNames = async () => {
        try {
            const supermarketNames = await api.get('/api/supermarkets/names'); // Используем новый эндпоинт
            // Предполагается, что productNames - массив строк
            setSupermarkets(supermarketNames);
            setError(null);
        } catch (err) {
            console.error('Ошибка при загрузке названий продуктов:', err);
            setError('Не удалось загрузить список названий продуктов.');
        } finally {
            setLoading(false);
        }
    };

    // Загрузка данных при монтировании компонента
    useEffect(() => {
        fetchProductNames();
        fetchSupermarketNames();
    }, []);

    if (loading) {
        return (
            <>
                <UserNavBar/>
                <div style={{ padding: '20px', textAlign: 'center' }}>Загрузка...</div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <UserNavBar/>
                <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>{error}</div>
            </>
        );
    }

    return (
        <>
            <UserNavBar/>
            <div style={{ padding: '20px' }}>
                <Container maxWidth="lg" sx={{ py: 4 }}>
                    <Box sx={{ mb: 4 }}>
                        <Grid container spacing={2} alignItems="center">
                            <div>
                            <h2>Список Продуктов</h2>
                            <TextOutput products={products}/>
                            </div>
                            <div>
                            <h2>СписOK</h2>
                            <TextOutput products={supermarkets}/>
                            </div>
                        </Grid>
                    </Box>
                </Container>
            </div>
        </>
    );
};

export default TestOutput;
