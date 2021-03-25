from django.urls import path, include
from news.views import NewsPostView
import authentication.urls, users.urls, servers.urls, todos.urls

urlpatterns = [
    path('api/auth/', include(authentication.urls)),
    path('api/users/', include(users.urls)),
    path('api/servers/', include(servers.urls)),
    path('api/news/', NewsPostView.as_view()),
    path('api/todos/', include(todos.urls)),
]

