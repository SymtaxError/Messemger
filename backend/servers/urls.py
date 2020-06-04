from django.urls import path, include
from .views import ServerView, MessageView, LabelView
from . import moderate_urls

urlpatterns = [
    path('<int:chat_id>/', include(moderate_urls)),
    path('list/', ServerView.as_view()),
    path('messages/labels/', LabelView.as_view()),
    path('messages/', MessageView.as_view()),
]
