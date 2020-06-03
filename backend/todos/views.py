from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .serializers import DeskSerializer
from .models import Desk
import todos.methods
# from .todos.methods import
# from users.models import UserProfile
# import todos.methods



class DeskView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        print(request)
        desks = DeskSerializer(user.desk_set.all(), many=True)
        return Response(desks.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = DeskSerializer(data=request.data)
        if serializer.is_valid():
            data = serializer.validated_data
            user = request.user
            if (data['server'] in [server for server in user.server_set.all()]):
                # user = UserProfile.objects.get(tag=data['tag']).user
                desk = Desk.objects.create_desk(title=data['title'],
                                                  server=data['server'],
                                                  creator=user)
                desk.save()
                return Response(status=status.HTTP_201_CREATED)
                # pass
            return Response(serializer.errors, status=status.HTTP_403_FORBIDDEN)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        id = int(request.GET.get('id'))
        if todos.methods.desk_has_user(request, id):
            text_data = {}
            for item in request.data.items():
                text_data[item[0]] = item[1]
            if not 'title' in text_data.keys():
                return Response(status=status.HTTP_400_BAD_REQUEST)
            # serializer = DeskSerializer(data={**text_data})
            # print('aaa')
            # if serializer.is_valid():
            desk = Desk.objects.get(id=id)
            desk.edit_title(text_data['title'])

            desk.save()
            return Response(status=status.HTTP_200_OK)
        else:
            # else:
            return Response(status=status.HTTP_406_NOT_ACCEPTABLE)