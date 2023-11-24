from django.db import models
import os
from django.conf import settings
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

class SuddenDraftUserManager(BaseUserManager):
    def create_user(self, email, username, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, username, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, username, password, **extra_fields)


def get_profile_picture_filepath(self, filename):
	return 'profile_picture/' + str(self.pk) + '/profile_picture.png'

def get_default_profile_picture():
	return "default/default_profile_picture.png"

class SuddenDraftUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=150, unique=True)
    personal_info = models.TextField(blank=True)
    profile_picture = models.ImageField(upload_to=get_profile_picture_filepath, blank=True, null=True, default=get_default_profile_picture)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = SuddenDraftUserManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']

    def __str__(self):
        return self.username
    
    def save(self, *args, **kwargs):
        # Проверяем, есть ли у пользователя изображение профиля
        if not self.profile_picture:
            self.profile_picture = get_default_profile_picture()

        super(SuddenDraftUser, self).save(*args, **kwargs)

