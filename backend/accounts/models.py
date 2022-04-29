from django.db import models
from django.contrib.auth.models import AbstractUser
from phonenumber_field.modelfields import PhoneNumberField

# Create your models here.
class CustomUser(AbstractUser):
    username = models.CharField(unique=True, max_length=200)
    email = models.EmailField(unique = True)
    avatar = models.ImageField(upload_to='user_avatars/', null=True, blank=True)
    phone_number = PhoneNumberField(unique = True, null = True, blank = True)
    follows = models.ManyToManyField(to='restaurants.Restaurant', blank=True, related_name='follows')
    notification = models.ManyToManyField(to='Notification', blank=True, related_name="notifications")
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.email
        
class Notification(models.Model):
    restaurant = models.ForeignKey(to='restaurants.Restaurant', null=True, related_name="restaurant", on_delete=models.CASCADE)
    user = models.ForeignKey(to='accounts.CustomUser', null=True, related_name="user", on_delete=models.CASCADE)
    type = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)