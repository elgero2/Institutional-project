import React, { useState } from 'react';
import { Box, Typography, Button, TextField, Container, Alert } from '@mui/material';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/token/'; 

const LoginPage = ({ handleLogin }) => {
    const [dni, setDni] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await axios.post(API_URL, {
                dni: dni,
                password: password,
            });

            console.log('Respuesta Exitosa del Servidor (200 OK):', response.data);

            const { access, refresh } = response.data;
            
            if (!access || !refresh) {
                throw new Error('El servidor devolvió un 200, pero no se encontraron tokens.');
            }

            localStorage.setItem('access_token', access);
            localStorage.setItem('refresh_token', refresh);
            
            // CORRECCIÓN: Pasar dni y password a handleLogin (como espera App.jsx)
            handleLogin(dni, password);

        } catch (err) {
            const errorMessage = err.message || 'Error desconocido.';
            
            if (err.response && (err.response.status === 401 || err.response.status === 400)) {
                setError('Credenciales incorrectas. Verifique su DNI y Contraseña.');
            } else if (errorMessage.includes('tokens')) {
                setError('Error interno: El login fue exitoso, pero el servidor no generó los tokens JWT.');
            } else {
                setError('Error de conexión con el servidor. Inténtelo más tarde.');
            }
            console.error("Error de login:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box 
                sx={{ 
                    marginTop: 8, 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    p: 4, 
                    boxShadow: 6,
                    borderRadius: 3
                }}
            >
                <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
                    Acceso Institucional
                </Typography>
                
                {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}

                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="DNI / Identificación"
                        name="dni"
                        autoFocus
                        value={dni}
                        onChange={(e) => setDni(e.target.value)} 
                        disabled={loading}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Contraseña"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        disabled={loading}
                    >
                        {loading ? 'Cargando...' : 'Iniciar Sesión'}
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default LoginPage;