import json
from channels.db import database_sync_to_async
from asgiref.sync import async_to_sync
from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.auth.models import AnonymousUser
from todos.models import Desk, Table, Card
from servers.consumers import get_full_name

class ToDoConsumer(AsyncWebsocketConsumer):
    """ ToDoConsumer is class that provides full
    async Websockets functionality for todos """
    async def connect(self):
        #: function for establish connection with authorized user
        if not (type(self.scope['user']) == AnonymousUser):
            self.desk_id = self.scope['url_route']['kwargs']['id']
            self.group_name = 'desk_' + str(self.desk_id)
            self.desk = await self.get_desk_from_id()
            if (self.desk != None) and (await self.desk_has_user()):
                await self.channel_layer.group_add(self.group_name, self.channel_name)
                await self.accept()
        else:
            await self.disconnect(3000)

    async def disconnect(self, close_code):
        #: function for disconnect ws connection
        if (await self.desk_has_user()):
            await self.channel_layer.group_discard(self.group_name, self.channel_name)
        await self.close()

    @database_sync_to_async
    def get_desk_from_id(self):
        try:
            return Desk.objects.get(id=self.desk_id)
        except:
            return None

    @database_sync_to_async
    def get_table_from_id(self, table_id):
        try:
            return Table.objects.filter(desk=self.desk, id_on_desk=table_id)[0]
        except:
            return None

    @database_sync_to_async
    def get_card_from_id(self, table, card_id):
        try:
            return Card.objects.filter(desk=self.desk, table=table, id_on_table=card_id)[0]
        except:
            return None

    @database_sync_to_async
    def desk_has_user(self):
        #: checks if user in requested desk
        try:
            self.desk.server.users.get(email=self.scope['user'].email)
            return True
        except:
            return False

    @database_sync_to_async
    def create_table(self, title):
        #: creates table on desk
        table = Table(desk=self.desk, title=title,
            id_on_desk=(len(self.desk.table_set.all()) + 1))
        table.save()

    @database_sync_to_async
    def create_card(self, table_id, title):
        #: creates card on table
        table = Table.objects.get(desk=self.desk, id_on_desk=table_id)
        card = Card(desk=self.desk, table=table, title=title,
            id_on_table=(len(table.card_set.all()) + 1))
        card.save()

    @database_sync_to_async
    def move_card(self, old_table_id, old_card_id, new_table_id, new_card_id):
        #: moves card wherever you want
        table = async_to_sync(self.get_table_from_id)(old_table_id)
        card = async_to_sync(self.get_card_from_id)(table=table, card_id=old_card_id)
        if old_table_id != new_table_id:
            query = Card.objects.filter(desk=self.desk, table=table,
                id_on_table__gt=old_card_id)
        else:
            query = Card.objects.filter(desk=self.desk, table=table,
                id_on_table__gt=old_card_id).exclude(id_on_table__gt=new_card_id)
        for item in query:
            item.id_on_table -= 1
            item.save()
        if old_table_id != new_table_id:
            table = async_to_sync(self.get_table_from_id)(new_table_id)
            query = Card.objects.filter(desk=self.desk, table=table,
                id_on_table__gte=new_card_id)
            for item in query:
                item.id_on_table += 1
                item.save()
        card.table = table
        card.id_on_table = new_card_id
        card.save()

    @database_sync_to_async
    def move_table(self, old_table_id, new_table_id):
        #: moves table wherever you want
        table = async_to_sync(self.get_table_from_id)(old_table_id)
        query = Table.objects.filter(desk=self.desk, id_on_desk__gt=old_table_id)
        query = query.exclude(id_on_desk__gt=new_table_id)
        for item in query:
            item.id_on_desk -= 1
            item.save()
        table.id_on_desk = new_table_id
        table.save()

    @database_sync_to_async
    def remove_card(self, table_id, card_id):
        #: removes card from table
        table = async_to_sync(self.get_table_from_id)(table_id)
        card = async_to_sync(self.get_card_from_id)(table=table, card_id=card_id)
        query = Card.objects.filter(desk=self.desk, table=table,
            id_on_table__gt=card_id)
        for item in query:
            item.id_on_table -= 1
            item.save()
        card.delete()

    @database_sync_to_async
    def remove_table(self, table_id):
        #: removes table from desk
        table = async_to_sync(self.get_table_from_id)(table_id=table_id)
        query = Table.objects.filter(desk=self.desk, id_on_desk__gt=table_id)
        for item in query:
            item.id_on_desk -= 1
            item.save()
        table.delete()

    async def receive(self, text_data):
        #: function for recieve all desk actions
        text_data = json.loads(text_data)
        params = text_data['params']
        if text_data['action'] == 'create_table':
            await self.create_table(params['title'])
        elif text_data['action'] == 'create_card':
            await self.create_card(params['table_id'], params['title'])
        elif text_data['action'] == 'move_table':
            await self.move_table(params['old_table_id'], params['new_table_id'])
        elif text_data['action'] == 'move_card':
            await self.move_card(params['old_table_id'], params['old_card_id'],
                params['new_table_id'], params['new_card_id'])
        elif text_data['action'] == 'remove_table':
            await self.remove_table(params['table_id'])
        elif text_data['action'] == 'remove_card':
            await self.remove_card(params['table_id'], params['card_id'])

        await self.channel_layer.group_send(
            self.group_name,
            {
                'type': 'desk_action',
                'action': text_data['action'],
                'user': await get_full_name(self),
                'params': params
            }
        )

    async def desk_action(self, data):
        #: sends information about desk action to other desk members
        await self.send(text_data=json.dumps({
            'action': data['action'],
            'user': data['user'],
            'params': data['params']
        }))
