from django.urls import path, include
import authentication.urls, users.urls, servers.urls, todos.urls

urlpatterns = [
    path('auth/', include(authentication.urls)),
    path('users/', include(users.urls)),
    path('servers/', include(servers.urls)),
    path('todos/', include(todos.urls)),
]