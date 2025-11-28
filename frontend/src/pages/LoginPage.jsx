// frontend/src/pages/LoginPage.jsx
import React from 'react';
import { Box, Typography, Button, TextField, Container } from '@mui/material';

// Nota: Vamos a crear la lógica de conexión a la API en el siguiente paso
const LoginPage = ({ handleLogin }) => {
  return (
    <Container component="main" maxWidth="xs">
      <Box 
        sx={{ 
          marginTop: 8, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          p: 4, 
          boxShadow: 3, 
          borderRadius: 2 
        }}
      >
        <Typography component="h1" variant="h5">
          Acceso Institucional
        </Typography>
        <Box component="form" noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="DNI / Identificación"
            name="dni"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Contraseña"
            type="password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            // Simulamos el login por ahora. Luego usaremos AXIOS para llamar a la API
            onClick={() => handleLogin('ADMINISTRADOR')} 
          >
            Iniciar Sesión
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default LoginPage;