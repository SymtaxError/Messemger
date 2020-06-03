from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .serializers import DeskSerializer
from .models import Desk
import servers.methods


class DeskView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        print(user.desk_set.all())
        desks = DeskSerializer(user.desk_set.all(), many=True)
        return Response(desks.data, status=status.HTTP_200_OK)

    def post(self, request, *args):
        serializer = DeskSerializer(data=request.data)
        if serializer.is_valid():
            data = serializer.validated_data
            user = request.user
            # print(data['server'] in [server for server in user.server_set.all()])
            if (data['server'] in [server for server in user.server_set.all()]):
                # add desk
                # TODO

                return Response(status=status.HTTP_201_CREATED)
                # pass
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
