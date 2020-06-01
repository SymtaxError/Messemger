from django.urls import path, include
from .views import ServerView

urlpatterns = [
    path('', ServerView.as_view()),
]