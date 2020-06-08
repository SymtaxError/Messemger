from rest_framework import serializers
from .models import Desk, Table, Card
from users.models import User

class AssignSerializer(serializers.Serializer):
    """ Given and expected format of assigness representation is:
    user_tag
    """

    user_tag = serializers.SerializerMethodField()

    def get_user_tag(self, obj):
        return obj.profile.tag


class CardSerializer(serializers.ModelSerializer):
    """ Given and expected format of cards representation is:
    id_on_table, title, assignees (tags of users)
    """

    assignees = AssignSerializer(read_only=True, many=True)

    class Meta:
        model = Card
        fields = ['id_on_table', 'title', 'assignees']


class TableSerializer(serializers.ModelSerializer):
    """ Given and expected format of tables representation is:
    id_on_desk, title, card_set (includes id_on_table, title, assignees (tags of users))
    """
    card_set = CardSerializer(read_only=True, many=True)

    class Meta:
        model = Table
        fields = ['id_on_desk', 'title', 'card_set']


class DeskListSerializer(serializers.ModelSerializer):
    """ Given and expected format of desks list representation is:
    id, title, server, table_set (includes id_on_desk, title, card_set (includes
    id_on_table, title, assignees (tags of users)))
    """

    table_set = TableSerializer(read_only=True, many=True)

    class Meta:
        model = Desk
        fields = ['id', 'title', 'server', 'table_set']

class DeskSerializer(serializers.Serializer):
    """ Given and expected format of desks representation is:
    server, tittle, tags.
    """
    server_id = serializers.IntegerField()
    title = serializers.CharField(max_length=30)
    tags = serializers.SerializerMethodField()
    def get_tags(self, obj):
        if 'tags' in obj.keys():
            return obj['tags']
        else:
            return []
