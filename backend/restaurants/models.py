from distutils.command.upload import upload
from django.db import models
from django.db.models import SET_NULL
from django.core.validators import FileExtensionValidator
from phonenumber_field.modelfields import PhoneNumberField

# Create your models here.
class Restaurant(models.Model):
    name = models.CharField(max_length=500)
    address = models.CharField(max_length=500)
    desc = models.TextField()
    logo = models.ImageField(upload_to='restaurant_logos/', null=True, blank=True)
    postal_code = models.CharField(max_length=500)
    phone_number = PhoneNumberField(unique = True)
    owner = models.OneToOneField(to='accounts.CustomUser', related_name='owner', on_delete=models.CASCADE)
    liked_by = models.ManyToManyField(to='accounts.CustomUser', blank=True, related_name="liked_by")
    followed_by = models.ManyToManyField(to='accounts.CustomUser', blank=True, related_name="followed_by")
    comments = models.ManyToManyField(to='network.Comment', blank=True, related_name="restaurant_comments")
    menu = models.OneToOneField(to='Menu', null=True, blank=True, related_name="menu_restaurant", on_delete=models.CASCADE)
    gallery = models.ManyToManyField(to='PostImage', blank=True,related_name='posts_images')

    def __str__(self):
        return self.name

class FoodItem(models.Model):
    name = models.CharField(max_length=200)
    description = models.CharField(max_length=500)
    type = models.CharField(max_length=100)
    price = models.FloatField(null=False, default=0)

class Menu(models.Model):
    food_items = models.ManyToManyField(to=FoodItem, related_name='food_items')
    restaurant = models.ForeignKey(to='Restaurant', null=True, related_name="restaurant_menu", on_delete=SET_NULL)

class Blog(models.Model):
    name = models.CharField(max_length=200)
    content = models.TextField(max_length=5000)
    picture = models.ImageField(upload_to='blog_pictures/', null=True, blank=True)
    restaurant = models.ForeignKey(to='Restaurant', null=True, related_name="restaurant_blog", on_delete=SET_NULL)
    liked_by = models.ManyToManyField(to='accounts.CustomUser', blank=True, related_name="liked_by_blog")
    created_date = models.DateTimeField(auto_now_add=True)

class PostImage(models.Model):
    image = models.ImageField(upload_to='post-images',validators=[FileExtensionValidator(['png','jpg','gif','jpeg'])])
    uploaded_at = models.DateTimeField(auto_now_add=True)