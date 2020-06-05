from channels.auth import AuthMiddlewareStack
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.contrib.auth.models import AnonymousUser
from users.models import User
from django.db import close_old_connections
from channels.db import database_sync_to_async

@database_sync_to_async
def close_connections():
    #: async function to close old db connections
    close_old_connections()

@database_sync_to_async
def get_user(token):
    """ Async function to check if JWT token
    refer to user. Returns User object"""
    jwt = JWTAuthentication()
    try:
        return jwt.get_user(jwt.get_validated_token(token))
    except:
        return AnonymousUser()

class JWTAuthMiddleware:
    """ Custom JWT authentication middleware for Websockets """
    def __init__(self, inner):
        self.inner = inner

    def __call__(self, scope):
        return JWTAuthMiddlewareInstance(scope, self)

class JWTAuthMiddlewareInstance:
    """ Custom JWT authentication middleware for Websockets """
    def __init__(self, scope, middleware):
        self.middleware = middleware
        self.scope = dict(scope)
        self.inner = self.middleware.inner

    async def __call__(self, receive, send):
        close_connections()
        #: get JWT token from ws request
        token = self.scope['query_string'].decode().split('&')[0][6:]
        self.scope['user'] = await get_user(token)
        inner = self.inner(self.scope)
        return await inner(receive, send)

JWTAuthMiddlewareStack = lambda inner: JWTAuthMiddleware(AuthMiddlewareStack(inner))