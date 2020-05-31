from django.urls import path, include
import authentication.urls, users.urls, servers.urls

urlpatterns = [
    path('auth/', include(authentication.urls)),
    path('users/', include(users.urls)),
    path('servers/', include(servers.urls))
]