from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .serializers import UserSerializer, ProfileSerializer
from .models import User

class UserRegistrationView(APIView):
    authentication_classes = []
    permission_classes = [permissions.AllowAny]
    def post(self, request):
        user = UserSerializer(data=request.data)
        if user.is_valid():
            User.objects.create_user(**user.validated_data)
            return Response(status=status.HTTP_201_CREATED)
        return Response(user.errors, status=status.HTTP_400_BAD_REQUEST)

class UserProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request):
        profile = ProfileSerializer(request.user)
        return Response(profile.data, status=status.HTTP_200_OK)
