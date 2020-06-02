from django.urls import path, include
from .views import ServerView

urlpatterns = [
    path('list/', ServerView.as_view()),
]