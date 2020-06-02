from django.urls import path, include
from .views import ServerView, MessageView

urlpatterns = [
    path('list/', ServerView.as_view()),
    path('messages/', MessageView.as_view()),
]
