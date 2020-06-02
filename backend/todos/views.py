from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .serializers import DeskSerializer
from .models import Desk

# Create your views here.
class DeskView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request):
        user = request.user
        desks = DeskSerializer(user.desk_set.all(), many = True)
        return Response(desks.data, status=status.HTTP_200_OK)
