from django.db import models
from servers.models import Server, Label
from users.models import User, UserProfile
from .managers import DeskManager


class Desk(models.Model):
    """ Desk is a model of ToDo list (includes tables and cards in tables).
    It has id, title, server id, creator id, manager, used for working
    with objects (creating new).
    There are two methods: edit_title which allows title edition and
    add_users which allows adding users.
    """
    id = models.AutoField(primary_key=True, unique=True)
    title = models.CharField(max_length=30, verbose_name='desk title')
    server = models.ForeignKey(
        Server,
        verbose_name="server",
        on_delete=models.CASCADE
    )
    creator = models.ForeignKey(
        User,
        related_name='desk_creator',
        on_delete=models.CASCADE
    )
    objects = DeskManager()
    users = models.ManyToManyField(User, verbose_name='users')

    def edit_title(self, new_title):
        self.__dict__['title'] = new_title
        self.save()

    def add_users(self, tags):
        users = []
        for i in range(len(tags)):
            try:
                users.append(UserProfile.objects.get(tag=tags[i]).user)
            except:
                pass
        self.users.add(*users)
        self.save()


class Table(models.Model):
    """ Table is a model of ToDo table (includes cards).
    It has id, id on desk, title, desk.
    """
    id = models.AutoField(primary_key=True, unique=True)
    id_on_desk = models.IntegerField(verbose_name='position on desk', null=True, blank=True)
    title = models.CharField(max_length=30, verbose_name='table title')
    desk = models.ForeignKey(
        Desk,
        verbose_name="desk",
        on_delete=models.CASCADE
    )

    class Meta:
        ordering = ['id_on_desk']


class Card(models.Model):
    """ Card is a model of ToDo card.
    It has id, id on table, title, assignees of User, date expiration,
    flag of done, table, desk and labels.
    """
    id = models.AutoField(primary_key=True, unique=True)
    id_on_table = models.IntegerField(verbose_name='position on table', null=True, blank=True)
    title = models.CharField(max_length=30, verbose_name='desk title')
    assignees = models.ManyToManyField(User, verbose_name='assignees')
    date_expiration = models.DateField(verbose_name='date expiration', null=True, blank=True)
    is_done = models.BooleanField(verbose_name='done flag', default=False)
    table = models.ForeignKey(
        Table,
        verbose_name="table",
        on_delete=models.CASCADE
    )
    desk = models.ForeignKey(
        Desk,
        verbose_name="desk",
        on_delete=models.CASCADE
    )
    labels = models.ManyToManyField(Label, verbose_name='labels')

    class Meta:
        ordering = ['id_on_table']
