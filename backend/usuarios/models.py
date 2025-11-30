from django.db import models
# CRÍTICO: Importamos Group y Permission para poder definir los campos con related_name
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin, Group, Permission 

# =================================================================
# 1. Definición del Manager Personalizado
# =================================================================
# Este manager es necesario para crear usuarios y superusuarios 
# usando el campo DNI en lugar del nombre de usuario por defecto.

class UsuarioManager(BaseUserManager):
    # Método para crear usuarios normales
    def create_user(self, dni, password=None, **extra_fields):
        # La validación de DNI es CRÍTICA
        if not dni:
            raise ValueError('El campo DNI debe ser obligatorio.')
        
        # Creamos la instancia del usuario
        user = self.model(dni=dni, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    # Método para crear superusuarios (administradores)
    def create_superuser(self, dni, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        extra_fields.setdefault('rango', 'Administrador')
        
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        # Llama a create_user
        return self.create_user(dni, password, **extra_fields)

# =================================================================
# 2. Definición del Modelo de Usuario
# =================================================================

class Usuario(AbstractBaseUser, PermissionsMixin):
    # Campos base
    dni = models.CharField(max_length=8, unique=True)
    nombres = models.CharField(max_length=100)
    apellidos = models.CharField(max_length=100)
    
    # Rango: para control de acceso
    RANGO_CHOICES = [
        ('Administrador', 'Administrador'),
        ('Profesor', 'Profesor'),
        ('Alumno', 'Alumno'),
    ]
    rango = models.CharField(max_length=20, choices=RANGO_CHOICES, default='Alumno')
    
    # Campos de Django
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    # SOLUCIÓN AL ERROR E304: RELATED_NAME ÚNICO
    groups = models.ManyToManyField(
        Group,
        verbose_name=('groups'),
        blank=True,
        help_text=('Los grupos a los que pertenece este usuario.'),
        related_name="usuario_groups", 
        related_query_name="usuario",
    )
    user_permissions = models.ManyToManyField(
        Permission,
        verbose_name=('user permissions'),
        blank=True,
        help_text=('Permisos específicos para este usuario.'),
        related_name="usuario_user_permissions", 
        related_query_name="usuario_permission",
    )
    
    # CLAVE ABSOLUTA: Define el campo de login
    USERNAME_FIELD = 'dni'
    
    # Campos que se pedirán en createsuperuser
    REQUIRED_FIELDS = ['nombres', 'apellidos', 'rango']

    # Asignación del Manager personalizado
    objects = UsuarioManager()

    def __str__(self):
        return f"{self.dni} - {self.apellidos}, {self.nombres}"

    class Meta:
        verbose_name = 'Usuario'
        verbose_name_plural = 'Usuarios'