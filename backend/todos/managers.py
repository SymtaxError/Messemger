from django.contrib.auth.base_user import BaseUserManager

class DeskManager(BaseUserManager):
    def create_desk(self, title, server, creator, *args):
        desk = self.model(title=title, creator=creator, server=server)
        desk.save(using=self.db)
        desk.users.add(creator)
        for user in args:
            desk.users.add(user)
        desk.save()
        return desk