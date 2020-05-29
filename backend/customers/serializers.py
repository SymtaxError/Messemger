from rest_framework import serializers
from .models import Customer

class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = ['email', 'password', 'first_name', 'last_name']

class ProfileSerializer(CustomerSerializer):
    class Meta:
        model = Customer
        fields = ['email', 'first_name', 'last_name']