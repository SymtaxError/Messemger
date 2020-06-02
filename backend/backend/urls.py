from django.urls import path, include
import authentication.urls, users.urls, servers.urls
from news.views import NewsPostView

urlpatterns = [
    path('auth/', include(authentication.urls)),
    path('users/', include(users.urls)),
    path('servers/', include(servers.urls)),
    path('news/', NewsPostView.as_view()),
]
