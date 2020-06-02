from django.db import models
from django.contrib.auth.base_user import BaseUserManager

class ServerManager(BaseUserManager):
    def create_server(self, name, creator, type_chat, **kwargs):
        server = self.model(name=name, creator=creator, type_chat=type_chat)
        server.save(using=self.db)
        server.users.add(creator)
        server.save()
        return server

