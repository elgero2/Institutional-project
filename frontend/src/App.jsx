import React, { useState } from 'react';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/dashboards/AdminDashboard';
import { Box, CircularProgress, Typography } from '@mui/material';

// URL base de tu backend de Django. Asumimos que está corriendo en http://localhost:8000
// Debes cambiar esto a la URL de producción cuando sea necesario.
const API_BASE_URL = 'http://localhost:8000/api'; 

const App = () => {
  // El estado 'user' almacenará la información del usuario autenticado (incluyendo el token)
  const [user, setUser] = useState(null); 
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  /**
   * Maneja el proceso de inicio de sesión enviando credenciales a la API de Django.
   * @param {string} username - Nombre de usuario.
   * @param {string} password - Contraseña.
   */
  const handleLogin = async (username, password) => {
    setIsLoading(true);
    setError('');

    try {
      // 1. Llamada a la API de Django para obtener el token de autenticación
      // NOTA: Este endpoint debe existir en Django REST Framework
      const response = await fetch(`${API_BASE_URL}/token/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // 2. Si el login es exitoso, guardamos el token
        const accessToken = data.access; 

        // 3. Simulación del rango: Esto debe ser reemplazado por una llamada real al backend
        let userRango = 'USUARIO';
        if (username === 'admin') {
            userRango = 'ADMINISTRADOR';
        } else if (username === 'profesor') {
            userRango = 'PROFESOR';
        }

        setUser({
          username: username,
          token: accessToken,
          rango: userRango,
        });

      } else {
        // Manejar errores de credenciales inválidas (401, 400)
        setError(data.detail || 'Credenciales inválidas. Inténtalo de nuevo.');
      }
    } catch (err) {
      console.error('Error de red o de servidor:', err);
      setError('No se pudo conectar con el servidor. Verifica que el backend esté corriendo.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Maneja el cierre de sesión (solo borra el estado local por ahora).
   */
  const handleLogout = () => {
    setUser(null);
  };

  // Muestra una pantalla de carga mientras se espera la respuesta del servidor
  if (isLoading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh', 
          bgcolor: '#f4f6f8' 
        }}
      >
        <CircularProgress color="primary" sx={{ mb: 2 }} />
        <Typography variant="h6" color="text.secondary">
          Autenticando usuario...
        </Typography>
      </Box>
    );
  }

  // 1. Si el usuario está autenticado, muestra el Dashboard
  if (user && user.token) {
    return (
      <AdminDashboard 
        userRango={user.rango} 
        handleLogout={handleLogout} 
      />
    );
  }

  // 2. Si no está autenticado, muestra la página de Login
  return (
    <LoginPage 
      handleLogin={handleLogin} 
      error={error} 
    />
  );
};

export default App;