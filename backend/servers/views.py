from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .serializers import ServerSerializer, MessageSerializer, LabelSerializer
from .models import Server, Message, Labels

class ServerView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request):
        servers = ServerSerializer(User.objects.filter(email=request.user.email), many=True)
        return 
# Create your views here.
