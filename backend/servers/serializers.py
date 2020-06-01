from rest_framework import serializers
from .models import Server, Message, Label

class ServerSerializer(serializers.ModelSerializer):
    name = serializers.CharField(max_length=100)
    type_chat = serializers.CharField(max_length=1)
    

class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['user', 'message', 'labels', 'date_published']

class LabelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Label
        fields = ['text', 'color']
