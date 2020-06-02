import json
from channels.db import database_sync_to_async
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer, AsyncWebsocketConsumer
from django.contrib.auth.models import AnonymousUser
from .models import Message, Server
from todos.models import Desk, Table, Card

@database_sync_to_async
def get_full_name(instance):
    return instance.scope['user'].profile.get_full_name()

class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.location = self.scope['query_string'].decode().split('&')[1][9:]
        print(self.location)
        if not (type(self.scope['user']) == AnonymousUser):
            await self.join_all_chats()
            await self.join_all_todos()
            await self.accept()
        else:
            await self.disconnect(3000)

    async def disconnect(self, close_code):
        if not (type(self.scope['user']) == AnonymousUser):
            for id in await self.get_chat_list():
                if self.location == ('chat_' + str(id)):
                    continue
                await self.channel_layer.group_discard('chat_' + str(id), self.channel_name)
            for id in await self.get_todos_list():
                if self.location == ('desk_' + str(id)):
                    continue
                await self.channel_layer.grop_discard('desk_' + str(id), self.channel_name)
        await self.close(code=close_code)

    @database_sync_to_async
    def get_chat_list(self):
        return [item.id for item in Server.objects.filter(users=self.scope['user'])]

    @database_sync_to_async
    def get_todos_list(self):
        query = async_to_sync(self.get_chat_list)()
        todos = []
        for id in query:
            todos += [item.id for item in Server.objects.get(id=id).desk_set.all()]
        return todos

    async def join_all_chats(self):
        query = await self.get_chat_list()
        for id in query:
            if ('chat_' + str(id)) == self.location:
                continue
            await self.channel_layer.group_add('chat_' + str(id), self.channel_name)

    async def join_all_todos(self):
        query = await self.get_todos_list()
        for todo in query:
            if ('desk_' + str(todo.id)) == self.location:
                continue
            await self.channel_layer.group_add('desk_' + str(todo.id), self.channel_name)

    async def receive(self, text_data):
        text_data = json.loads(text_data)
        await self.change_location(text_data)

    async def change_location(self, text_data):
        await self.channel_layer.group_discard(self.location, self.channel_name)
        self.location = text_data['location']
        await self.channel_layer.group_add(self.location, self.channel_name)

    async def chat_message(self, data):
        await self.send(text_data=json.dumps({
            'location': 'chat_' + str(data['params']['chat_id']),
            'action' : 'chat_message',
            'user': data['user']
            }
            ))

    async def desk_action(self, text_data):
        pass

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
        action = text_data['action']
        params = text_data['params']
        if action == 'chat_message':
            self.message_text = params['text']
            await self.save_message()
            self.user_name = await get_full_name(self)
            await self.channel_layer.group_send(
            self.group_name,
            {
                'type': 'chat_message',
                'user': self.user_name,
                'params': params
            }
            )

    async def chat_message(self, data):
        data['params']['chat_id'] = self.chat_id
        await self.send(text_data=json.dumps({
            'action': 'chat_message',
            'user': data['user'],
            'params': data['params']
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
            await self.move_table(params['old_table_id'], params['new_table_id'])
        elif text_data['action'] == 'move_card':
            await self.create_table(params['old_table_id'], params['old_card_id'],
                params['new_table_id'], params['new_card_id'])
        elif text_data['action'] == 'remove_table':
            await self.create_table(params['table_id'])
        elif text_data['action'] == 'remove_card':
            await self.create_table(params['table_id'], params['card_id'])

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
        await self.send(text_data=json.dumps({
            'action': data['action'],
            'user': data['user'],
            'params': data['params']
        }))

