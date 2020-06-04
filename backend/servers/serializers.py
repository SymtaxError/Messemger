from rest_framework import serializers
from .models import Label
from django.utils.dateparse import parse_datetime

class ServerSerializer(serializers.Serializer):
    id = serializers.IntegerField(required=False)
    name = serializers.CharField(max_length=100)
    type_chat = serializers.CharField(max_length=1, required=False)
    tag = serializers.CharField(max_length=128, required=False)
    picture = serializers.ImageField(required=False)

class MessageSerializer(serializers.Serializer):
    owner = serializers.CharField(max_length=60)
    owner_tag = serializers.SerializerMethodField()
    text = serializers.CharField(max_length=280)
    date_published = serializers.SerializerMethodField()
    def get_date_published(self, obj):
        datetime = parse_datetime(str(obj.date_published))
        date = {
            'year': datetime.year,
            'month': datetime.month,
            'day': datetime.day,
            'hour': datetime.hour,
            'minute': datetime.minute
        }
        return date
    
    def get_owner_tag(self, obj):
        return obj.owner.profile.tag

class LabelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Label
        fields = ['text', 'color']