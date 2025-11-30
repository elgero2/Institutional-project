"""
URL configuration for gestion_institucional project.
"""
from django.contrib import admin
from django.urls import path, include

# Importamos las vistas JWT necesarias
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)


urlpatterns = [
    # Panel de Administración de Django
    path('admin/', admin.site.urls),
    
    # Prefijo /api/ para todos los endpoints de la API REST
    path('api/', include([
        # Autenticación JWT: expone el endpoint que el frontend usa: /api/token/
        path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
        # Endpoint para refrescar el token de acceso
        path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
        
        # Incluir URLs de la aplicación 'usuarios' (¡CORREGIDO!)
        path('', include('usuarios.urls')),
    ])),
]
