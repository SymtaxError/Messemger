from rest_framework import serializers
from .models import Server, Message, Label

class ServerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Server
        fields = ['picture', 'name', 'users', 'type']

class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['user', 'message', 'labels', 'date_published']

class LabelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Label
        fields = ['text', 'color']
