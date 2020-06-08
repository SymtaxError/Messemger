from django.urls import path, include
from news.views import NewsPostView
import authentication.urls, users.urls, servers.urls, todos.urls

urlpatterns = [
    path('auth/', include(authentication.urls)),
    path('users/', include(users.urls)),
    path('servers/', include(servers.urls)),
    path('news/', NewsPostView.as_view()),
    path('todos/', include(todos.urls)),
]

