from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .serializers import DeskListSerializer, DeskSerializer
from servers.serializers import ServerMemberSerializer
from .models import Desk
from todos.methods import desk_has_user, is_owner
from users.models import UserProfile

class DeskListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        desks = DeskListSerializer(user.desk_set.all(), many=True)
        return Response(desks.data, status=status.HTTP_200_OK)

    def post(self, request):
        try:
            serializer = DeskSerializer(request.data)
            data = serializer.data
            tags = data['tags']
            user = request.user
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        try:
            user.server_set.get(id=data['server_id'])
            desk = Desk.objects.create_desk(data['title'],
                data['server_id'], user, *tags)
            return Response(status=status.HTTP_201_CREATED)
        except:
            return Response(status=status.HTTP_403_FORBIDDEN)

    def put(self, request):
        desk_id = int(request.GET.get('desk_id'))
        if desk_has_user(request, desk_id):
            text_data = {}
            for item in request.data.items():
                text_data[item[0]] = item[1]
            if not 'title' in text_data.keys():
                return Response(status=status.HTTP_400_BAD_REQUEST)
            desk = Desk.objects.get(id=desk_id)
            desk.edit_title(text_data['title'])
            return Response(status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_403_FORBIDDEN)

class DeskMembersModerateView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request, desk_id):
        user = request.user
        if desk_has_user(request, desk_id):
            users = user.desk_set.get(id=desk_id).users.all()
            profiles = []
            for i in range(len(users)):
                profiles.append(users[i].profile)
            users = ServerMemberSerializer(profiles, many=True)
            return Response(users.data, status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_403_FORBIDDEN)

    def post(self, request, desk_id):
        user = request.user
        if desk_has_user(request, desk_id):
            desk = Desk.objects.get(id=desk_id)
            tags = request.data['tags']
            desk.add_users(tags)
            return Response(status=status.HTTP_201_CREATED)
        else:
            return Response(status=status.HTTP_403_FORBIDDEN)

    def put(self, request, desk_id):
        if desk_has_user(request, desk_id) and is_owner(request, desk_id):
            desk = Desk.objects.get(id=desk_id)
            tags = request.data['tags']
            desk.remove_users(tags)
            return Response(status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_403_FORBIDDEN)