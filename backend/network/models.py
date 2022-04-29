from django.db import models

# Create your models here.
class Comment(models.Model):
    user = models.ForeignKey(to='accounts.CustomUser', related_name="user_comment", null=True, on_delete=models.CASCADE)
    restaurant = models.ForeignKey(to='restaurants.Restaurant', related_name="restaurant_comment", null=True, on_delete=models.CASCADE)
    content = models.TextField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)
