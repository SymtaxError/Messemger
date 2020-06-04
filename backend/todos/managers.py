from django.contrib.auth.base_user import BaseUserManager
from users.models import UserProfile

class DeskManager(BaseUserManager):
    def create_desk(self, title, server_id, creator, *args):
        desk = self.model(title=title, creator=creator,
            server=creator.server_set.get(id=server_id))
        desk.save(using=self.db)
        desk.users.add(creator)
        for user_tag in args:
            try:
                user = UserProfile.objects.get(tag=user_tag).user
                if len(user.server_set.filter(id=server_id)) > 0:
                    desk.users.add(UserProfile.objects.get(tag=user_tag).user)
            except:
                pass
        desk.save()
        return desk