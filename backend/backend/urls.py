from django.urls import path, include
import authentication.urls

urlpatterns = [
    path('auth/', include(authentication.urls))
]