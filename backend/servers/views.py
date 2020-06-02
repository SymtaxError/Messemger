from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .serializers import ServerSerializer, MessageSerializer, LabelSerializer
from .models import Server, Message, Label
from users.models import UserProfile
import servers.methods

class ServerView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request):
        user = request.user
        servers = ServerSerializer(user.server_set.all(), many=True)
        return Response(servers.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = ServerSerializer(data=request.data)
        if serializer.is_valid():
            data = serializer.validated_data
            try:
                user = UserProfile.objects.get(tag=data['tag']).user
                server = Server.objects.create_server(data['name'],
                    creator=request.user, type_chat='D')
                server.users.add(user)
                server.save()
                return Response(status=status.HTTP_201_CREATED)
            except:
                server = Server.objects.create_server(data['name'],
                    creator=request.user, type_chat='C')
                return Response(status=status.HTTP_201_CREATED)
            else:
                return Response(statis=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        if servers.methods.is_owner(request):
            id = int(request.GET.get('chat_id'))
            request.user.server_set.get(id=id).delete()
            return Response(status=status.HTTP_200_OK)
        return Response(status=status.HTTP_403_FORBIDDEN)

    def put(self, request):
        id = int(request.GET.get('chat_id'))
        if servers.methods.server_has_user(request, id):
            text_data = {}
            for item in request.data.items():
                text_data[item[0]] = item[1]
            files = {}
            for item in request.FILES.items():
                files[item[0]] = item[1]
            serializer = ServerSerializer(data={**text_data, **files})
            if serializer.is_valid():
                server = Server.objects.get(id=id)
                server.update(**serializer.validated_data)
                return Response(status=status.HTTP_200_OK)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_403_FORBIDDEN)
