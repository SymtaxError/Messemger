from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .serializers import ServerSerializer, MessageSerializer, LabelSerializer
from .models import Server, Message, Label
from users.models import UserProfile
import servers.methods

class ServerView(APIView):
    """Analyses given requests connected with servers and returns response"""

    permission_classes = [permissions.IsAuthenticated] 
    """ Only authenticated users can interact with servers """
   
    def get(self, request):
        """ Returns serialized list of users' servers"""
        user = request.user
        servers = ServerSerializer(user.server_set.all(), many=True)
        return Response(servers.data, status=status.HTTP_200_OK)

    def post(self, request):
        """ Creates a new server """
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
        """ Deletes an existing server if user that has sent a request
        is its' owner"""
        id = int(request.GET.get('chat_id'))
        if servers.methods.is_owner(request, id):
            request.user.server_set.get(id=id).delete()
            return Response(status=status.HTTP_200_OK)
        return Response(status=status.HTTP_403_FORBIDDEN)

    def put(self, request):
        """ Updates server fields if user is in the chat """
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



class MessageView(APIView):
    """Analyses given requests connected with messages and returns response"""

    permission_classes = [permissions.IsAuthenticated]
    """Only authenticated users can interact with messages"""

    def get(self, request):
        """ Returns a list of messages (requested amount from the message with
        the certain id) if user is in the chat"""
        chat_id = int(request.GET.get('chat_id'))
        count = int(request.GET.get('count'))
        start = int(request.GET.get('start')) - 1
        if servers.methods.server_has_user(request, chat_id):
            try:
                server = Server.objects.get(id=chat_id)
                query_set = server.message_set.all()[start: start + count]
                serializer = MessageSerializer(query_set, many=True)
                return Response(serializer.data, status=status.HTTP_200_OK)
            except:
                return Response(status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(status=status.HTTP_403_FORBIDDEN)

    def post(self, request):
        """ Creates a new message if user is in the chat """
        chat_id = int(request.GET.get('chat_id'))
        if servers.methods.server_has_user(request, chat_id):
            query_set = {}
            query_set['text'] = request.data['text']
            query_set['owner'] = str(request.user)
            serializer = MessageSerializer(data=query_set)
            if serializer.is_valid():
                data = serializer.validated_data
                Message.objects.create_message(
                    text=data['text'],
                    owner=request.user,
                    server = Server.objects.get(id=chat_id)
                )
                return Response(status=status.HTTP_201_CREATED)
            else:
                return Response(
                    serializer.errors,
                    status=status.HTTP_400_BAD_REQUEST
                )
        return Response(status=status.HTTP_403_FORBIDDEN)

class LabelView(APIView):
    """Analyses given requests connected with labels and returns response"""

    permission_classes = [permissions.IsAuthenticated]
    """ Only authenticated users can interact with labels"""
    def post(self, request):
        """ Creates a new label for the certain message or adds an existing
        one to the list of message labels if user is in the chat"""
        message_id = int(request.GET.get('message_id'))
        print(request.user, message_id)
        if request.user in Message.objects.get(id=message_id).server.users.all():
            serializer = LabelSerializer(data=request.data)
            if serializer.is_valid():
                data = serializer.validated_data
                if Label.objects.filter(text=data['text']).count() == 0:
                    label = Label.objects.create_label(
                        text=data['text'],
                        color=data['color']
                    )
                else:
                    label = Label.objects.get(text=data['text'])
                Message.objects.get(id=message_id).labels.add(label)
                return Response(status=status.HTTP_201_CREATED)
            else:
                return Response(
                    serializer.errors,
                    status=status.HTTP_400_BAD_REQUEST
                )
        return Response(status=status.HTTP_403_FORBIDDEN)

    def delete(self, request):
        """ Unfastens a label from the message if user is in the chat """
        message_id = int(request.GET.get('message_id'))
        label_id = int(request.GET.get('label_id'))
        if request.user in Message.objects.get(id=message_id).server.users.all():
            try:
                Message.objects.get(id=message_id).labels.remove(Label.objects.get(id=label_id))
                return Response(status=status.HTTP_200_OK)
            except:
                return Response(status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_403_FORBIDDEN)
