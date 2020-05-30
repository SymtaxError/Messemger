import json
from channels.db import database_sync_to_async
from channels.generic.websocket import WebsocketConsumer, AsyncWebsocketConsumer
from django.contrib.auth.models import AnonymousUser
from .models import Message, Server

class NotificationConsumer(WebsocketConsumer):
    def connect(self):
        if not (type(self.scope['user']) == AnonymousUser):
            self.accept()
        else:
            self.disconnect(3000)

    def disconnect(self, close_code):
        self.close(code=close_code)

    def receive(self, text_data):
        print(self.scope['user'])
        text_data = json.loads(text_data)
        self.location = text_data['location']
        if self.location == 'chat':
            self.chat_id = text_data['id']
            self.send(json.dumps(text_data))

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        if not (type(self.scope['user']) == AnonymousUser):
            self.chat_id = self.scope['url_route']['kwargs']['id']
            self.group_name = 'chat_' + str(self.chat_id)
            self.server = await self.get_server()
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
    def get_server(self):
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
        self.message_text = text_data['text']
        await self.save_message()
        await self.channel_layer.group_send(
            self.group_name,
            {
                'type': 'chat_message',
                'from': self.scope['user'].get_full_name(),
                'text': text_data['text']
            }
        )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            'from': event['from'],
            'text': event['text']
        }))


