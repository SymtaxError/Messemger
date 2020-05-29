from django.contrib.auth.base_user import BaseUserManager

class CustomerManager(BaseUserManager):
    use_in_migrations = True

    def _create_user(self, email, password, first_name, last_name, **kwargs):
        '''
        Creates and saves a Customer with the given email, password, first_name
        and last_name
        '''
        email = self.normalize_email(email)
        user = self.model(email=email, first_name=first_name, \
            last_name=last_name, **kwargs)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password, first_name, last_name, **kwargs):
        kwargs.setdefault('is_superuser', False)
        return self._create_user(email, password, first_name, last_name, **kwargs)

    def create_superuser(self, email, password, first_name, last_name, **kwargs):
        kwargs.setdefault('is_superuser', True)

        if kwargs.get('is_superuser') is not True:
            raise ValueError("Superuser must have is_superuser = True")

        return self._create_user(email, password, first_name, last_name, **kwargs) 
