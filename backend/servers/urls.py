from django.urls import path, include
from .views import ServerView, MessageView, LabelView

urlpatterns = [
    path('list/', ServerView.as_view()),
    path('messages/labels/', LabelView.as_view()),
    path('messages/', MessageView.as_view()),
]
