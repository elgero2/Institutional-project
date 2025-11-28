# backend/usuarios/admin.py
from django.contrib import admin
from .models import Usuario # Importa el modelo Usuario

# 1. (Opcional pero Recomendado): Define cómo se verá la lista de usuarios
class UsuarioAdmin(admin.ModelAdmin):
    # Campos que se mostrarán en la lista de la tabla de usuarios
    list_display = ('dni', 'nombres', 'apellidos', 'rango', 'is_staff', 'is_active')
    # Filtros laterales
    list_filter = ('rango', 'is_staff', 'is_active')
    # Campos por los que se puede buscar
    search_fields = ('dni', 'nombres', 'apellidos')
    # Orden inicial
    ordering = ('apellidos',) 

# 2. Registra el modelo Usuario con la configuración que definiste
admin.site.register(Usuario, UsuarioAdmin)