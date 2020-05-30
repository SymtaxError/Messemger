from django.urls import path
from .views import UserRegistrationView, UserProfileView

urlpatterns = [
    path('register/', UserRegistrationView.as_view()),
    path('profile/', UserProfileView.as_view()),
]