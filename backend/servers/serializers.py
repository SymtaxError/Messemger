from rest_framework import serializers
from .models import Server, Message, Label

class ServerSerializer(serializers.Serializer):
    id = serializers.IntegerField(required=False)
    name = serializers.CharField(max_length=100)
    type_chat = serializers.CharField(max_length=1, required=False)
    tag = serializers.CharField(max_length=128, required=False)
    picture = serializers.ImageField(required=False)

class MessageSerializer(serializers.Serializer):
    owner = serializers.CharField(max_length=60)
    owner_tag = serializers.CharField(max_length=128)
    text = serializers.CharField(max_length=280)
    date_published = serializers.DateTimeField(format="{ year : %Y, month : %m, day : %d, hour : %H, minute : %M}")

class LabelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Label
        fields = ['text', 'color']
