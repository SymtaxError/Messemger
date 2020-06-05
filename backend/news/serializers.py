from rest_framework import serializers
from .models import NewsPost
from users.models import UserProfile
from django.utils.dateparse import parse_datetime

class NewsPostSerializer(serializers.Serializer):
    """Given and expected format of NewsPost representation is
    author, author_tag, title, text and date_published (year, month,
    day, hour and minute."""
    #id = serializers.IntegerField(required=False)
    author = serializers.CharField(max_length=60)
    author_tag = serializers.SerializerMethodField()
    title = serializers.CharField(max_length=100)
    text = serializers.CharField(max_length=512)
    date_published = serializers.SerializerMethodField()

    def get_date_published(self, obj):
        """Creates a post publishing date representation."""
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
        """Gets an author tag."""
        return obj.author.profile.tag


