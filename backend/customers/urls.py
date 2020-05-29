from django.urls import path
from .views import CustomerRegistrationView, CustomerProfileView

urlpatterns = [
    path('register/', CustomerRegistrationView.as_view()),
    path('profile/', CustomerProfileView.as_view())
]