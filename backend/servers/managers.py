from django.db import models
from django.contrib.auth.base_user import BaseUserManager

class ServerManager(BaseUserManager):
    def create_server(self, name, user, **kwargs):
        server = self.model(name=name, user)
        server.users.add(user)
        server.save(using=self.db)
        return server

