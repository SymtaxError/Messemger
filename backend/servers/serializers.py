from rest_framework import serializers
from .models import Label
from django.utils.dateparse import parse_datetime
from users.models import UserProfile

class ServerSerializer(serializers.Serializer):
    """ Given and expected format of servers representation is:
    id, name, type_chat, tag(s) and picture.
    """

    id = serializers.IntegerField(read_only=True, required=False)
    name = serializers.CharField(max_length=100)
    type_chat = serializers.CharField(max_length=1, read_only=True, required=False)
    tag = serializers.CharField(max_length=128, required=False, allow_blank=True)
    picture = serializers.ImageField(required=False)
    # tags = serializers.SerializerMethodField()

    # def get_tags(self, obj):
    #     if "tags" in obj.keys():
    #         return obj.tags
    #     else:
    #         return []

class MessageSerializer(serializers.Serializer):
    """ Given and expected format of messages representation is
    owner, owner_tag, text, date_published (year, month, day, hour, minute),
    labels(id, text, color).
    """

    action = serializers.SerializerMethodField()
    owner = serializers.CharField(max_length=60)
    params = serializers.SerializerMethodField()

    def get_action(self, obj):
        """ Returns type of action on server."""
        return "chat_message"
    
    def get_params(self, obj):
        """Returns text, owner_tag and chat_id."""
        params = {
            "text": obj.text,
            "owner_tag": obj.owner.profile.tag,
            "chat_id": obj.server.id,
            "date_published": str(obj.date_published) + ' UTC'
        }
        return params

    # owner_tag = serializers.SerializerMethodField()
    # text = serializers.CharField(max_length=280)
    # date_published = serializers.SerializerMethodField()
    # labels = serializers.SerializerMethodField()

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
    
    #def get_owner_tag(self, obj):
       # """Gets message owner tag."""
       # return obj.owner.profile.tag

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
