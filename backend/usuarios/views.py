# backend/usuarios/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate, login
    
# Asegúrate de que esta clase exista y esté correctamente definida
class LoginView(APIView):
    permission_classes = () # Permitimos acceso a esta vista sin autenticación previa
        
    def post(self, request, format=None):
        # 1. Obtener DNI y Contraseña de la petición
        dni = request.data.get('dni')
        password = request.data.get('password')
            
        # 2. Autenticar al usuario
        user = authenticate(request, username=dni, password=password)
            
        if user is not None:
            # 3. Iniciar sesión (para que Django mantenga la sesión)
            login(request, user)
                
            # 4. Devolver respuesta exitosa
            return Response({
                'message': 'Inicio de sesión exitoso',
                'dni': user.dni,
                'nombres': user.nombres,
                'apellidos': user.apellidos,
                'rango': user.rango # <--- ¡Clave para saber qué interfaz cargar!
            }, status=status.HTTP_200_OK)
        else:
            # 5. Devolver error de credenciales
            return Response({
                'error': 'DNI o Contraseña incorrectos'
            }, status=status.HTTP_401_UNAUTHORIZED)