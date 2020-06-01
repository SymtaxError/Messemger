from django.contrib.auth.base_user import BaseUserManager
from django.db import models

class UserManager(BaseUserManager):
    use_in_migrations = True

    def _create_user(self, email, password, **kwargs):
        email = self.normalize_email(email)
        user = self.model(email=email, **kwargs)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password, **kwargs):
        kwargs.setdefault('is_superuser', False)
        return self._create_user(email, password, **kwargs)

    def create_superuser(self, email, password,**kwargs):
        kwargs.setdefault('is_superuser', True)
        return self._create_user(email, password, **kwargs) 

class ProfileManager(models.Manager):
    def create_profile(self, user, first_name, last_name):
        profile = self.model(user=user, first_name=first_name, last_name=last_name)
        profile.update_tag()
        profile.save(using=self.db)
        return profile
