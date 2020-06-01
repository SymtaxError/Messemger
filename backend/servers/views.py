from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .serializers import ServerSerializer, MessageSerializer, LabelSerializer
from .models import Server, Message, Label
from users.models import UserProfile

class ServerView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request):
        user = request.user
        servers = ServerSerializer(user.server_set.all(), many=True)
        return Response(servers.data, status=status.HTTP_200_OK)

    def post(self, request):
        permission_classes = [permissions.IsAuthenticated]
        serializer = ServerSerializer(data=request.data)
        if serializer.is_valid():
            data = serializer.validated_data
            try:
                user = UserProfile.objects.get(tag=data['tag']).user
                server = Server.objects.create_server(data['name'],
                    creator=request.user, type_chat='D')
                server.users.add(request.user, user)
                server.save()
                return Response(status=status.HTTP_201_CREATED)
            except:
                server = Server.objects.create_server(data['name'],
                    creator=request.user, type_chat='C')
                server.users.add(request.user)
                return Response(status=status.HTTP_201_CREATED)
            else:
                return Response(statis=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
