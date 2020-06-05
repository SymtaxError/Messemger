from rest_framework import serializers
from .models import Label
from django.utils.dateparse import parse_datetime
from users.models import UserProfile

class ServerSerializer(serializers.Serializer):
    """ Given and expected format of servers representation is:
    id, name, type_chat, tag and picture.
    """

    id = serializers.IntegerField(required=False)
    name = serializers.CharField(max_length=100)
    type_chat = serializers.CharField(max_length=1, required=False)
    tag = serializers.CharField(max_length=128, required=False)
    picture = serializers.ImageField(required=False)

class MessageSerializer(serializers.Serializer):
    """ Given and expected format of messages representation is
    owner, owner_tag, text, date_published (year, month, day, hour, minute),
    labels(id, text, color).
    """

    owner = serializers.CharField(max_length=60)
    owner_tag = serializers.SerializerMethodField()
    text = serializers.CharField(max_length=280)
    date_published = serializers.SerializerMethodField()
    labels = serializers.SerializerMethodField()

    def get_labels(self, obj):
        """ Creates a message labels representation."""
        label_set = {}
        for label in obj.labels.all():
            label_set[label.id] = (label.text, label.color) 
        return label_set


    def get_date_published(self, obj):
        """Creates a message publishing date representation."""
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
        """Gets message owner tag."""
        return obj.owner.profile.tag

class LabelSerializer(serializers.Serializer):
    """Given and expected format of label representation is
    text and color.
    """

    text = serializers.CharField(max_length=30)
    color = serializers.CharField(max_length=1)

class ServerMemberSerializer(serializers.Serializer):
    """Representation of users in chat:
    first_name, last_name, tag, avatar.
    """

    first_name = serializers.CharField(max_length=30)
    last_name = serializers.CharField(max_length=30)
    tag = serializers.CharField(max_length=128)
    avatar = serializers.ImageField(allow_null=True)
