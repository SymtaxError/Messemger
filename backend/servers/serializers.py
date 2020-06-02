from rest_framework import serializers
from .models import Server, Message, Label

class ServerSerializer(serializers.Serializer):
    id = serializers.IntegerField(required=False)
    name = serializers.CharField(max_length=100)
    type_chat = serializers.CharField(max_length=1, required=False)
    tag = serializers.CharField(max_length=128, required=False)

class MessageSerializer(serializers.ModelSerializer):
    text = serializers.CharField(max_length=280)

class LabelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Label
        fields = ['text', 'color']
