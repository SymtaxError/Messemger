from django.urls import path, include
from .views import DeskView

urlpatterns = [
    path('list/', DeskView.as_view()),
]