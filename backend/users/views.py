from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .serializers import UserSerializer, ProfileSerializer
from .models import User, UserProfile

class UserRegistrationView(APIView):
    authentication_classes = []
    permission_classes = [permissions.AllowAny]
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            data = serializer.validated_data
            try:
                user = User.objects.create_user(data['email'], data['password'])
                UserProfile.objects.create_profile(user, data['first_name'], data['last_name'])
                return Response(status=status.HTTP_201_CREATED)
            except:
                return Response(status=status.HTTP_403_FORBIDDEN)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request):
        user = request.user
        data = {
            'email': user.email,
            'first_name': user.profile.first_name,
            'last_name': user.profile.last_name,
            'tag': user.profile.tag,
        }
        if user.profile.status != None:
            data['status'] = user.profile.status
        profile = ProfileSerializer(data=data)
        if profile.is_valid():
            return Response(profile.data, status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
