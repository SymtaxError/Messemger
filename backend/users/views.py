from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .serializers import UserSerializer, ProfileSerializer
from .models import User, UserProfile

class UserRegistrationView(APIView):
    """Provides users registration."""
    authentication_classes = []
    permission_classes = [permissions.AllowAny] #: Every user can create an account.
    def post(self, request):
        """ Allows creating an account if request data is correct."""
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
    """ Provides interacting with user profiles."""
    permission_classes = [permissions.IsAuthenticated] #: Only authenticated users can interact with profiles.
    def get(self, request):
        """Allows viewing profile of a requested user."""
        user = request.user
        data = {
            'email': user.email,
            'first_name': user.profile.first_name,
            'last_name': user.profile.last_name,
            'tag': user.profile.tag,
        }
        if user.profile.status != None:
            data['status'] = user.profile.status
        data['is_superuser'] = user.is_superuser
        profile = ProfileSerializer(data=data)
        if profile.is_valid():
            return Response(profile.data, status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def put(self, request):
        """ Updates user profile fields. """
        try:
            user = request.user
            text_data = {
                'tag' : user.profile.tag
            }
            for item in request.data.items():
                text_data[item[0]] = item[1]
            if 'email' not in text_data.keys():
                text_data['email'] = user.email
            if 'first_name' not in text_data.keys():
                text_data['first_name'] = user.profile.first_name
            if 'last_name' not in text_data.keys():
                text_data['last_name'] = user.profile.last_name
            files = {}
            for item in request.FILES.items():
                files[item[0]] = item[1]
            serializer = ProfileSerializer(data={**text_data, **files})
            if serializer.is_valid():
                user.profile.update(**serializer.validated_data)
                return Response(status=status.HTTP_200_OK)
            else:
                return Response(status=status.HTTP_400_BAD_REQUEST)
        except:
            return Response(status=status.HTTP_403_FORBIDDEN)
