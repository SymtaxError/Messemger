from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .serializers import ServerSerializer, MessageSerializer, LabelSerializer
from .models import Server, Message, Labels
from users.models import UserProfile

class ServerView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request):
        user = request.user
        servers = ServerSerializer(User.objects.filter(email=user.email), many=True)
        if serializer.is_valid():
            return Response(servers.data, status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request):
        serializer = serializer(data=request.data)
        permission_classes = [permissions.IsAuthenticated]
        if serializer.is_valid():
            data = serializer.validated_data
            server = Server.objects.create_server(data['name'], request.user)
            try:
                user = UserProfile.objects.get(tag=data['tag']).user
                server.users.add(user)
                server.type_chat = 'D'
                return Response(status=status.HTTP_201_CREATED)
            except BaseException:
                server.type_chat = 'C'
                return Response(status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Create your views here.
