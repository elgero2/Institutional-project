import React, { useState } from 'react';
import { 
  Box, AppBar, Toolbar, Typography, Button, Drawer, 
  List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, 
  CssBaseline 
} from '@mui/material';
import { 
  People as PeopleIcon, School as SchoolIcon, Business as BusinessIcon, 
  CalendarToday as CalendarIcon, Description as DescriptionIcon, 
  Settings as SettingsIcon, ExitToApp as ExitToAppIcon, Menu as MenuIcon 
} from '@mui/icons-material';

// Importamos el primer módulo real que vamos a construir
import UserManagement from '../modules/UserManagement'; 

const drawerWidth = 240;

// Definición de la estructura del menú lateral
const menuItems = [
  { 
    category: 'Gestión Institucional', 
    items: [
      { text: 'Usuarios', icon: <PeopleIcon />, component: 'Users' },
      { text: 'Sedes', icon: <BusinessIcon />, component: 'Locations' },
      { text: 'Programas', icon: <SchoolIcon />, component: 'Programs' },
    ] 
  },
  { 
    category: 'Gestión Académica', 
    items: [
      { text: 'Cursos', icon: <DescriptionIcon />, component: 'Courses' },
      { text: 'Asignaciones', icon: <DescriptionIcon />, component: 'Assignments' },
      { text: 'Períodos', icon: <CalendarIcon />, component: 'Periods' },
    ] 
  },
  { 
    category: 'Contenido Dinámico', 
    items: [
      { text: 'Noticias', icon: <DescriptionIcon />, component: 'News' },
      { text: 'Banners', icon: <DescriptionIcon />, component: 'Banners' },
      { text: 'Configuración', icon: <SettingsIcon />, component: 'Settings' },
    ] 
  },
];

const AdminDashboard = ({ userRango, handleLogout }) => {
  const [currentView, setCurrentView] = useState('Users'); // Vista inicial
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  
  // Función para determinar qué componente mostrar en el área principal
  const renderContent = () => {
    switch (currentView) {
      case 'Users':
        return <UserManagement />;
      case 'Locations':
        return <Typography variant="h4">Gestión de Sedes (Módulo Pendiente)</Typography>;
      case 'Programs':
        return <Typography variant="h4">Gestión de Programas (Módulo Pendiente)</Typography>;
      // ... (más casos para los otros módulos)
      default:
        return <Typography variant="h4">Selecciona una opción del menú.</Typography>;
    }
  };

  const drawer = (
    <div style={{ backgroundColor: '#263238', height: '100%' }}> {/* Fondo oscuro para el Sidebar */}
      <Toolbar>
        <Typography variant="h6" noWrap component="div" sx={{ color: '#fff' }}>
          ADMIN PANEL
        </Typography>
      </Toolbar>
      <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }} />
      <List>
        {menuItems.map((section, index) => (
          <React.Fragment key={index}>
            <ListItem disablePadding sx={{ py: 1, pl: 2 }}>
              <Typography variant="overline" color="text.secondary" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                {section.category}
              </Typography>
            </ListItem>
            {section.items.map((item) => (
              <ListItem 
                key={item.text} 
                disablePadding
                sx={{ 
                  borderLeft: currentView === item.component ? '4px solid #4fc3f7' : 'none', 
                  backgroundColor: currentView === item.component ? 'rgba(255, 255, 255, 0.08)' : 'inherit',
                  // El color general del texto del item se define aquí para el modo activo/inactivo
                  color: currentView === item.component ? '#fff' : 'rgba(255, 255, 255, 0.8)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  }
                }}
              >
                <ListItemButton 
                  onClick={() => {
                    setCurrentView(item.component);
                    if (mobileOpen) handleDrawerToggle(); // Cerrar en móvil al seleccionar
                  }}
                >
                  <ListItemIcon sx={{ color: 'inherit' }}>
                    {item.icon}
                  </ListItemIcon>
                  {/* CORRECCIÓN: Forzamos la herencia de color en el texto interno, ya que el ListItemButton es quien tiene el color correcto. */}
                  <ListItemText 
                    primary={item.text} 
                    sx={{ 
                      '& .MuiTypography-root': { 
                        color: 'inherit' 
                      } 
                    }} 
                  />
                </ListItemButton>
              </ListItem>
            ))}
            <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }} />
          </React.Fragment>
        ))}
        {/* Botón de Logout en el Sidebar */}
        <ListItem disablePadding sx={{ mt: 2 }}>
          <ListItemButton onClick={handleLogout} sx={{ color: '#ff8a80', '&:hover': { backgroundColor: 'rgba(255, 138, 128, 0.1)' } }}>
            <ListItemIcon sx={{ color: '#ff8a80' }}>
              <ExitToAppIcon />
            </ListItemIcon>
            <ListItemText primary="Cerrar Sesión" />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      
      {/* Barra superior (AppBar) */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          backgroundColor: '#fff',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}
      >
        <Toolbar>
          <Button
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' }, color: '#333' }}
          >
            <MenuIcon />
          </Button>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, color: '#333' }}>
            {currentView}
          </Typography>
          <Typography variant="body2" sx={{ color: '#666' }}>
            Rango: {userRango}
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Menú Lateral (Drawer) */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* Versión Móvil */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }} // Rendimiento en móvil
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        {/* Versión Escritorio */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Contenido Principal */}
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar /> {/* Espaciador para no superponer la barra superior */}
        <Typography variant="h5" gutterBottom color="primary">
          Panel de Control - Módulo: {currentView}
        </Typography>
        <Box sx={{ p: 2, border: '1px solid #eee', borderRadius: 2, minHeight: '80vh' }}>
          {renderContent()}
        </Box>
      </Box>
    </Box>
  );
};

export default AdminDashboard;