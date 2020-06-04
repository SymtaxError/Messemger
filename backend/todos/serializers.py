from rest_framework import serializers
from .models import Desk, Table, Card
from users.models import User

class AssignSerializer(serializers.Serializer):
    user_tag = serializers.SerializerMethodField()

    def get_user_tag(self, obj):
        return obj.profile.tag


class CardSerializer(serializers.ModelSerializer):
    assignees = AssignSerializer(read_only=True, many=True)

    class Meta:
        model = Card
        fields = ['id_on_table', 'title', 'assignees']


class TableSerializer(serializers.ModelSerializer):
    card_set = CardSerializer(read_only=True, many=True)

    class Meta:
        model = Table
        fields = ['id_on_desk', 'title', 'card_set']


class DeskListSerializer(serializers.ModelSerializer):
    table_set = TableSerializer(read_only=True, many=True)

    class Meta:
        model = Desk
        fields = ['id', 'title', 'server', 'table_set']

class DeskSerializer(serializers.Serializer):
    server_id = serializers.IntegerField()
    title = serializers.CharField(max_length=30)
    tags = serializers.SerializerMethodField()
    def get_tags(self, obj):
        if 'tags' in obj.keys():
            return obj['tags']
        else:
            return []
