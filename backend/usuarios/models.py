# backend/usuarios/models.py
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.utils.translation import gettext_lazy as _

# --- 1. CONSTANTES DE RANGOS ---
class RangoUsuario:
    # Definimos las opciones posibles para el campo 'rango'
    ADMINISTRADOR = 'ADMINISTRADOR'
    MODERADOR = 'MODERADOR'
    PROFESOR = 'PROFESOR'
    SOPORTE = 'SOPORTE'
    ALUMNO = 'ALUMNO'

    OPCIONES = [
        (ADMINISTRADOR, 'Administrador'),
        (MODERADOR, 'Moderador'),
        (PROFESOR, 'Profesor'),
        (SOPORTE, 'Soporte'),
        (ALUMNO, 'Alumno'),
    ]

# --- 2. MANAGER PERSONALIZADO ---
# Este manager es necesario para que Django sepa cómo crear usuarios con nuestro modelo
class CustomUserManager(BaseUserManager):
    def create_user(self, dni, password=None, **extra_fields):
        if not dni:
            raise ValueError('El DNI debe ser proporcionado')
        
        user = self.model(
            dni=dni,
            **extra_fields
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, dni, password, **extra_fields):
        extra_fields.setdefault('rango', RangoUsuario.ADMINISTRADOR)
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        
        return self.create_user(dni, password, **extra_fields)

# --- 3. MODELO DE USUARIO PERSONALIZADO ---
class Usuario(AbstractBaseUser, PermissionsMixin):
    # DNI: Es el campo clave y el que usaremos para iniciar sesión
    dni = models.CharField(max_length=8, unique=True, primary_key=True, verbose_name=_('DNI/Identificación'))
    
    # Datos personales
    nombres = models.CharField(max_length=100)
    apellidos = models.CharField(max_length=100)
    
    # Rango: Determina la interfaz que verá
    rango = models.CharField(
        max_length=20,
        choices=RangoUsuario.OPCIONES,
        default=RangoUsuario.ALUMNO,
        verbose_name=_('Rango de Usuario')
    )
    
    # Campos de Django para la autenticación
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    
    # Configuramos el DNI como el campo de nombre de usuario para el inicio de sesión
    USERNAME_FIELD = 'dni'
    REQUIRED_FIELDS = ['nombres', 'apellidos']
    
    objects = CustomUserManager()

    def __str__(self):
        return f'{self.dni} - {self.apellidos}, {self.nombres} ({self.rango})'

    class Meta:
        verbose_name = _('Usuario Institucional')
        verbose_name_plural = _('Usuarios Institucionales')
        ordering = ['apellidos']