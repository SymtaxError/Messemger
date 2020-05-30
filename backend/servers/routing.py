from django.urls import path
from channels.routing import URLRouter
from . import consumers

websocket_urlpatterns = URLRouter([
    path('notifications/', consumers.NotificationConsumer),
])

# ws://localhost:8000/servers/notifications/