import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const UserManagement = () => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        👥 Módulo de Gestión de Usuarios
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        Aquí implementaremos la tabla de usuarios, filtros y el formulario para crear un nuevo usuario (Alumno, Profesor o Administrador).
      </Typography>
      <Button variant="contained" color="primary">
        + Crear Nuevo Usuario
      </Button>
      {/* Aquí irá la tabla de listado de usuarios */}
      <Box sx={{ mt: 4, p: 2, border: '1px dashed #ccc', minHeight: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography color="text.secondary">
          Tabla de Listado de Usuarios (Próxima Implementación)
        </Typography>
      </Box>
    </Box>
  );
};

export default UserManagement;