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
   * @param {string} dni - DNI del usuario.
   * @param {string} password - Contraseña.
   */
  const handleLogin = async (dni, password) => { // Cambiado 'username' a 'dni'
    setIsLoading(true);
    setError('');

    try {
      // DIAGNÓSTICO: Mostramos las credenciales que se van a enviar (solo para depuración)
      console.log('Enviando credenciales:', { dni: dni, passwordLength: password.length > 0 ? 'HIDDEN' : 0 });

      // 1. Llamada a la API de Django para obtener el token de autenticación
      const response = await fetch(`${API_BASE_URL}/token/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // CRÍTICO: CAMBIAMOS 'username' por 'dni' para que coincida con el Serializador de Django
        body: JSON.stringify({ dni, password }), 
      });

      const data = await response.json();

      if (response.ok) {
        // 2. Si el login es exitoso, guardamos el token
        const accessToken = data.access; 

        // 3. Opcionalmente: Llamar a otro endpoint para obtener los datos de rango del usuario
        // Este paso asume que tienes un endpoint como /users/me/ que devuelve la info.
        // Por ahora, simularemos que el rango viene en la respuesta del token o se obtiene luego.
        
        // Simulación: Asignamos el rango basado en el dni (esto debe ser REAL en el backend)
        let userRango = 'USUARIO';
        if (dni === '00000000') { // Usamos el DNI del administrador
            userRango = 'ADMINISTRADOR';
        } else if (dni === '96161953') { // Ejemplo de un DNI de profesor
            userRango = 'PROFESOR';
        }

        setUser({
          dni: dni, // Guardamos el DNI en lugar del username
          token: accessToken,
          rango: userRango,
        });

      } else {
        // Manejar errores de credenciales inválidas (401, 400)
        setError(data.detail || 'Credenciales incorrectas. Verifique su DNI y Contraseña.'); // Mensaje de error más específico
      }
    } catch (err) {
      console.error('Error de red o de servidor:', err);
      setError('No se pudo conectar con el servidor. Verifica que el backend esté corriendo.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Maneja el cierre de sesión (opcionalmente invalidando el token en el backend).
   */
  const handleLogout = () => {
    // Aquí podrías enviar el refresh token al endpoint /logout/ de Django 
    // para invalidar la sesión, pero por ahora solo borramos el estado local.
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