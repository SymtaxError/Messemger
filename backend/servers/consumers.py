import json
from channels.db import database_sync_to_async
from channels.generic.websocket import WebsocketConsumer, AsyncWebsocketConsumer
from django.contrib.auth.models import AnonymousUser
from .models import Message, Server
from todos.models import Desk, Table, Card

class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.location = self.scope['location']
        if not (type(self.scope['user']) == AnonymousUser):
            for chat in database_sync_to_async(Server.objects.filter)(users=self.scope['user']):
                if ('chat_' + str(chat_id)) == self.location:
                    continue
                await self.channel_layer.group_add('chat_' + str(chat.id), self.channel_name)
            for todo in database_sync_to_async(Desk.server.objects.filter)(users=self.scope['user']):
                if ('desk_' + str(chat_id)) == self.location:
                    continue
                await self.channel_layer.group_add('desk_' + str(todo.id), self.channel_name)
            await self.accept()
        else:
            await self.disconnect(3000)

    async def disconnect(self, close_code):
        for chat in database_sync_to_async(Server.objects.filter)(users=self.scope['user']):
            if self.location == ('chat_' + str(chat.id)):
                continue
            await self.channel_layer.group_discard('chat_' + str(chat.id), self.channel_name)
        for todo in database_sync_to_async(Desk.server.objects.filter)(users=self.scope['user']):
            if self.location == ('desk_' + str(todo.id)):
                continue
            await self.channel_layer.grop_discard('desk_' + str(todo.id), self.channel_name)
        await self.close(code=close_code)

    async def receive(self, text_data):
        text_data = json.loads(text_data)
        await self.send(json.dumps(text_data({
            'location' : text_data['location'],
            'action' : text_data['action']
        })))

    async def change_location(self, text_data):
        await self.channel_layer.group_add(self.location, self.channel_layer)
        self.location = text_data['location']
        await self.channel_layer.group_discard(self.location, self.channel_layer)
        await self.send(json.dumps(text_data({
            'location' : self.location,
            'action' : text_data['action']
        })))


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        if not (type(self.scope['user']) == AnonymousUser):
            self.chat_id = self.scope['url_route']['kwargs']['id']
            self.group_name = 'chat_' + str(self.chat_id)
            self.server = await self.get_server_from_id()
            if (self.server != None) and (await self.server_has_user()):
                await self.channel_layer.group_add(self.group_name, self.channel_name)
                await self.accept()
        else:
            await self.disconnect(3000)

    async def disconnect(self, close_code):
        if (await self.server_has_user()):
            await self.channel_layer.group_discard(self.group_name, self.channel_name)
        await self.close()

    @database_sync_to_async
    def get_server_from_id(self):
        try:
            return Server.objects.get(id=self.chat_id)
        except:
            return None

    @database_sync_to_async
    def server_has_user(self):
        try:
            self.server.users.get(email=self.scope['user'].email)
            return True
        except:
            return False

    @database_sync_to_async
    def save_message(self):
        message = Message(server=self.server, owner=self.scope['user'], text=self.message_text)
        message.save()

    async def receive(self, text_data):
        text_data = json.loads(text_data)
        params = text_data['params']
        self.message_text = params['text']
        await self.save_message()
        await self.channel_layer.group_send(
            self.group_name,
            {
                'type': 'chat_message',
                'user': self.scope['user'].profile.get_full_name(),
                'action': text_data['action'],
                'params': params
            }
        )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            'user': event['user'],
            'action': event['action'],
            'params': event['params']
        }))

class ToDoConsumer(AsyncWebsocketConsumer):
    async def connect(self):
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
            return Table.objects.get(desk=self.desk, id_on_desk=table_id)
        except:
            return None

    @database_sync_to_async
    def get_card_from_id(self, table, card_id):
        try:
            return Card.objects.get(desk=self.desk, table=table, id_on_table=card_id)
        except:
            return None

    @database_sync_to_async
    def desk_has_user(self):
        try:
            self.desk.server.users.get(email=self.scope['user'].email)
            return True
        except:
            return False

    @database_sync_to_async
    def create_table(self, title):
        table = Table(desk=self.desk, title=title,
            id_on_desk=(len(self.desk.table_set.all()) + 1))
        table.save()

    @database_sync_to_async
    def create_card(self, table_id, title):
        table = Table.objects.get(desk=self.desk, id_on_desk=table_id)
        card = Card(desk=self.desk, table=table, title=title,
            id_on_table=(len(table.card_set.all()) + 1))
        card.save()

    @database_sync_to_async
    def move_card(self, old_table_id, old_card_id, new_table_id, new_card_id):
        table = self.get_table_from_id(old_table_id)
        card = self.get_card_from_id(table=table, card_id=old_card_id)
        if old_table_id != new_table_id:
            query = Card.objects.filter(desk=self.desk, table=table,
                id_on_table__gt=old_card_id)
        else:
            query = Card.objects.filter(desk=self.desk, table=table,
                id_on_table__gt=old_card_id).exclude(id_on_table__gte=new_card_id)
        for item in query:
            item.id_on_table -= 1
            item.save()
        if old_table_id != new_table_id:
            table = self.get_table_from_id(new_table_id)
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
        table = self.get_table_from_id(old_table_id)
        query = Table.objects.filter(desk=self.desk, id_on_desk__gt=old_table_id)
        query.exclude(id_on_desk__gte=new_table_id)
        for item in query:
            item.id_on_desk -= 1
            item.save()
        table.id_on_desk = new_table_id
        table.save()

    @database_sync_to_async
    def remove_card(self, table_id, card_id):
        table = self.get_table_from_id(table_id)
        card = self.get_card_from_id(table=table, card_id=card_id)
        query = Card.objects.filter(desk=self.desk, table=table,
            id_on_table__gt=old_table_id)
        for item in query:
            item.id_on_table -= 1
            item.save()
        card.delete()

    @database_sync_to_async
    def remove_table(self, table_id):
        table = self.get_table_from_id(table_id=table_id)
        query = Table.objects.filter(desk=self.desk, id_on_desk__gt=old_table_id)
        for item in query:
            item.id_on_desk -= 1
            item.save()
        table.delete()

    async def receive(self, text_data):
        text_data = json.loads(text_data)
        params = text_data['params']
        if text_data['action'] == 'create_table':
            await self.create_table(params['title'])
        elif text_data['action'] == 'create_card':
            await self.create_card(params['table_id'], params['title'])
        elif text_data['action'] == 'move_table':
            pass
        elif text_data['action'] == 'move_card':
            pass
        elif text_data['action'] == 'remove_table':
            pass
        elif text_data['action'] == 'remove_card':
            pass

        await self.channel_layer.group_send(
            self.group_name,
            {
                'type': 'desk_action',
                'user': self.scope['user'].profile.get_full_name(),
                'action': text_data['action'],
                'params': params
            }
        )

    async def desk_action(self, event):
        await self.send(text_data=json.dumps({
            'user': event['user'],
            'action': event['action'],
            'params': event['params']
        }))

