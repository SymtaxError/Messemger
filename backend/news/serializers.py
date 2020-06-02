from rest_framework import serializers
from .models import NewsPost
from users.models import UserProfile

class NewsPostSerializer(serializers.Serializer):
    id = serializers.IntegerField(required=False)
    title = serializers.CharField(max_length=100)
    text = serializers.CharField(max_length=512)
    date_published = serializers.DateTimeField(format="year=%Y, month=%m, day=%d, hour=%H, minute=%M")
    author = serializers.CharField(max_length=60)

