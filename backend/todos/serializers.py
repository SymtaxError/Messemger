from rest_framework import serializers
from .models import Desk, Table, Card


# class ToDosSerializer(serializers.Serializer):
#     id = serializers.IntegerField(required=False)
#     name = serializers.CharField(max_length=100)
#     type_chat = serializers.CharField(max_length=1, required=False)
#     tag = serializers.CharField(max_length=128, required=False)
#     picture = serializers.ImageField(required=False)

# class MessageSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Message
#         fields = ['user', 'message', 'labels', 'date_published']
#
# class LabelSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Label
#         fields = ['text', 'color']

class AssignSerializer(serializers.ModelSerializer):
    class Meta:
        fields = ['id']


class CardSerializer(serializers.ModelSerializer):
    assingn = AssignSerializer(read_only=True)

    class Meta:
        model = Card
        fields = ['id', 'id_on_table', 'title', 'assign']


class TableSerializer(serializers.ModelSerializer):
    cards = CardSerializer(read_only=True, many=True)

    class Meta:
        model = Table
        fields = ['id', 'id_on_desk', 'title', 'cards']


class DeskSerializer(serializers.ModelSerializer):
    tables = TableSerializer(read_only=True, many=True)

    class Meta:
        model = Desk
        fields = ['id', 'title', 'server', 'tables']
