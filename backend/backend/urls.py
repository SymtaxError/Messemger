from django.urls import path, include
import authentication.urls, customers.urls

urlpatterns = [
    path('auth/', include(authentication.urls)),
    path('users/', include(customers.urls))
]