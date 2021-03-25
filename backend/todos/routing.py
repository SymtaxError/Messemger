from django.urls import path
from channels.routing import URLRouter
from .consumers import ToDoConsumer

websocket_urlpatterns = URLRouter([
    path('todo/<int:id>/', ToDoConsumer)
])