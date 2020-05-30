import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from django.contrib.auth.models import AnonymousUser

class NotificationConsumer(WebsocketConsumer):
    def connect(self):
        if not (type(self.scope['user']) == AnonymousUser):
            self.accept()
        else:
            self.close(code=1015)

    def disconnect(self, close_code):
        self.close(code=1000)

    def receive(self, text_data):
        print(self.scope['user'])
        text_data = json.loads(text_data)
        self.location = text_data['location']
        if self.location == 'chat':
            self.chat_id = text_data['id']
            self.send(json.dumps(text_data))
