from channels.routing import ProtocolTypeRouter, URLRouter
from authentication.middleware import JWTAuthMiddlewareStack
import servers.routing, todos.routing
from django.urls import include, path

application = ProtocolTypeRouter({
    'websocket': JWTAuthMiddlewareStack(
        URLRouter([
            path('api/ws/', servers.routing.websocket_urlpatterns),
            path('api/ws/', todos.routing.websocket_urlpatterns)
        ]),
    )
})