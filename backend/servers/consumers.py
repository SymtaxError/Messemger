import json
from channels.db import database_sync_to_async
from asgiref.sync import async_to_sync
from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.auth.models import AnonymousUser
from .models import Message, Server

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
