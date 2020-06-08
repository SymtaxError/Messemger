from django.urls import path
from .moderate_views import ServerMembersModerateView

urlpatterns = [
    path('members/', ServerMembersModerateView.as_view())
]