from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model

# Obtenemos el modelo de usuario actual, que es 'usuarios.Usuario'
User = get_user_model()

class DniTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Serializador personalizado para obtener tokens JWT utilizando el campo DNI 
    en lugar del campo 'username' por defecto.
    """
    
    # Sobrescribimos el campo principal. Django Simple JWT buscará este campo 
    # en la solicitud HTTP POST para autenticar.
    username_field = User.USERNAME_FIELD # Esto es 'dni'

    @classmethod
    def get_token(cls, user):
        """
        Sobrescribe el método base para inyectar datos adicionales en el token de acceso.
        Aquí incluiremos el DNI y el Rango.
        """
        token = super().get_token(user)

        # Añadimos claims personalizados al token
        token['dni'] = user.dni
        token['nombres'] = user.nombres
        token['apellidos'] = user.apellidos
        # CRÍTICO: Añadimos el rango para el control de acceso en el frontend
        token['rango'] = user.rango 

        return token
    
    def validate(self, attrs):
        """
        Asegura que el campo 'dni' sea usado en lugar de 'username' al validar
        las credenciales.
        """
        # Cambiamos la clave 'username' a 'dni' en los atributos validados
        attrs[self.username_field] = attrs.pop('dni')
        
        # Llamamos al método validate de la clase base, que realiza la autenticación
        # y generación de tokens.
        data = super().validate(attrs)

        # En este punto, 'data' contendrá 'access' y 'refresh' si la autenticación fue exitosa
        return data

# Nota: No necesitamos un Serializer para el modelo Usuario aquí, solo para el token.