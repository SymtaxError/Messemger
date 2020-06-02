from rest_framework import serializers
from .models import NewsPost
from users.models import UserProfile
from django.utils.dateparse import parse_datetime

class NewsPostSerializer(serializers.Serializer):
    #id = serializers.IntegerField(required=False)
    author = serializers.CharField(max_length=60)
    author_tag = serializers.SerializerMethodField()
    title = serializers.CharField(max_length=100)
    text = serializers.CharField(max_length=512)
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

    def get_author_tag(self, obj):
        return obj.author.profile.tag


