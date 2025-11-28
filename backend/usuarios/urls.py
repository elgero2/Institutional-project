from django.urls import path
from rest_framework.views import APIView
from rest_framework.response import Response

# Vista simple de prueba
class UserStatusView(APIView):
    # Por defecto, esta vista está protegida (requiere token JWT)
    def get(self, request):
        # request.user está disponible si la autenticación es exitosa
        return Response({
            'message': 'Acceso exitoso con token JWT!',
            'username': request.user.username,
            'email': request.user.email,
        })

urlpatterns = [
    # Endpoint de prueba: /api/status/
    path('status/', UserStatusView.as_view(), name='user_status'),
]