from django.db import models
from django.contrib.auth.base_user import BaseUserManager
from users.models import UserProfile

class ServerManager(BaseUserManager):
    """ Provides interacting with server instances stored in database. """
    def create_server(self, name, creator, type_chat, **kwargs):
        """ Creates a new Server instance. Required fields are name, creator
        and type_chat. """
        server = self.model(name=name, creator=creator, type_chat=type_chat)
        server.save(using=self.db)
        server.users.add(creator)
        server.save()
        return server

class MessageManager(BaseUserManager):
    """ Provides interacting with message instances stored in database."""
    def create_message(self, text, owner, server, **kwargs):
        """ Creates a new Message instance. Required fields are text, owner
        and server."""
        message = self.model(text=text, owner=owner, server=server)
        message.save(using=self.db)
        return message

class LabelManager(BaseUserManager):
    """ Provides interacting with label instances stored in database."""
    def create_label(self, text, color, **kwargs):
        """ Creates a new Label instance. Required fields are text and color."""
        label = self.model(text=text, color=color)
        label.save(using=self.db)
        return label
