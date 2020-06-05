from rest_framework import serializers
from .models import User

class UserSerializer(serializers.Serializer):
    """ Given and expected format of user representation is
    email, password, first name and last name
    """
    email = serializers.EmailField()
    password = serializers.CharField(max_length=128)
    first_name = serializers.CharField(max_length=30)
    last_name = serializers.CharField(max_length=30)

class ProfileSerializer(serializers.Serializer):
    """ Given and expected format of user's profile representation is
    email, first name, last name, tag and status
    """
    email = serializers.EmailField()
    first_name = serializers.CharField(max_length=30)
    last_name = serializers.CharField(max_length=30)
    tag = serializers.CharField(max_length=128)
    status = serializers.CharField(max_length=1000, required=False)