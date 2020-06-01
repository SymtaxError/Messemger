from django.urls import path
from channels.routing import URLRouter
from .consumers import NotificationConsumer, ChatConsumer, ToDoConsumer

websocket_urlpatterns = URLRouter([
    path('notifications/', NotificationConsumer),
    path('chat/<int:id>/', ChatConsumer),
    path('todo/<int:id>/', ToDoConsumer)
])

# ws://localhost:8000/servers/notifications/