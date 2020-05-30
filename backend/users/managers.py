from django.contrib.auth.base_user import BaseUserManager

class UserManager(BaseUserManager):
    use_in_migrations = True

    def _create_user(self, email, password, first_name, last_name, **kwargs):
        email = self.normalize_email(email)
        user = self.model(email=email, first_name=first_name,
            last_name=last_name, **kwargs)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password, first_name, last_name, **kwargs):
        kwargs.setdefault('is_superuser', False)
        return self._create_user(email, password, first_name, last_name, **kwargs)

    def create_superuser(self, email, password, first_name, last_name, **kwargs):
        kwargs.setdefault('is_superuser', True)
        return self._create_user(email, password, first_name, last_name, **kwargs) 
