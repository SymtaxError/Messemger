from django.urls import path
from channels.routing import URLRouter
from .consumers import NotificationConsumer, ChatConsumer

websocket_urlpatterns = URLRouter([
    path('notifications/', NotificationConsumer),
    path('chat/<int:id>/', ChatConsumer)
])
