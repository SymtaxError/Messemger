from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('jwt/login/', TokenObtainPairView.as_view()),
    path('jwt/refresh/', TokenRefreshView.as_view())
]