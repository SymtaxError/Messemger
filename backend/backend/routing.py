from channels.routing import ProtocolTypeRouter, URLRouter
from authentication.middleware import JWTAuthMiddlewareStack
import servers.routing
from django.urls import include, path

application = ProtocolTypeRouter({
    'websocket': JWTAuthMiddlewareStack(
        URLRouter([
            path('servers/', servers.routing.websocket_urlpatterns),
        ]),
    )
})