from rest_framework import serializers
from .models import NewsPost
from users.models import UserProfile
from django.utils.dateparse import parse_datetime

class NewsPostSerializer(serializers.Serializer):
    """Given and expected format of NewsPost representation is
    author, author_tag, title, text and date_published (year, month,
    day, hour and minute."""
    id = serializers.IntegerField(read_only=True, required=False)
    author = serializers.CharField(max_length=60)
    author_tag = serializers.SerializerMethodField()
    title = serializers.CharField(max_length=100)
    text = serializers.CharField(max_length=512)
    date_published = serializers.SerializerMethodField()

    def get_date_published(self, obj):
        return str(obj.date_published) + ' UTC'

    def get_author_tag(self, obj):
        """Gets an author tag."""
        return obj.author.profile.tag


