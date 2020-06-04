from django.urls import path, include
from .views import DeskListView, DeskMembersModerateView

urlpatterns = [
    path('list/', DeskListView.as_view()),
    path('<int:desk_id>/members/', DeskMembersModerateView.as_view())
]