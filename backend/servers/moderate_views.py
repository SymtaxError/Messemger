from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .serializers import ServerMemberSerializer
from .models import Server, Message, Label
from .methods import server_has_user, is_owner

class ServerMembersModerateView(APIView):
    """Analyses given requests connected with servers and returns response"""

    permission_classes = [permissions.IsAuthenticated]
    """ Only authenticated users can interact with servers """

    def get(self, request, chat_id):
        """ Returns serialized list of users on current server"""
        user = request.user
        if server_has_user(request, chat_id):
            users = user.server_set.get(id=chat_id).users.all()
            profiles = []
            for i in range(len(users)):
                profiles.append(users[i].profile)
            users = ServerMemberSerializer(profiles, many=True)
            return Response(users.data, status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_403_FORBIDDEN)

    def post(self, request, chat_id):
        """ Adds users to server by their tags """
        user = request.user
        if server_has_user(request, chat_id):
            server = Server.objects.get(id=chat_id)
            tags = request.data['tags']
            server.add_users(tags)
            return Response(status=status.HTTP_201_CREATED)
        else:
            return Response(status=status.HTTP_403_FORBIDDEN)

    def put(self, request, chat_id):
        """ Kicks users from server by their tags.
        Only server owner or moderators can do that """
        if server_has_user(request, chat_id) and is_owner(request, chat_id):
            server = Server.objects.get(id=chat_id)
            tags = request.data['tags']
            server.remove_users(tags)
            return Response(status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_403_FORBIDDEN)
